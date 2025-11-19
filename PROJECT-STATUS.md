# 📊 STATUS DO PROJETO USE NERD

**Última atualização:** 2025-11-19
**Status geral:** 🟡 **EM DESENVOLVIMENTO - QUASE PRONTO PARA DEPLOY**

---

## ✅ O QUE ESTÁ PRONTO

### 1. Infraestrutura CI/CD ✅
- ✅ GitHub Actions configurado
- ✅ Workflow de CI (Build, Test, Lint)
- ✅ Workflow de CD (Build & Push Docker Images)
- ✅ Workflow de Deploy (Docker Swarm)
- ✅ Documentação completa (CICD-SETUP.md)
- ✅ Secrets gerados (arquivo .secrets.env.example)

### 2. Docker & Containers ✅
- ✅ Dockerfile multi-stage para Backend (Medusa)
- ✅ Dockerfile multi-stage para Strapi CMS
- ✅ docker-compose.web.yml (desenvolvimento)
- ✅ docker-stack.yml (produção Swarm)
- ✅ Health checks configurados
- ✅ Traefik labels configurados

### 3. Backend (Medusa v2.0) ✅
- ✅ Medusa v2.0 instalado e configurado
- ✅ PostgreSQL como database
- ✅ Redis para cache/queue
- ✅ Módulos customizados iniciados:
  - ✅ Raffle Module (rifas blockchain)
  - ✅ Módulo de integrações

### 4. Strapi CMS ✅
- ✅ Strapi instalado e configurado
- ✅ Integração com PostgreSQL
- ✅ Build otimizado

### 5. Blockchain ✅
- ✅ Hardhat configurado
- ✅ Contratos Solidity estruturados
- ✅ Integração Chainlink VRF planejada
- ✅ Polygon (Matic) como rede

---

## ⚠️ PROBLEMAS QUE PRECISAM SER CORRIGIDOS

### 1. 🔴 CRÍTICO - Erros de TypeScript (Bloqueiam Deploy)

#### Problema 1: vite.config.ts
```
❌ Module '"vite"' has no exported member 'defineConfig'.
Arquivo: src/admin/vite.config.ts:1
```

**Causa:** Possível incompatibilidade de versão ou cache do npm
**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# OU usar import alternativo
import { defineConfig as viteDef } from 'vite'
```

#### Problema 2: Tipos de Entidades Medusa (raffle)
```
❌ Property 'status' does not exist on type 'DmlEntity<...>'
❌ Property 'total_tickets' does not exist on type 'DmlEntity<...>'
❌ Property 'id' does not exist on type 'DmlEntity<...>'
❌ Property 'created_at' does not exist on type 'DmlEntity<...>'

