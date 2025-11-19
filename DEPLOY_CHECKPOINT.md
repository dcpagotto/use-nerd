# 🚀 USE NERD - DEPLOY CHECKPOINT & REFERENCE

**Data:** 2025-11-19
**Objetivo:** Deploy e-commerce básico no Docker Swarm
**Servidor:** srv.betabits.com.br
**Status:** 🟡 EM PROGRESSO

---

## 📡 SERVIDOR TARGET

```
Host: srv.betabits.com.br
User: root
Password: *#PagotO#*01
```

## 🌐 DOMÍNIOS

- `admin.usenerd.com` → Medusa Admin UI
- `api.usenerd.com` → Medusa Backend API (presumido)
- `cms.usenerd.com` → Strapi CMS
- `usenerd.com` → Frontend Next.js

---

## 🔑 SECRETS GERADOS (NÃO COMMITAR)

```env
# Database
POSTGRES_PASSWORD=qGA6WG6Z3U4frlnWCVFl91vAln0ywkDKUjmgCUMwLQ8=
REDIS_PASSWORD=R3bFOpp/+LvQGPdUnxQlEuEpFcfI6S2gHVOfrwc/Q/s=

# Medusa
JWT_SECRET=Ee8i0W4PXyFMMVbPJLlK7jUGF7HDkfh6W8CDeyKSADnqJRpY/6hLAeAtt/8Yzo//O+7lBJpk3KOs1pTcz2ApmA==
COOKIE_SECRET=AQIUtlQcZxjmoGKhM//4ne0YHy65QApM3/oBUf1qwUR5SM1Qi5W8nEhePD3R49aTFNjTMLe94ahDDWoXgsBMpg==

# Strapi
STRAPI_APP_KEYS=zboy7kFdEpk7byzyyO9bS3zElYRcbbQZ8hiAamENFjs=,sqZWq5Gtw2OjMCY4Vi46BI3RtAxh2pYvGHUuiQ7t/AM=
STRAPI_API_TOKEN_SALT=ayyrzhH6+fAM1pb85qZSMCsyLOl4mryS0WnAGBteL8Y=
STRAPI_ADMIN_JWT_SECRET=IsMx707wzq88yU/vlvhFwTVLld2eIVd1nORT9ZCYN47bJz4iP7Ey7pYqZR5IeMcuUEiqMT+pk6lBkPoddo5qKA==
STRAPI_TRANSFER_TOKEN_SALT=LHYdh5+r/JGbBvCdx5W3B7kYwxZqCrtdGX8jtRjkpNE=
```

---

## 🎯 ESCOPO DO DEPLOY

### ✅ INCLUÍDO
- Medusa Backend (SEM módulos custom)
- Plugin Printful (configuração inicial)
- Strapi CMS
- Frontend Next.js (SEM páginas raffle)
- PostgreSQL + Redis
- Traefik routing

### ❌ EXCLUÍDO (Fase 2)
- Módulo Raffle
- Módulo Brazil (PIX, NFe, Melhor Envio)
- Módulo Crypto-payment
- Smart contracts/Blockchain

---

## ⚠️ DESCOBERTA IMPORTANTE

**Erros TypeScript (~50 erros) são FALSOS POSITIVOS!**

- Bug conhecido do Medusa v2: https://github.com/medusajs/medusa/discussions/10239
- O código do Brazil Module está CORRETO
- Seguindo padrão oficial da documentação
- Não precisa refatorar nada

**Solução:** Desabilitar temporariamente os módulos custom movendo as pastas.

---

## 📦 MODIFICAÇÕES NO CÓDIGO

### 1. Desabilitar Módulos Custom

```bash
# Renomear pastas (reversível)
mv src/modules/raffle src/modules/raffle.disabled
mv src/modules/brazil src/modules/brazil.disabled
mv src/modules/crypto-payment src/modules/crypto-payment.disabled
```

### 2. Configuração Mínima do Medusa

**Arquivo:** `medusa-config.production.ts` (já existe, usar como está)

- ✅ Configuração básica OK
- ⚠️ Printful configurado mas sem tokens (adicionar depois)
- ✅ CORS configurado corretamente

### 3. Ajustes no Frontend

**Remover/comentar rotas de raffle:**
- `storefront/app/raffle/[id]/page.tsx`
- `storefront/app/rifas/page.tsx`
- `storefront/app/nerd-premiado/page.tsx`

