#!/bin/bash

# ============================================
# Script de Configuração Automática de Secrets
# USE Nerd - GitHub Actions Secrets Setup
# ============================================

echo "🔐 Configurando secrets do GitHub Actions..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# 1. Verificar se gh CLI está instalado
# ============================================
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) não encontrado!${NC}"
    echo "Instale com: choco install gh (Windows) ou brew install gh (Mac)"
    exit 1
fi

echo -e "${GREEN}✅ GitHub CLI encontrado${NC}"

# ============================================
# 2. Verificar autenticação
# ============================================
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Você não está autenticado no GitHub CLI${NC}"
    echo "Execute: gh auth login"
    exit 1
fi

echo -e "${GREEN}✅ Autenticado no GitHub${NC}"
echo ""

# ============================================
# 3. Secrets de Infraestrutura (MANUAL)
# ============================================
echo -e "${YELLOW}⚠️  ATENÇÃO: Configure os secrets de infraestrutura primeiro!${NC}"
echo ""
echo "Você precisa configurar manualmente:"
echo "  1. SWARM_HOST - IP ou hostname do servidor Docker Swarm"
echo "  2. SWARM_USER - Usuário SSH para deploy"
echo "  3. SWARM_SSH_PRIVATE_KEY - Chave SSH privada (PEM format)"
echo ""
read -p "Você já configurou esses secrets? (s/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${YELLOW}Configure os secrets de infraestrutura:${NC}"
    echo ""
    echo "# 1. Configure SWARM_HOST"
    echo "gh secret set SWARM_HOST -b \"seu-servidor.com\""
    echo ""
    echo "# 2. Configure SWARM_USER"
    echo "gh secret set SWARM_USER -b \"deploy\""
    echo ""
    echo "# 3. Configure SWARM_SSH_PRIVATE_KEY"
    echo "gh secret set SWARM_SSH_PRIVATE_KEY < ~/.ssh/swarm_deploy"
    echo ""
    echo "Execute este script novamente após configurar."
    exit 0
fi

# ============================================
# 4. Configurar Secrets de Aplicação
# ============================================
echo ""
echo "🚀 Configurando secrets de aplicação..."
echo ""

# Database Secrets
echo "📦 Configurando secrets de database..."
gh secret set POSTGRES_PASSWORD -b "qGA6WG6Z3U4frlnWCVFl91vAln0ywkDKUjmgCUMwLQ8="
gh secret set REDIS_PASSWORD -b "R3bFOpp/+LvQGPdUnxQlEuEpFcfI6S2gHVOfrwc/Q/s="

# Medusa Backend Secrets
echo "🔧 Configurando secrets do Medusa Backend..."
gh secret set JWT_SECRET -b "Ee8i0W4PXyFMMVbPJLlK7jUGF7HDkfh6W8CDeyKSADnqJRpY/6hLAeAtt/8Yzo//O+7lBJpk3KOs1pTcz2ApmA=="
gh secret set COOKIE_SECRET -b "AQIUtlQcZxjmoGKhM//4ne0YHy65QApM3/oBUf1qwUR5SM1Qi5W8nEhePD3R49aTFNjTMLe94ahDDWoXgsBMpg=="

# Strapi CMS Secrets
echo "📝 Configurando secrets do Strapi CMS..."
gh secret set STRAPI_APP_KEYS -b "zboy7kFdEpk7byzyyO9bS3zElYRcbbQZ8hiAamENFjs=,sqZWq5Gtw2OjMCY4Vi46BI3RtAxh2pYvGHUuiQ7t/AM=,SP/eHmJDNRca5cFPzPVPRu+p7632MAJU0WUsSlm3a8I=,uXYTRDZJT3bPU6qSeSPC3xufZyeJV3aw6Gs9btuxoYQ="
gh secret set STRAPI_API_TOKEN_SALT -b "ayyrzhH6+fAM1pb85qZSMCsyLOl4mryS0WnAGBteL8Y="
gh secret set STRAPI_ADMIN_JWT_SECRET -b "IsMx707wzq88yU/vlvhFwTVLld2eIVd1nORT9ZCYN47bJz4iP7Ey7pYqZR5IeMcuUEiqMT+pk6lBkPoddo5qKA=="
gh secret set STRAPI_TRANSFER_TOKEN_SALT -b "23818AFQU3jDIbEs5Ak8IS2soeIml6CU7S5kjhTVF5c="

echo ""
echo -e "${GREEN}✅ Todos os secrets de aplicação configurados!${NC}"
echo ""

# ============================================
# 5. Listar todos os secrets configurados
# ============================================
echo "📋 Secrets configurados no repositório:"
echo ""
gh secret list

echo ""
echo -e "${GREEN}🎉 Configuração completa!${NC}"
echo ""
echo "Próximos passos:"
echo "  1. Corrigir erros de TypeScript no código"
echo "  2. Fazer push para main (triggers CI/CD automaticamente)"
echo "  3. Acompanhar o deploy: gh run list"
echo ""
echo "⚠️  IMPORTANTE: Delete o arquivo .secrets.env.example após confirmar que tudo está funcionando!"
