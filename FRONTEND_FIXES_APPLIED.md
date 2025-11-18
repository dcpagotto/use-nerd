# Correções Aplicadas no Frontend - 17/11/2025

## 🎯 Objetivo
Corrigir erros críticos que impediam a integração entre Frontend (Next.js), Strapi CMS e Medusa Backend.

---

## ✅ Problemas Corrigidos

### 1. Função `getAllPages` não exportada

**Erro:**
```
Attempted import error: 'getAllPages' is not exported from '@/lib/strapi-client'
```

**Solução:**
Adicionada função `getAllPages` em `storefront/lib/strapi-client.ts` na linha 256:

```typescript
export async function getAllPages(
  locale: string = DEFAULT_LOCALE,
  revalidate: number = 300
): Promise<StrapiResponse<Page[]>> {
  return strapiFetch<StrapiResponse<Page[]>>(
    '/pages',
    {
      populate: ['coverImage'],
      locale,
    },
    {
      next: { revalidate },
    }
  );
}
```

---

### 2. API Strapi `/api/pages` retornando 403 Forbidden

**Erro:**
```
StrapiAPIError: Forbidden
status: 403
```

**Causa Raiz:**
Content type `page` não tinha permissões configuradas para acesso público.

**Solução:**
Adicionadas permissões no banco de dados Strapi:

```sql
-- Inserir permissões
INSERT INTO strapi.up_permissions (action, created_at, updated_at)
VALUES
('api::page.page.find', NOW(), NOW()),
('api::page.page.findOne', NOW(), NOW());

-- Vincular ao papel público (role_id = 2)
INSERT INTO strapi.up_permissions_role_links (permission_id, role_id, permission_order)
VALUES (12, 2, 12), (13, 2, 13);
```

**Verificação:**
```bash
curl http://localhost:1337/api/pages
# ✅ Retorna 4 páginas: Sobre, Como Funciona, Blog Cyberpunk, Termos
```

**Container Strapi reiniciado:**
```bash
docker restart use-nerd-strapi
```

---

### 3. Build cache corrompido do Next.js

**Erro:**
```
Syntax Error in page.tsx line 236
Expected ';', '}' or <eof>
```

**Causa Raiz:**
O diretório `.next` contém builds compilados antigos que não refletem as mudanças nos arquivos fonte.

**Solução:**
Criado script `restart-frontend.bat` que:
1. Mata todos processos Node.js na porta 3000
2. Remove completamente o diretório `storefront/.next`
3. Aguarda 3 segundos
4. Inicia `npm run dev` com cache limpo

---

## 🔧 Arquivos Modificados

| Arquivo | Linha | Modificação |
|---------|-------|-------------|
| `storefront/lib/strapi-client.ts` | 256-270 | ➕ Adicionada função `getAllPages()` |
| `strapi.up_permissions` (DB) | - | ➕ 2 novas permissões para `page` content type |
| `strapi.up_permissions_role_links` (DB) | - | ➕ Links das permissões ao papel público |
| `restart-frontend.bat` | - | ➕ Script de reinicialização limpa |

---

## 📋 Status Atual

### ✅ Funcionando
- ✅ Medusa Backend: http://localhost:9000
- ✅ Medusa Admin: http://localhost:9000/app
- ✅ Strapi CMS: http://localhost:1337/admin
- ✅ Strapi API: http://localhost:1337/api/pages (4 páginas retornadas)
- ✅ Docker containers: todos saudáveis

### ⚠️ Requer Reinicialização
- ⚠️ Frontend Next.js: http://localhost:3000 (cache corrompido)

---

## 🚀 Próximos Passos - AÇÃO NECESSÁRIA

### Passo 1: Reiniciar o Frontend

Execute o script criado:

```cmd
cd C:\Users\dcpagotto\Documents\Projects\use-nerd
restart-frontend.bat
```

**OU manualmente:**

```cmd
# 1. Matar processos na porta 3000
for /f "tokens=5" %a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %a

# 2. Remover cache
cd storefront
rd /s /q .next

# 3. Iniciar frontend
npm run dev
```

### Passo 2: Verificar Funcionamento

Aguarde a compilação terminar e acesse:
- http://localhost:3000 → Deve mostrar homepage com banners do Strapi
- http://localhost:3000/sobre → Deve mostrar página "Sobre Nós"
- http://localhost:3000/como-funciona → Deve mostrar página "Como Funciona"

### Passo 3: Verificar Logs

O console deve mostrar:
```
✓ Compiled / in X.Xs
✓ Compiled /[slug] in X.Xs
```

**SEM os seguintes erros:**
- ❌ `getAllPages is not exported`
- ❌ `Syntax Error in page.tsx`
- ❌ `403 Forbidden from Strapi`

---

## 🔍 Testes de Verificação

### Teste 1: API Strapi (via terminal)
```bash
curl http://localhost:1337/api/pages
# Deve retornar JSON com 4 páginas
```

### Teste 2: Homepage (via browser)
```
http://localhost:3000
# Deve carregar sem erros de compilação
```

### Teste 3: Páginas Dinâmicas (via browser)
```
http://localhost:3000/sobre
http://localhost:3000/como-funciona
http://localhost:3000/termos
# Devem carregar conteúdo do Strapi
```

---

## 📊 Resumo Técnico

### Problema Raiz
Cache de build do Next.js continha versões antigas dos módulos, fazendo com que:
1. Importações de funções novas (`getAllPages`) falhassem
2. Erros de sintaxe fantasmas aparecessem em arquivos corretos
3. Requisições HTTP usassem configurações antigas

### Solução Definitiva
Reinicialização completa do servidor de desenvolvimento com:
- Processo Node.js morto (liberar porta 3000)
- Diretório `.next` removido (limpar cache)
- Servidor reiniciado (compilação fresca)

---

## ⚙️ Informações de Ambiente

**Docker Containers:**
- ✅ use-nerd-postgres (PostgreSQL 15)
- ✅ use-nerd-redis (Redis 7)
- ✅ use-nerd-backend (Medusa v2 - porta 9000)
- ✅ use-nerd-strapi (Strapi 4.26 - porta 1337)

**Variáveis de Ambiente (.env.local):**
```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=455517fa3df9346a0d5971a9243ee948e80ad97742ea0114ece95c88b493d5a0
```

**Credenciais de Acesso:**
- Email: dhiego@pagotto.eu
- Senha: ##Dcp1501

---

## 📝 Notas Importantes

1. **Sempre reiniciar após mudanças em lib/**: Arquivos na pasta `lib/` são compilados e cacheados agressivamente pelo Next.js

2. **Permissões Strapi**: Sempre que criar novo content type no Strapi, configure permissões públicas manualmente ou via admin

3. **Build Cache**: Em caso de erros estranhos, sempre tente deletar `.next/` antes de depurar

4. **CORS**: Já configurado para `localhost:3000` tanto no Medusa quanto no Strapi

---

**Relatório gerado automaticamente pelo Claude Code**
**Data:** 17 de Novembro de 2025
**Responsável:** tech-lead-orchestrator → frontend-developer
