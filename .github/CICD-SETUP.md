# CI/CD Pipeline - Configuração e Uso

Este documento descreve como configurar e usar o pipeline de CI/CD completo para o projeto USE Nerd.

## 📋 Visão Geral

O pipeline é composto por 3 workflows principais:

1. **CI** (`ci.yml`) - Build, Test & Lint
   - Executa em: PRs e pushes para `main` e `develop`
   - Valida: TypeScript, ESLint, Testes, Build

2. **CD Build** (`cd-build-images.yml`) - Build & Push Docker Images
   - Executa em: Push para `main` (após CI passar)
   - Constrói: Imagens Docker do Backend e Strapi
   - Publica: GitHub Container Registry (ghcr.io)

3. **Deploy** (`deploy-swarm.yml`) - Deploy para Docker Swarm
   - Executa em: Após CD Build completar com sucesso
   - Deploy: Atualiza stack no Docker Swarm
   - Health Check: Valida serviços após deploy

## 🔐 Secrets Necessários

Configure os seguintes secrets no GitHub: **Settings → Secrets and variables → Actions → New repository secret**

### Secrets de Infraestrutura (Docker Swarm)

| Secret | Descrição | Exemplo |
|--------|-----------|---------|
| `SWARM_HOST` | IP ou hostname do manager do Swarm | `swarm.usenerd.com` ou `192.168.1.100` |
| `SWARM_USER` | Usuário SSH para conectar ao Swarm | `deploy` ou `root` |
| `SWARM_SSH_PRIVATE_KEY` | Chave SSH privada (formato PEM) | `-----BEGIN RSA PRIVATE KEY-----\n...` |

### Secrets de Banco de Dados

| Secret | Descrição | Como gerar |
|--------|-----------|------------|
| `POSTGRES_PASSWORD` | Senha do PostgreSQL | `openssl rand -base64 32` |
| `REDIS_PASSWORD` | Senha do Redis | `openssl rand -base64 32` |

### Secrets do Medusa Backend

| Secret | Descrição | Como gerar |
|--------|-----------|------------|
| `JWT_SECRET` | Secret para JWT tokens | `openssl rand -base64 64` |
| `COOKIE_SECRET` | Secret para cookies | `openssl rand -base64 64` |

### Secrets do Strapi CMS

| Secret | Descrição | Como gerar |
|--------|-----------|------------|
| `STRAPI_APP_KEYS` | App keys (4 keys separadas por vírgula) | Ver abaixo |
| `STRAPI_API_TOKEN_SALT` | Salt para API tokens | `openssl rand -base64 32` |
| `STRAPI_ADMIN_JWT_SECRET` | Secret para admin JWT | `openssl rand -base64 64` |
| `STRAPI_TRANSFER_TOKEN_SALT` | Salt para transfer tokens | `openssl rand -base64 32` |

#### Gerar STRAPI_APP_KEYS

```bash
# Gerar 4 chaves e concatenar com vírgula
echo "$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)"
```

## 🚀 Como Usar o Pipeline

### 1. Desenvolvimento Normal (Pull Requests)

```bash
# Criar branch de feature
git checkout -b feature/nova-funcionalidade

# Fazer alterações
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push origin feature/nova-funcionalidade

# Criar Pull Request no GitHub
# ✅ CI será executado automaticamente
```

O workflow CI vai:
- ✅ Validar TypeScript
- ✅ Executar testes
- ✅ Fazer build do Backend e Strapi
- ❌ Bloquear merge se falhar

### 2. Deploy para Produção (Main Branch)

```bash
# Merge do PR para main (via GitHub)
# OU push direto para main (não recomendado)
git checkout main
git merge feature/nova-funcionalidade
git push origin main
```

Pipeline automático:
1. ✅ **CI** executa (build, test, lint)
2. ✅ **CD Build** constrói imagens Docker
3. ✅ **Deploy** atualiza Docker Swarm
4. ✅ **Health Check** valida serviços

### 3. Deploy Manual (Workflow Dispatch)

```bash
# Via GitHub CLI
gh workflow run deploy-swarm.yml

# Via GitHub Web UI
# Actions → Deploy to Docker Swarm → Run workflow
```

### 4. Rollback (Em Caso de Problemas)

```bash
# Via SSH no servidor Swarm
ssh deploy@swarm.usenerd.com

# Rollback dos serviços
docker service update --rollback usenerd_backend
docker service update --rollback usenerd_strapi

# Verificar status
docker stack services usenerd
```

