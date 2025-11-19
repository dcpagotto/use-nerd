# GitHub Actions Workflows

Este diretório contém os workflows do GitHub Actions para o pipeline CI/CD do projeto USE Nerd.

## 📋 Workflows Disponíveis

### 1. `ci.yml` - Continuous Integration
**Trigger:** Push e Pull Requests para `main` e `develop`

Responsabilidades:
- ✅ TypeScript type checking
- ✅ ESLint (linting)
- ✅ Testes unitários
- ✅ Testes de integração
- ✅ Build do Backend (Medusa)
- ✅ Build do Strapi CMS

**Duração estimada:** ~5-8 minutos

### 2. `cd-build-images.yml` - Build & Push Docker Images
**Trigger:** Push para `main` (após CI passar)

Responsabilidades:
- 🐳 Build da imagem Docker do Backend (Medusa)
- 🐳 Build da imagem Docker do Strapi CMS
- 📦 Push para GitHub Container Registry (ghcr.io)
- 🏷️ Tag automático (latest, branch, SHA)

**Duração estimada:** ~10-15 minutos

### 3. `deploy-swarm.yml` - Deploy to Docker Swarm
**Trigger:** Após `cd-build-images.yml` completar com sucesso

Responsabilidades:
- 🚀 Deploy automático para Docker Swarm
- 🔄 Rolling update dos serviços
- 🏥 Health checks pós-deploy
- 🔙 Rollback automático em caso de falha

**Duração estimada:** ~3-5 minutos

## 🔄 Fluxo Completo

```
┌─────────────────┐
│   Git Push      │
│   (main/dev)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   CI Workflow   │ ◄── Build, Test, Lint
│   (ci.yml)      │
└────────┬────────┘
         │ ✅ Success
         ▼
┌─────────────────┐
│  CD Build       │ ◄── Build & Push Docker Images
│(cd-build-*.yml) │
└────────┬────────┘
         │ ✅ Images Ready
         ▼
┌─────────────────┐
│ Deploy Swarm    │ ◄── Update Services in Swarm
│(deploy-*.yml)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ✅ Production  │
│   Running!      │
└─────────────────┘
```

## 🚀 Quick Start

### Configurar Secrets

```bash
# Ver lista completa de secrets necessários
cat ../.github/CICD-SETUP.md

# Configurar via GitHub CLI
gh secret set SWARM_HOST -b "seu-servidor.com"
gh secret set SWARM_USER -b "deploy"
gh secret set SWARM_SSH_PRIVATE_KEY < ~/.ssh/swarm_deploy
# ... outros secrets
```

### Executar Workflow Manualmente

```bash
# CI (para testar)
gh workflow run ci.yml

# Deploy (apenas main branch)
gh workflow run deploy-swarm.yml
```

### Monitorar Workflows

```bash
# Listar workflows ativos
gh run list

# Ver detalhes de um workflow
gh run view <run-id>

# Ver logs
gh run view <run-id> --log
```

## 📊 Status dos Workflows

Você pode verificar o status dos workflows em:
- **GitHub UI:** `Actions` tab no repositório
- **README badges:** (adicionar badges no README principal)

## 🔧 Manutenção

### Atualizar versões de actions

```bash
# Verificar actions desatualizadas
grep "uses:" *.yml | grep -v "@v4" | grep -v "@v5"

# Atualizar para versões mais recentes
# actions/checkout@v3 → actions/checkout@v4
# actions/setup-node@v3 → actions/setup-node@v4
```

### Debugar workflows

```bash
# Habilitar debug logging
gh secret set ACTIONS_RUNNER_DEBUG -b "true"
gh secret set ACTIONS_STEP_DEBUG -b "true"

# Executar novamente
gh run rerun <run-id>
```

## 📚 Documentação Completa

Para instruções detalhadas de configuração e troubleshooting, consulte:
- [CICD-SETUP.md](../CICD-SETUP.md)

## 🐛 Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| CI falha em build | `npm run build` localmente para reproduzir |
| CD não faz push de imagens | Verificar permissões do GITHUB_TOKEN |
| Deploy falha ao conectar | Verificar SWARM_SSH_PRIVATE_KEY |
| Serviços não sobem | `docker service logs usenerd_backend` |

---

**Última atualização:** 2025-11-19