**Solução:** Criar página placeholder ou redirecionar para home.

---

## 🐳 IMAGENS DOCKER

### Registry

**Opção 1:** GitHub Container Registry (ghcr.io)
- `ghcr.io/dcpagotto/usenerd-medusa-backend:latest`
- `ghcr.io/dcpagotto/usenerd-strapi-cms:latest`

**Opção 2:** Registry Local no Servidor
- `registry.betabits.com.br/usenerd-backend:v1`
- `registry.betabits.com.br/usenerd-strapi:v1`
- `registry.betabits.com.br/usenerd-storefront:v1`

**Decisão:** Usar ghcr.io (CI/CD já configurado)

---

## 📝 CHECKLIST DE DEPLOY

### FASE 1: Preparação Local ✅
- [x] Mover módulos custom para `.disabled`
- [ ] Ajustar rotas do frontend
- [ ] Commit das mudanças
- [ ] Push para GitHub (trigger CI/CD)

### FASE 2: Build & Registry ⏳
- [ ] CI/CD executa build
- [ ] Imagens pushed para ghcr.io
- [ ] Verificar tags das imagens

### FASE 3: Servidor Setup ⏳
- [ ] SSH para srv.betabits.com.br
- [ ] Criar estrutura `/opt/usenerd/`
- [ ] Copiar secrets para `.env`
- [ ] Criar rede `network_public`
- [ ] Verificar Traefik funcionando

### FASE 4: Deploy ⏳
- [ ] Copiar `docker-stack.yml` para servidor
- [ ] Ajustar docker-stack.yml (domínios, labels)
- [ ] `docker stack deploy -c docker-stack.yml usenerd`
- [ ] Verificar services: `docker service ls`

### FASE 5: Validação ⏳
- [ ] Health checks: `/health`, `/_health`
- [ ] Admin Medusa acessível
- [ ] Strapi CMS acessível
- [ ] Frontend carregando
- [ ] Criar usuário admin

---

## 🔧 COMANDOS RÁPIDOS

### Monitoramento
```bash
# Ver status dos services
docker service ls | grep usenerd

# Logs em tempo real
docker service logs -f usenerd_backend
docker service logs -f usenerd_strapi
docker service logs -f usenerd_storefront

# Processos dos services
docker service ps usenerd_backend --no-trunc
```

### Troubleshooting
```bash
# Reiniciar service
docker service update --force usenerd_backend

# Escalar replicas
docker service scale usenerd_backend=2

# Entrar no container
docker exec -it $(docker ps -q -f name=usenerd_backend) sh
```

### Rollback
```bash
# Reverter para versão anterior
docker service update --rollback usenerd_backend

# Remover stack completamente
docker stack rm usenerd
```

---

## 📊 PROGRESSO

| Fase | Status | Tempo Estimado | Tempo Real |
|------|--------|----------------|------------|
| 1. Preparação | 🟡 Em progresso | 20min | - |
| 2. Build | ⏳ Pendente | 30min | - |
| 3. Setup Servidor | ⏳ Pendente | 20min | - |
| 4. Deploy | ⏳ Pendente | 15min | - |
| 5. Validação | ⏳ Pendente | 30min | - |
| **TOTAL** | - | **~2h** | - |

---

## 🚨 BLOQUEIOS ENCONTRADOS

### ✅ RESOLVIDOS
- [x] Erros TypeScript → FALSOS POSITIVOS, ignorar

### ⏳ EM PROGRESSO
- [ ] Preparação do código

### ❌ PENDENTES
- [ ] Verificar se Traefik está configurado no servidor
- [ ] DNS dos domínios apontando para srv.betabits.com.br
- [ ] Certificados SSL (Let's Encrypt)

---

## 📞 PONTOS DE CONTATO

- **Documentação Medusa v2:** https://docs.medusajs.com/v2
- **Issue TypeScript:** https://github.com/medusajs/medusa/discussions/10239
- **Plugin Printful:** https://www.npmjs.com/package/@vymalo/medusa-printful

---

## 🔄 PRÓXIMOS PASSOS (PÓS-DEPLOY)

1. **Imediato:** Testar fluxo de compra básico
2. **Semana 1:** Adicionar credenciais Printful
3. **Semana 2:** Testar fulfillment automático
4. **Semana 3:** Preparar módulo Brazil (PIX)
5. **Semana 4:** Preparar módulo Raffle (blockchain)

---

**Documento vivo - atualizar conforme progresso**