Arquivo: src/api/admin/raffles/[id]/test-draw/route.ts
Linhas: 60, 63, 81, 113, 125, 130
```

**Causa:** Tipos das entidades não estão completos ou desatualizados
**Soluções possíveis:**
1. Verificar se os modelos estão corretamente definidos em `src/modules/raffle/models/`
2. Fazer cast explícito dos tipos
3. Usar `as any` temporariamente (não recomendado para produção)

#### Problema 3: Event Bus Service
```
❌ 'eventBusService' is of type 'unknown'.
Arquivo: src/api/admin/raffles/[id]/test-draw/route.ts:98
```

**Causa:** Tipagem do EventBus não reconhecida
**Solução:**
```typescript
const eventBusService = req.scope.resolve("eventBusService") as any
// OU
const eventBusService: IEventBusService = req.scope.resolve("eventBusService")
```

#### Problema 4: DTO Incompatível
```
❌ Object literal may only specify known properties, but 'transaction_hash' does not exist in type 'CreateRaffleDrawDTO'
Arquivo: src/api/admin/raffles/[id]/test-draw/route.ts:78
```

**Causa:** Campo `transaction_hash` deveria ser `vrf_transaction_hash`
**Solução:** Renomear campo no código

### 2. 🟡 MÉDIO - Configurações Faltando

#### Cache do npm no GitHub Actions
```
⚠️ Some specified paths were not resolved, unable to cache dependencies.
Workflow: Strapi CMS CI
```

**Causa:** Path do package-lock.json do Strapi incorreto
**Solução:** Já corrigida no workflow (cache-dependency-path: strapi-cms/package-lock.json)

---

## 🔐 SECRETS QUE PRECISAM SER CONFIGURADOS

### ✅ Secrets Gerados (Arquivo: .secrets.env.example)

Todos os secrets de aplicação foram gerados e estão no arquivo `.secrets.env.example`:

- ✅ POSTGRES_PASSWORD
- ✅ REDIS_PASSWORD
- ✅ JWT_SECRET
- ✅ COOKIE_SECRET
- ✅ STRAPI_APP_KEYS
- ✅ STRAPI_API_TOKEN_SALT
- ✅ STRAPI_ADMIN_JWT_SECRET
- ✅ STRAPI_TRANSFER_TOKEN_SALT

### ❌ Secrets de Infraestrutura (VOCÊ PRECISA CONFIGURAR)

```bash
# SSH para Docker Swarm
SWARM_HOST=seu-servidor.com          # IP ou hostname do servidor Swarm
SWARM_USER=deploy                     # Usuário SSH
SWARM_SSH_PRIVATE_KEY=<sua-chave>    # Chave SSH privada (PEM)
```

### 📝 Como Configurar

**Opção 1: Script Automatizado (Recomendado)**
```bash
# 1. Configure primeiro os secrets de infraestrutura
gh secret set SWARM_HOST -b "seu-servidor.com"
gh secret set SWARM_USER -b "deploy"
gh secret set SWARM_SSH_PRIVATE_KEY < ~/.ssh/swarm_deploy

# 2. Execute o script (descomente as linhas no .secrets.env.example)
# Ou copie e cole cada comando manualmente
```

**Opção 2: Via GitHub Web UI**
```
1. Acesse: https://github.com/dcpagotto/use-nerd/settings/secrets/actions
2. Clique em "New repository secret"
3. Cole cada secret do arquivo .secrets.env.example
```

---

## 📋 CHECKLIST ANTES DO DEPLOY

### Fase 1: Corrigir Código ⚠️
- [ ] Corrigir erro do vite.config.ts (defineConfig)
- [ ] Corrigir tipos das entidades Raffle
- [ ] Corrigir tipagem do EventBusService
- [ ] Renomear transaction_hash para vrf_transaction_hash
- [ ] Rodar `npm run build` localmente com sucesso
- [ ] Rodar `npx tsc --noEmit` sem erros

### Fase 2: Configurar Secrets 🔐
- [ ] Configurar SWARM_HOST
- [ ] Configurar SWARM_USER
- [ ] Configurar SWARM_SSH_PRIVATE_KEY
- [ ] Configurar todos os secrets de aplicação (via script ou manual)
- [ ] Validar secrets: `gh secret list`

### Fase 3: Preparar Servidor Swarm 🖥️
- [ ] Servidor com Docker Swarm inicializado
- [ ] Usuário de deploy criado e configurado
- [ ] Chave SSH configurada
- [ ] Network overlay criada: `docker network create --driver=overlay --attachable network_public`
- [ ] Traefik rodando e configurado (se ainda não estiver)
- [ ] Testar conexão SSH: `ssh deploy@seu-servidor.com`

### Fase 4: Primeiro Deploy 🚀
- [ ] Push para branch main (triggers CI/CD automaticamente)
- [ ] Aguardar CI passar (Build + Test)
- [ ] Aguardar CD Build passar (Docker images)
- [ ] Aguardar Deploy passar (Swarm update)
- [ ] Validar health checks:
  - [ ] https://api.usenerd.com/health
  - [ ] https://admin.usenerd.com/health
  - [ ] https://cms.usenerd.com/_health

### Fase 5: Validação Pós-Deploy ✅
- [ ] Testar acesso ao admin Medusa
- [ ] Testar acesso ao Strapi CMS
- [ ] Verificar logs dos serviços: `docker service logs usenerd_backend`
- [ ] Verificar status do stack: `docker stack services usenerd`
- [ ] Testar rollback manual (se necessário)

---

## 🛠️ COMANDOS ÚTEIS

### Desenvolvimento Local
```bash
# Backend Medusa
npm install --legacy-peer-deps
npm run dev

