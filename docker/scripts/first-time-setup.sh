#!/bin/bash
# first-time-setup.sh - Script de configuração inicial do Docker
# Execute apenas na primeira vez que for usar o ambiente Docker

set -e

echo "=========================================="
echo "USE Nerd - Configuração Inicial Docker"
echo "=========================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker não está instalado!${NC}"
    echo "Por favor, instale o Docker Desktop primeiro:"
    echo "  https://docs.docker.com/desktop/"
    exit 1
fi

echo -e "${GREEN}✓ Docker encontrado${NC}"

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose não está instalado!${NC}"
    echo "Por favor, instale o Docker Compose:"
    echo "  https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✓ Docker Compose encontrado${NC}"
echo ""

# Verificar se .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}! Arquivo .env não encontrado${NC}"

    if [ -f .env.example ]; then
        echo -e "${BLUE}Copiando .env.example para .env...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✓ Arquivo .env criado${NC}"
    else
        echo -e "${RED}✗ .env.example também não foi encontrado!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Arquivo .env encontrado${NC}"
fi

echo ""
echo -e "${BLUE}Iniciando build das imagens Docker...${NC}"
echo "Isso pode demorar alguns minutos na primeira vez."
echo ""

# Build das imagens
docker-compose build

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Build concluído com sucesso!${NC}"
else
    echo -e "${RED}✗ Erro no build das imagens${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Iniciando serviços...${NC}"
echo ""

# Iniciar serviços
docker-compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Serviços iniciados!${NC}"
else
    echo -e "${RED}✗ Erro ao iniciar serviços${NC}"
    exit 1
fi

# Aguardar serviços ficarem prontos
echo ""
echo -e "${BLUE}Aguardando serviços ficarem prontos...${NC}"
sleep 10

# Verificar health
echo -e "${BLUE}Verificando status dos serviços...${NC}"
docker-compose ps

echo ""
echo -e "${BLUE}Executando migrations do banco de dados...${NC}"

# Executar migrations
docker-compose exec -T medusa-backend npm run medusa db:migrate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations executadas com sucesso!${NC}"
else
    echo -e "${RED}✗ Erro ao executar migrations${NC}"
    echo "Você pode tentar novamente manualmente com:"
    echo "  make migrate"
fi

# Perguntar se quer executar seed
echo ""
read -p "Deseja executar o seed de dados de exemplo? (s/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${BLUE}Executando seed...${NC}"
    docker-compose exec -T medusa-backend npm run seed

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Seed executado com sucesso!${NC}"
    else
        echo -e "${YELLOW}! Erro ao executar seed (isso é opcional)${NC}"
    fi
fi

# Fazer chmod nos scripts
chmod +x docker/scripts/*.sh 2>/dev/null || true

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Configuração concluída com sucesso!${NC}"
echo "=========================================="
echo ""
echo -e "${YELLOW}Serviços disponíveis:${NC}"
echo "  - Backend API:       http://localhost:9000"
echo "  - Admin Dashboard:   http://localhost:9000/app"
echo "  - Health Check:      http://localhost:9000/health"
echo "  - PostgreSQL:        localhost:5432"
echo "  - Redis:             localhost:6379"
echo ""
echo -e "${YELLOW}Comandos úteis:${NC}"
echo "  make help            - Ver todos os comandos"
echo "  make logs            - Ver logs em tempo real"
echo "  make shell           - Abrir shell no backend"
echo "  make psql            - Conectar ao PostgreSQL"
echo "  make down            - Parar todos os serviços"
echo ""
echo -e "${YELLOW}Documentação completa:${NC}"
echo "  docker/README.md"
echo ""
echo "=========================================="
echo -e "${GREEN}Bom desenvolvimento! 🚀${NC}"
echo "=========================================="
