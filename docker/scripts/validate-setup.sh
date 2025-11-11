#!/bin/bash
# validate-setup.sh - Valida configuração Docker
# Execute para verificar se tudo está configurado corretamente

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Validação de Configuração Docker"
echo "=========================================="
echo ""

ERRORS=0
WARNINGS=0

# Função para verificar
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

warn() {
    echo -e "${YELLOW}!${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

info() {
    echo -e "${BLUE}i${NC} $1"
}

# Verificações de Pré-requisitos
echo -e "${BLUE}=== Verificando Pré-requisitos ===${NC}"
echo ""

command -v docker &> /dev/null
check "Docker instalado"

command -v docker-compose &> /dev/null
check "Docker Compose instalado"

docker info &> /dev/null
check "Docker daemon está rodando"

echo ""

# Verificações de Arquivos
echo -e "${BLUE}=== Verificando Arquivos ===${NC}"
echo ""

test -f docker-compose.yml
check "docker-compose.yml existe"

test -f Dockerfile
check "Dockerfile existe"

test -f .dockerignore
check ".dockerignore existe"

test -f .env
check ".env existe"

test -f Makefile
check "Makefile existe"

test -f docker/README.md
check "Documentação Docker existe"

echo ""

# Verificações de Configuração .env
echo -e "${BLUE}=== Verificando .env ===${NC}"
echo ""

if [ -f .env ]; then
    grep -q "DATABASE_URL.*postgres:5432" .env
    check "DATABASE_URL usa 'postgres' como host"

    grep -q "REDIS_URL.*redis:6379" .env
    check "REDIS_URL usa 'redis' como host"

    grep -q "JWT_SECRET" .env
    check "JWT_SECRET configurado"

    grep -q "COOKIE_SECRET" .env
    check "COOKIE_SECRET configurado"

    # Avisos de segurança
    if grep -q "JWT_SECRET=supersecret" .env; then
        warn "JWT_SECRET está usando valor padrão (altere em produção!)"
    fi

    if grep -q "COOKIE_SECRET=supersecret" .env; then
        warn "COOKIE_SECRET está usando valor padrão (altere em produção!)"
    fi
fi

echo ""

# Verificações de Sintaxe
echo -e "${BLUE}=== Verificando Sintaxe ===${NC}"
echo ""

docker-compose config &> /dev/null
check "docker-compose.yml tem sintaxe válida"

echo ""

# Verificações de Portas
echo -e "${BLUE}=== Verificando Portas ===${NC}"
echo ""

if command -v netstat &> /dev/null; then
    netstat -tuln 2>/dev/null | grep -q ":9000 " && warn "Porta 9000 já está em uso" || check "Porta 9000 disponível"
    netstat -tuln 2>/dev/null | grep -q ":5432 " && warn "Porta 5432 já está em uso" || check "Porta 5432 disponível"
    netstat -tuln 2>/dev/null | grep -q ":6379 " && warn "Porta 6379 já está em uso" || check "Porta 6379 disponível"
else
    info "netstat não disponível - pulando verificação de portas"
fi

echo ""

# Verificações de Containers (se estiverem rodando)
echo -e "${BLUE}=== Verificando Containers ===${NC}"
echo ""

if docker-compose ps | grep -q "Up"; then
    info "Containers estão rodando"
    echo ""

    # Verificar health
    docker-compose ps | grep postgres | grep -q "healthy" && check "PostgreSQL está healthy" || warn "PostgreSQL não está healthy"
    docker-compose ps | grep redis | grep -q "healthy" && check "Redis está healthy" || warn "Redis não está healthy"
    docker-compose ps | grep medusa-backend | grep -q "Up" && check "Backend está rodando" || warn "Backend não está rodando"

    echo ""

    # Verificar conectividade
    echo -e "${BLUE}=== Verificando Conectividade ===${NC}"
    echo ""

    curl -f http://localhost:9000/health &> /dev/null && check "Backend responde em /health" || warn "Backend não responde"

    docker-compose exec -T postgres pg_isready -U postgres &> /dev/null && check "PostgreSQL aceita conexões" || warn "PostgreSQL não aceita conexões"

    docker-compose exec -T redis redis-cli ping &> /dev/null && check "Redis aceita conexões" || warn "Redis não aceita conexões"

else
    info "Containers não estão rodando (isso é normal se você ainda não iniciou)"
    echo ""
    echo "Para iniciar os containers:"
    echo "  make up"
    echo ""
fi

# Verificações de Espaço em Disco
echo -e "${BLUE}=== Verificando Recursos ===${NC}"
echo ""

if command -v docker &> /dev/null; then
    DOCKER_SIZE=$(docker system df -v 2>/dev/null | grep "Total" | awk '{print $5}' | head -1 || echo "N/A")
    info "Espaço usado pelo Docker: $DOCKER_SIZE"

    IMAGES_COUNT=$(docker images | wc -l)
    info "Imagens Docker: $((IMAGES_COUNT - 1))"

    VOLUMES_COUNT=$(docker volume ls | wc -l)
    info "Volumes Docker: $((VOLUMES_COUNT - 1))"
fi

echo ""

# Resumo
echo "=========================================="
echo -e "${BLUE}Resumo da Validação${NC}"
echo "=========================================="
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Configuração válida!${NC}"
    echo ""
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Avisos: $WARNINGS${NC}"
        echo "Verifique os avisos acima (não são críticos)"
    fi
else
    echo -e "${RED}✗ Foram encontrados $ERRORS erros${NC}"
    echo ""
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Avisos: $WARNINGS${NC}"
    fi
    echo ""
    echo "Por favor, corrija os erros acima antes de continuar."
    exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Próximos passos:${NC}"
echo "=========================================="
echo ""

if ! docker-compose ps | grep -q "Up"; then
    echo "1. Iniciar serviços:"
    echo "   make up"
    echo ""
    echo "2. Executar migrations:"
    echo "   make migrate"
    echo ""
    echo "3. (Opcional) Executar seed:"
    echo "   make seed"
    echo ""
    echo "4. Acessar aplicação:"
    echo "   http://localhost:9000"
else
    echo "✓ Serviços já estão rodando!"
    echo ""
    echo "Comandos úteis:"
    echo "  make logs          - Ver logs"
    echo "  make health        - Verificar health"
    echo "  make shell         - Abrir shell"
    echo ""
fi

echo "Documentação completa: docker/README.md"
echo ""
