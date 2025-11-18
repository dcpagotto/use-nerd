# Documentacao Tecnica - USE Nerd

> Indice completo da documentacao tecnica do projeto

**Atualizado**: 2025-11-18
**Versao**: 1.1

---

## Documentos Disponiveis

### 1. Guias de Desenvolvimento

| Documento | Descricao | Publico | Tempo Leitura |
|-----------|-----------|---------|---------------|
| [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) | Guia completo para setup, desenvolvimento e troubleshooting | Desenvolvedores | 25 min |
| [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | Schema completo do PostgreSQL, migrations, backup/restore | DBAs, Backend Devs | 30 min |

### 2. Arquitetura e APIs (NOVO!)

| Documento | Descricao | Publico | Tempo Leitura |
|-----------|-----------|---------|---------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitetura completa do sistema, diagramas, padroes de design | Arquitetos, Tech Leads, Devs | 40 min |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | Referencia completa de APIs (Store, Admin, Raffle, Strapi CMS) | Frontend Devs, Integradores | 35 min |

---

## Quick Links

### Setup & Onboarding

- [Pre-requisitos](./DEVELOPER_GUIDE.md#pre-requisitos) - Node.js, Docker, Git
- [Setup do Ambiente](./DEVELOPER_GUIDE.md#setup-do-ambiente) - Passo a passo completo
- [Como Rodar](./DEVELOPER_GUIDE.md#como-rodar) - Docker vs Local

### Arquitetura

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - **NOVO!** Arquitetura completa do sistema
  - [Visao Geral](./ARCHITECTURE.md#1-system-overview)
  - [Diagramas de Arquitetura](./ARCHITECTURE.md#2-architecture-diagram)
  - [Stack Tecnologico](./ARCHITECTURE.md#3-technology-stack)
  - [Padroes de Design](./ARCHITECTURE.md#4-design-patterns)
  - [Estrutura de Modulos](./ARCHITECTURE.md#5-module-structure)
  - [Fluxo de Dados](./ARCHITECTURE.md#6-data-flow)
  - [Integracoes Externas](./ARCHITECTURE.md#7-external-integrations)
  - [Seguranca](./ARCHITECTURE.md#8-security-architecture)
  - [Escalabilidade](./ARCHITECTURE.md#9-scalability-considerations)
- [Estrutura do Projeto](./DEVELOPER_GUIDE.md#estrutura-do-projeto) - Arvore de diretorios
- [Arquitetura de Modulos Medusa](./DEVELOPER_GUIDE.md#arquitetura-de-modulos-medusa) - Models, Services, Workflows, Subscribers
- [Database Schema Completo](./DATABASE_SCHEMA.md#modulos-customizados) - Tabelas customizadas

### APIs

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - **NOVO!** Referencia completa de APIs
  - [Autenticacao](./API_DOCUMENTATION.md#2-authentication) - JWT, API Keys, Sessions
  - [Store API](./API_DOCUMENTATION.md#5-store-api-endpoints) - Produtos, Carrinho, Checkout
  - [Admin API](./API_DOCUMENTATION.md#6-admin-api-endpoints) - Gerenciamento de produtos, pedidos
  - [Raffle API](./API_DOCUMENTATION.md#7-custom-raffle-api) - Rifas e tickets
  - [Strapi CMS API](./API_DOCUMENTATION.md#8-strapi-cms-api) - Conteudo dinamico
  - [Webhooks](./API_DOCUMENTATION.md#9-webhooks) - Stripe, Coinbase, Chainlink
  - [Error Handling](./API_DOCUMENTATION.md#10-error-handling) - Codigos e mensagens

### Desenvolvimento

- [Convencoes de Codigo](./DEVELOPER_GUIDE.md#convencoes-de-codigo) - TypeScript, ESLint, Naming
- [Git Workflow](./DEVELOPER_GUIDE.md#git-workflow) - Branches, Commits, PRs
- [Testing](./DEVELOPER_GUIDE.md#testing) - Jest, Vitest, Playwright, Hardhat

### Database

- [Tabelas Medusa Core](./DATABASE_SCHEMA.md#tabelas-medusa-core) - ~100 tabelas
- [Raffle Module](./DATABASE_SCHEMA.md#raffle-module) - raffle, raffle_ticket, raffle_draw
- [Brazil Module](./DATABASE_SCHEMA.md#brazil-module) - pix_payment, nfe, shipping_quote
- [Crypto Payment Module](./DATABASE_SCHEMA.md#crypto-payment-module) - crypto_payment
- [Migrations](./DATABASE_SCHEMA.md#migrations) - Como criar e executar
- [Backup & Restore](./DATABASE_SCHEMA.md#backup--restore) - Manual e automatizado

### Troubleshooting

- [Problemas Comuns](./DEVELOPER_GUIDE.md#troubleshooting) - 8 casos com solucoes
- [Queries Uteis](./DATABASE_SCHEMA.md#queries-uteis) - Diagnostic, performance

---

## Por Onde Comecar?

### Sou Novo no Projeto

1. Leia [Visao Geral](./DEVELOPER_GUIDE.md#visao-geral) (5 min)
2. Entenda a arquitetura: **[ARCHITECTURE.md](./ARCHITECTURE.md)** (20 min leitura rapida)
3. Siga [Setup do Ambiente](./DEVELOPER_GUIDE.md#setup-do-ambiente) (30 min)
4. Rode o projeto: [Como Rodar](./DEVELOPER_GUIDE.md#como-rodar) (10 min)
5. Explore as APIs: **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** (consulta conforme necessidade)

**Total**: ~1h para ambiente funcionando + entendimento basico

### Vou Trabalhar no Backend

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Leia secoes 4 e 5 (Padroes de Design e Estrutura de Modulos)
2. [Estrutura do Projeto](./DEVELOPER_GUIDE.md#estrutura-do-projeto) - Entenda `src/modules/`
3. [Arquitetura de Modulos](./DEVELOPER_GUIDE.md#arquitetura-de-modulos-medusa) - Models, Services, Workflows
4. [Database Schema](./DATABASE_SCHEMA.md) - Consulte schemas das tabelas
5. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Endpoints Admin API
6. [Convencoes de Codigo](./DEVELOPER_GUIDE.md#convencoes-de-codigo) - Siga os padroes

### Vou Trabalhar no Frontend

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Leia secao 3 (Frontend Stack) e secao 6 (Fluxo de Dados)
2. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Leia secoes 2, 5 e 7 (Auth, Store API, Raffle API)
3. [Estrutura do Projeto](./DEVELOPER_GUIDE.md#estrutura-do-projeto) - Entenda `storefront/`
4. [Como Rodar](./DEVELOPER_GUIDE.md#como-rodar) - Rode Next.js dev server
5. Consulte exemplos de requests/responses na **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**

### Vou Trabalhar com APIs (Integracao)

1. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - **LEIA COMPLETO** (35 min)
   - Secao 2: Autenticacao (JWT, API Keys)
   - Secao 5: Store API (endpoints publicos)
   - Secao 6: Admin API (endpoints protegidos)
   - Secao 7: Raffle API (rifas e tickets)
   - Secao 8: Strapi CMS API (conteudo)
   - Secao 10: Error Handling (tratamento de erros)
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Secao 7 (Integracoes Externas)
3. Teste os endpoints usando exemplos da documentacao

### Vou Trabalhar com Database

1. [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Leia completo (30 min)
2. [Configuracao](./DATABASE_SCHEMA.md#configuracao) - Connection strings, Docker
3. [Migrations](./DATABASE_SCHEMA.md#migrations) - Como criar e executar
4. [Backup & Restore](./DATABASE_SCHEMA.md#backup--restore) - Configure backups automaticos
5. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Secao 9 (Escalabilidade - Database Layer)

### Vou Fazer Deploy

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Leia secoes 8 e 9 (Seguranca e Escalabilidade)
2. [Como Rodar - Producao](./DEVELOPER_GUIDE.md#build-de-producao)
3. [Backup & Restore](./DATABASE_SCHEMA.md#backup--restore)
4. Aguarde **DEPLOYMENT_GUIDE.md** (em breve)

### Vou Auditar Seguranca

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Secao 8 (Security Architecture)
2. **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Secao 2 (Authentication) e Secao 9 (Webhooks)
3. Review de variaveis de ambiente: `.env.example`
4. Smart contract security (quando implementado)

---

## Modulos Customizados

### Raffle Module

Sistema de rifas com verificacao blockchain (Chainlink VRF).

**Documentacao**:

- **[ARCHITECTURE.md](./ARCHITECTURE.md#2-brazil-module)** - Visao geral do modulo
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md#7-custom-raffle-api)** - Endpoints da API
- [Database Schema](./DATABASE_SCHEMA.md#raffle-module) - Tabelas: raffle, raffle_ticket, raffle_draw
- [Arquitetura](./DEVELOPER_GUIDE.md#exemplo-modulo-raffle) - Models, Services, Workflows, Subscribers

**Aguarde**: `docs/modules/RAFFLE_MODULE.md` (documentacao completa)

### Brazil Module

Integracoes para mercado brasileiro (PIX, NFe, Frete).

**Documentacao**:

- **[ARCHITECTURE.md](./ARCHITECTURE.md#2-brazil-module)** - Visao geral do modulo
- [Database Schema](./DATABASE_SCHEMA.md#brazil-module) - Tabelas: pix_payment, nfe, shipping_quote
- PIX via Mercado Pago
- NFe via eNotas/Focus NFe
- Frete via Melhor Envio

**Aguarde**: `docs/modules/BRAZIL_MODULE.md` (documentacao completa)

### Crypto Payment Module

Pagamentos com criptomoedas via Coinbase Commerce.

**Documentacao**:

- **[ARCHITECTURE.md](./ARCHITECTURE.md#3-crypto-payment-module)** - Visao geral do modulo
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md#coinbase-commerce-webhook)** - Webhook integration
- [Database Schema](./DATABASE_SCHEMA.md#crypto-payment-module) - Tabela: crypto_payment
- Ver: `COINBASE_COMMERCE_SETUP.md` (raiz do projeto)

---

## Stack Tecnologico

### Backend

- **Framework**: Medusa v2.11.3
- **Runtime**: Node.js >= 20.x
- **Language**: TypeScript 5.6.2
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: Medusa Data Models
- **Testing**: Jest
- **API**: REST

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.6.3
- **Styling**: Tailwind CSS 3.4.18
- **State**: Zustand 5.0.1
- **HTTP Client**: Fetch API
- **Animations**: Framer Motion 11.11.11
- **Testing**: Vitest, Playwright

### CMS

- **Platform**: Strapi 4.26
- **Database**: PostgreSQL (shared, schema: strapi)
- **API**: REST + GraphQL (optional)

### Blockchain (Planejado)

- **Network**: Polygon (Matic)
- **Smart Contracts**: Solidity 0.8.x
- **VRF**: Chainlink VRF v2
- **Library**: Ethers.js v6.13.0
- **Framework**: Hardhat 2.22.0
- **Standards**: OpenZeppelin 5.0.0

### Infrastructure

- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions (planejado)
- **Monitoring**: Sentry (planejado)

### Integracoes

- **Pagamento**: Stripe, Coinbase Commerce, Mercado Pago
- **Frete**: Melhor Envio API (planejado)
- **Fiscal**: eNotas / Focus NFe (planejado)
- **Email**: SendGrid (planejado)

---

## Diagramas de Arquitetura

### Diagrama de Alto Nivel

Ver: **[ARCHITECTURE.md - Section 2](./ARCHITECTURE.md#2-architecture-diagram)**

```
Frontend (Next.js 14) → Medusa Backend (Port 9000) → PostgreSQL + Redis
                     ↘ Strapi CMS (Port 1337) ↗
```

### Fluxo de Compra

Ver: **[ARCHITECTURE.md - Section 6](./ARCHITECTURE.md#user-flow-product-purchase)**

```
1. Browse Products → 2. Add to Cart → 3. Checkout → 4. Payment → 5. Order Complete
```

### Fluxo de Rifa

Ver: **[ARCHITECTURE.md - Section 6](./ARCHITECTURE.md#user-flow-raffle-ticket-purchase)**

```
1. View Raffles → 2. Select Tickets → 3. Add to Cart → 4. Purchase → 5. Ticket Assignment → 6. Draw Execution
```

---

## Convencoes

### Branch Naming

- `main` / `master` - Producao
- `develop` - Integracao
- `feature/*` - Novas features
- `fix/*` - Bug fixes
- `chore/*` - Manutencao

### Commit Messages (Conventional Commits)

```
<type>(<scope>): <subject>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Exemplo**:

```bash
feat(raffle): add blockchain draw with Chainlink VRF
fix(brazil): correct PIX QR code generation
docs(technical): add architecture and API documentation
```

### Coding Standards

- **TypeScript**: Strict mode
- **Linting**: ESLint
- **Formatting**: Prettier
- **Test Coverage**: >= 80%
- **Code Review**: Obrigatorio antes de merge
- **Documentation**: Inline comments + external docs

---

## APIs - Quick Reference

### Store API (Publica)

**Base URL**: `http://localhost:9000/store`

**Auth**: Publishable API Key
```http
x-publishable-api-key: pk_c9f247ebb15729b47c19f524b7830283...
```

**Endpoints Principais**:
- `GET /products` - Listar produtos
- `GET /products/:id` - Detalhes do produto
- `POST /cart` - Criar carrinho
- `POST /cart/:id/line-items` - Adicionar ao carrinho
- `POST /checkout` - Finalizar compra
- `GET /raffles?status=active` - Rifas ativas

**Ver**: **[API_DOCUMENTATION.md - Section 5](./API_DOCUMENTATION.md#5-store-api-endpoints)**

### Admin API (Protegida)

**Base URL**: `http://localhost:9000/admin`

**Auth**: JWT Bearer Token
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Login**:
```http
POST /admin/auth
{
  "email": "admin@use-nerd.com.br",
  "password": "your-password"
}
```

**Endpoints Principais**:
- `GET /products` - Listar produtos (admin)
- `POST /products` - Criar produto
- `GET /orders` - Listar pedidos
- `POST /raffles` - Criar rifa
- `POST /raffles/:id/test-draw` - Executar sorteio (teste)

**Ver**: **[API_DOCUMENTATION.md - Section 6](./API_DOCUMENTATION.md#6-admin-api-endpoints)**

### Strapi CMS API

**Base URL**: `http://localhost:1337/api`

**Auth**: Publica (read-only)

**Endpoints Principais**:
- `GET /pages?populate=*` - Listar paginas
- `GET /pages?filters[slug][$eq]=sobre` - Pagina por slug
- `GET /banners?populate=*` - Banners
- `GET /hero-section?populate=*` - Hero section
- `GET /nerd-premiados?populate=*` - Vencedores

**Ver**: **[API_DOCUMENTATION.md - Section 8](./API_DOCUMENTATION.md#8-strapi-cms-api)**

---

## Recursos Externos

### Medusa v2

- [Documentacao Oficial](https://docs.medusajs.com/v2)
- [Architecture](https://docs.medusajs.com/v2/resources/architectural-modules)
- [Modules](https://docs.medusajs.com/v2/resources/architectural-modules/module)
- [Workflows](https://docs.medusajs.com/v2/resources/architectural-modules/workflow)

### Next.js 14

- [Documentacao Oficial](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### Blockchain

- [Polygon Docs](https://docs.polygon.technology/)
- [Chainlink VRF](https://docs.chain.link/vrf)
- [Ethers.js](https://docs.ethers.org/v6/)
- [Hardhat](https://hardhat.org/docs)

### Integracoes Brasil

- [Mercado Pago API](https://www.mercadopago.com.br/developers)
- [Melhor Envio API](https://docs.melhorenvio.com.br/)
- [eNotas API](https://enotas.com.br/desenvolvedores)
- [Focus NFe API](https://focusnfe.com.br/documentacao/)

---

## Changelog da Documentacao

### 2025-11-18 - v1.1

- **Adicionado**: **ARCHITECTURE.md** - Documentacao completa de arquitetura
- **Adicionado**: **API_DOCUMENTATION.md** - Referencia completa de APIs
- Atualizado README.md com links para novos documentos

### 2025-11-18 - v1.0

- Criacao inicial da documentacao tecnica
- Adicionado **DEVELOPER_GUIDE.md**
- Adicionado **DATABASE_SCHEMA.md**
- Adicionado **README.md** (indice)

---

## Contribuindo

Para melhorar esta documentacao:

1. Identifique o que precisa ser adicionado/corrigido
2. Abra uma issue: `docs: [tipo] descricao`
3. Ou crie um PR com as mudancas
4. Tag: `@documentation-specialist` para revisao

**Padroes**:

- Markdown formatado corretamente
- Exemplos de codigo com syntax highlighting
- Links internos funcionais
- Linguagem clara e objetiva
- Exemplos praticos
- Diagramas quando aplicavel

---

## Documentacao Futura (Roadmap)

- [x] **ARCHITECTURE.md** - Arquitetura completa do sistema ✅
- [x] **API_DOCUMENTATION.md** - Referencia de APIs ✅
- [ ] **TESTING_GUIDE.md** - Estrategia e setup de testes
- [ ] **DEPLOYMENT_GUIDE.md** - Deploy em producao
- [ ] **FRONTEND_GUIDE.md** - Next.js, Tailwind, componentes
- [ ] **SECURITY_GUIDE.md** - Best practices de seguranca
- [ ] **PERFORMANCE_GUIDE.md** - Otimizacao e profiling
- [ ] **modules/RAFFLE_MODULE.md** - Documentacao completa do modulo
- [ ] **modules/BRAZIL_MODULE.md** - Integracoes brasileiras
- [ ] **modules/CRYPTO_PAYMENT_MODULE.md** - Pagamentos crypto

---

**Mantenedores**: USE Nerd Dev Team
**Contato**: admin@example.com