# Build
npm run build

# Testes
npm run test:unit
npm run test:integration:http

# TypeScript check
npx tsc --noEmit
```

### CI/CD
```bash
# Listar workflows
gh workflow list

# Ver runs recentes
gh run list

# Ver detalhes de um run
gh run view <run-id>

# Ver logs de falha
gh run view <run-id> --log-failed

# Executar workflow manualmente
gh workflow run deploy-swarm.yml
```

### Docker Swarm (SSH no servidor)
```bash
# Ver status do stack
docker stack services usenerd

# Ver logs
docker service logs usenerd_backend
docker service logs usenerd_strapi

# Escalar serviços
docker service scale usenerd_backend=3

# Rollback
docker service update --rollback usenerd_backend

# Remover stack
docker stack rm usenerd
```

---

## 📈 ROADMAP PÓS-DEPLOY

### Curto Prazo (1-2 semanas)
- [ ] Configurar monitoramento (Prometheus + Grafana)
- [ ] Configurar alertas (Slack/Discord)
- [ ] Implementar testes E2E (Playwright)
- [ ] Configurar code coverage (Codecov)
- [ ] Implementar ambiente de staging

### Médio Prazo (1 mês)
- [ ] Implementar frontend Next.js 14
- [ ] Completar módulo de Raffle com blockchain
- [ ] Integrar Printful/Printify (POD)
- [ ] Integrar pagamentos Brasil (PIX, Mercado Pago)
- [ ] Implementar NFe (Nota Fiscal)

### Longo Prazo (3 meses)
- [ ] Deploy de smart contracts na Polygon mainnet
- [ ] Integração completa Chainlink VRF
- [ ] Sistema de gamificação
- [ ] Mobile app (React Native)
- [ ] Internacionalização (i18n)

---

## 🐛 TROUBLESHOOTING

### CI falha com erro de TypeScript
```bash
# Rodar localmente para reproduzir
npx tsc --noEmit

# Ver erros específicos
npm run build
```

### CD falha ao fazer push de imagens
```bash
# Verificar permissões do GITHUB_TOKEN
# Settings → Actions → General → Workflow permissions
# ✅ Marcar "Read and write permissions"
```

### Deploy falha ao conectar no Swarm
```bash
# Testar conexão SSH manualmente
ssh -i ~/.ssh/swarm_deploy deploy@seu-servidor.com

# Verificar se usuário está no grupo docker
ssh deploy@servidor "groups"
```

### Serviços não sobem após deploy
```bash
# SSH no servidor e verificar logs
ssh deploy@servidor
docker service logs --tail 100 usenerd_backend

# Ver eventos do Swarm
docker events --filter type=service
```

---

## 📞 SUPORTE

- **Documentação CI/CD:** `.github/CICD-SETUP.md`
- **Workflows:** `.github/workflows/README.md`
- **Issues:** https://github.com/dcpagotto/use-nerd/issues
- **Medusa Docs:** https://docs.medusajs.com/
- **Strapi Docs:** https://docs.strapi.io/

---

**Status:** 🟡 Em desenvolvimento - Aguardando correção de erros TypeScript e configuração de secrets
**Próximo passo:** Corrigir erros de tipo no código e configurar secrets de infraestrutura
**Bloqueio atual:** Erros de TypeScript impedem CI de passar