## 🔧 Configuração Inicial

### 1. Configurar SSH no Servidor Swarm

```bash
# No servidor Swarm
# Criar usuário de deploy
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG docker deploy

# Gerar chave SSH (no seu computador local)
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/swarm_deploy

# Copiar chave pública para o servidor
ssh-copy-id -i ~/.ssh/swarm_deploy.pub deploy@swarm.usenerd.com

# Testar conexão
ssh -i ~/.ssh/swarm_deploy deploy@swarm.usenerd.com

# Copiar conteúdo da chave privada para o secret SWARM_SSH_PRIVATE_KEY
cat ~/.ssh/swarm_deploy
```

### 2. Criar Network no Docker Swarm

```bash
# No servidor Swarm
docker network create --driver=overlay --attachable network_public
```

### 3. Configurar Secrets no GitHub

```bash
# Via GitHub CLI (recomendado)
gh secret set SWARM_HOST -b "swarm.usenerd.com"
gh secret set SWARM_USER -b "deploy"
gh secret set SWARM_SSH_PRIVATE_KEY < ~/.ssh/swarm_deploy

# Gerar e configurar secrets de aplicação
gh secret set POSTGRES_PASSWORD -b "$(openssl rand -base64 32)"
gh secret set REDIS_PASSWORD -b "$(openssl rand -base64 32)"
gh secret set JWT_SECRET -b "$(openssl rand -base64 64)"
gh secret set COOKIE_SECRET -b "$(openssl rand -base64 64)"

# Strapi secrets
gh secret set STRAPI_APP_KEYS -b "$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)"
gh secret set STRAPI_API_TOKEN_SALT -b "$(openssl rand -base64 32)"
gh secret set STRAPI_ADMIN_JWT_SECRET -b "$(openssl rand -base64 64)"
gh secret set STRAPI_TRANSFER_TOKEN_SALT -b "$(openssl rand -base64 32)"
```

### 4. Verificar Configuração

```bash
# Listar secrets configurados
gh secret list

# Testar workflow manualmente
gh workflow run ci.yml
```

## 📊 Monitoramento do Pipeline

### Verificar Status dos Workflows

```bash
# Listar workflows
gh workflow list

# Ver runs recentes
gh run list

# Ver detalhes de um run específico
gh run view <run-id>

# Ver logs de um workflow
gh run view <run-id> --log
```

### Verificar Deploy no Swarm

```bash
# SSH no servidor
ssh deploy@swarm.usenerd.com

# Ver status do stack
docker stack services usenerd

# Ver logs dos serviços
docker service logs usenerd_backend
docker service logs usenerd_strapi

# Ver métricas
docker stats
```

## 🐛 Troubleshooting

### CI falha com erro de build

```bash
# Executar build localmente
npm install --legacy-peer-deps
npm run build

# Verificar erros de TypeScript
npx tsc --noEmit
```

### CD Build falha ao fazer push da imagem

```bash
# Verificar permissões do GITHUB_TOKEN
# Settings → Actions → General → Workflow permissions
# ✅ Marcar "Read and write permissions"
```

### Deploy falha ao conectar no Swarm

```bash
# Verificar chave SSH
ssh -i ~/.ssh/swarm_deploy deploy@swarm.usenerd.com

# Verificar se o usuário está no grupo docker
groups deploy
```

### Serviços não sobem após deploy

```bash
# SSH no servidor
ssh deploy@swarm.usenerd.com

# Ver logs detalhados
docker service logs --tail 100 usenerd_backend
docker service logs --tail 100 usenerd_strapi

# Ver eventos do Swarm
docker events --filter type=service

# Inspecionar serviço
docker service inspect usenerd_backend --pretty
```

## 📈 Melhorias Futuras

- [ ] Adicionar testes E2E (Playwright/Cypress)
- [ ] Implementar code coverage reporting (Codecov)
- [ ] Adicionar análise de segurança (Snyk, Dependabot)
- [ ] Implementar ambientes de staging
- [ ] Adicionar smoke tests após deploy
- [ ] Configurar alertas (Slack/Discord)
- [ ] Implementar blue-green deployment
- [ ] Adicionar métricas de performance (Lighthouse CI)

## 📚 Recursos Úteis

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Swarm Documentation](https://docs.docker.com/engine/swarm/)
- [Medusa Documentation](https://docs.medusajs.com/)
- [Strapi Documentation](https://docs.strapi.io/)

---

**Última atualização:** 2025-11-19
**Mantido por:** Equipe USE Nerd
