# Guia do Desenvolvedor - USE Nerd

> Documentacao tecnica completa para configuracao e desenvolvimento do projeto USE Nerd

**Versao**: 1.0
**Atualizado**: 2025-11-18
**Stack**: Medusa v2.11.3 + Next.js 14 + PostgreSQL 15 + Redis 7

---

## Indice

1. [Visao Geral](#visao-geral)
2. [Pre-requisitos](#pre-requisitos)
3. [Setup do Ambiente](#setup-do-ambiente)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Como Rodar](#como-rodar)
6. [Arquitetura de Modulos Medusa](#arquitetura-de-modulos-medusa)
7. [Convencoes de Codigo](#convencoes-de-codigo)
8. [Git Workflow](#git-workflow)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Visao Geral

**USE Nerd** e uma plataforma de e-commerce moderna para o mercado brasileiro, com sistema de rifas verificadas via blockchain (Polygon). Combina:

- **Backend**: Medusa v2.11.3 (Node.js + TypeScript)
- **Frontend**: Next.js 14 (App Router, SSR/SSG)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Blockchain**: Polygon (Matic) - Chainlink VRF para sorteios
- **Pagamentos**: PIX (Mercado Pago), Crypto (Coinbase Commerce)
- **Fiscal**: NFe (Nota Fiscal Eletronica)
- **Frete**: Melhor Envio API

---

## Pre-requisitos

### Obrigatorios

- **Node.js**: >= 20.x (LTS recomendado)
- **npm**: >= 10.x
- **Docker**: >= 24.x + Docker Compose
- **Git**: >= 2.40

### Opcionais (Desenvolvimento)

- **VS Code** com extensoes:
  - ESLint
  - Prettier
  - TypeScript
  - Docker
  - Tailwind CSS IntelliSense

---

## Setup do Ambiente

### 1. Clone o Repositorio

```bash
git clone https://github.com/seu-usuario/use-nerd.git
cd use-nerd
```

### 2. Instalacao de Dependencias

#### Backend (Medusa)

```bash
npm install
```

#### Frontend (Next.js)

```bash
cd storefront
npm install
cd ..
```

#### Strapi CMS (Opcional - Conteudo Editorial)

```bash
cd strapi-cms
npm install
cd ..
```

### 3. Configuracao de Variaveis de Ambiente

Copie o arquivo de exemplo e configure:

```bash
cp .env.example .env
```

**Variaveis minimas obrigatorias** (desenvolvimento local):

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/use-nerd?sslmode=disable

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=change-me-in-production
COOKIE_SECRET=change-me-in-production

# CORS
STORE_CORS=http://localhost:3000,http://localhost:8000
ADMIN_CORS=http://localhost:9000,http://localhost:5173
AUTH_CORS=http://localhost:9000,http://localhost:5173,http://localhost:8000

# Admin User
ADMIN_EMAIL=admin@use-nerd.com.br
ADMIN_PASSWORD=supersecret
```

Para **producao**, configure tambem:

- `POLYGON_RPC_URL`: Polygon mainnet RPC
- `PRIVATE_KEY`: Wallet private key (NUNCA commite!)
- `MERCADO_PAGO_ACCESS_TOKEN`: Token de producao Mercado Pago
- `COINBASE_COMMERCE_API_KEY`: Chave da Coinbase Commerce
- `NFE_API_TOKEN`: Token do provider de NFe (eNotas, Focus NFe)
- `MELHOR_ENVIO_TOKEN`: Token da Melhor Envio

### 4. Subir Infraestrutura com Docker

```bash
docker-compose up -d
```

Isso iniciara:

- **PostgreSQL** (porta 5432)
- **Redis** (porta 6379)
- **Medusa Backend** (portas 9000 + 5173)
- **Strapi CMS** (porta 1337)

**Verificar status**:

```bash
docker ps
```

Esperado:

```
NAMES               STATUS
use-nerd-postgres   Up (healthy)
use-nerd-redis      Up (healthy)
use-nerd-backend    Up (healthy)
use-nerd-strapi     Up
```

### 5. Executar Migrations

```bash
npm run db:migrate
```

Ou dentro do container:

```bash
docker exec use-nerd-backend npm run db:migrate
```

### 6. (Opcional) Seed de Dados

```bash
npm run seed
```

Isso criara:

- Usuario admin
- Produtos de exemplo
- Categorias
- Regiao Brasil

---

## Estrutura do Projeto

```
use-nerd/
├── src/                          # Backend Medusa v2
│   ├── modules/                  # Modulos customizados
│   │   ├── raffle/               # Sistema de rifas
│   │   │   ├── models/           # Entidades (raffle, raffle_ticket, raffle_draw)
│   │   │   ├── services/         # Logica de negocio
│   │   │   ├── workflows/        # Fluxos complexos (purchase, draw, publish)
│   │   │   ├── subscribers/      # Event handlers (order.placed, payment.captured)
│   │   │   ├── api/              # Rotas HTTP
│   │   │   │   ├── admin/        # Admin routes (/admin/raffles)
│   │   │   │   └── store/        # Store routes (/store/raffles)
│   │   │   ├── __tests__/        # Testes unitarios/integracao
│   │   │   └── index.ts          # Exportacao do modulo
│   │   ├── brazil/               # Integracao Brasil (PIX, NFe, Frete)
│   │   │   ├── models/           # pix_payment, nfe, shipping_quote
│   │   │   ├── services/         # PixPaymentService, NFeService, MelhorEnvioService
│   │   │   ├── workflows/        # create-pix-payment, generate-nfe, calculate-shipping
│   │   │   └── api/
│   │   └── crypto-payment/       # Pagamento crypto (Coinbase Commerce)
│   │       ├── models/           # crypto_payment
│   │       ├── services/         # CryptoPaymentService
│   │       └── api/
│   ├── admin/                    # Admin UI customizacoes
│   ├── api/                      # Rotas globais (nao especificas de modulos)
│   ├── scripts/                  # Scripts de setup/seed
│   └── loaders/                  # Inicializacao customizada
│
├── storefront/                   # Frontend Next.js 14
│   ├── app/                      # App Router (Next.js 14)
│   │   ├── (routes)/             # Paginas publicas
│   │   ├── raffle/[id]/          # Detalhes de rifa
│   │   ├── checkout/             # Checkout flow
│   │   └── layout.tsx            # Root layout
│   ├── components/               # React components
│   ├── lib/                      # Utilities
│   │   ├── medusa-client.ts      # Medusa JS SDK client
│   │   ├── strapi-client.ts      # Strapi API client
│   │   └── web3-client.ts        # Ethers.js blockchain client
│   └── styles/                   # CSS global + Tailwind config
│
├── strapi-cms/                   # CMS para conteudo editorial
│   ├── src/
│   │   └── api/                  # Content Types (Blog, Banners, Winners)
│   └── config/
│
├── contracts/                    # Smart Contracts Solidity (futuro)
│   ├── contracts/                # .sol files
│   ├── scripts/                  # Deploy scripts (Hardhat)
│   └── test/                     # Contract tests
│
├── docs/                         # Documentacao
│   ├── technical/                # Docs tecnicas
│   ├── modules/                  # Docs de modulos
│   └── api/                      # API references
│
├── docker-compose.yml            # Orquestracao Docker
├── medusa-config.ts              # Configuracao Medusa
├── package.json                  # Backend dependencies
├── tsconfig.json                 # TypeScript config
└── .env.example                  # Template de variaveis
```

---

## Como Rodar

### Desenvolvimento Local (Recomendado: Docker)

#### Iniciar todos os servicos

```bash
docker-compose up -d
```

#### Logs em tempo real

```bash
docker-compose logs -f medusa-backend
```

#### Acessar servicos

- **Medusa API**: http://localhost:9000
- **Medusa Admin**: http://localhost:9000/app
- **Storefront**: http://localhost:3000 (rodar separado - veja abaixo)
- **Strapi CMS**: http://localhost:1337/admin

#### Parar servicos

```bash
docker-compose down
```

---

### Desenvolvimento Local (Sem Docker)

#### 1. PostgreSQL e Redis

Instale localmente ou use Docker apenas para infra:

```bash
docker-compose up -d postgres redis
```

#### 2. Backend Medusa

```bash
npm run dev
```

Acesse: http://localhost:9000

#### 3. Frontend Next.js

```bash
cd storefront
npm run dev
```

Acesse: http://localhost:3000

#### 4. Strapi CMS (Opcional)

```bash
cd strapi-cms
npm run develop
```

Acesse: http://localhost:1337/admin

---

### Build de Producao

#### Backend

```bash
npm run build
npm run start
```

#### Frontend

```bash
cd storefront
npm run build
npm run start
```

---

## Arquitetura de Modulos Medusa

Medusa v2 usa **arquitetura modular**. Cada modulo segue a estrutura:

```
src/modules/<module-name>/
├── models/           # Data models (usando model.define)
├── services/         # Business logic (injecao de dependencias)
├── workflows/        # Complex operations (multi-step transactions)
├── subscribers/      # Event handlers (pub/sub)
├── api/              # HTTP routes
│   ├── admin/        # Admin-only endpoints
│   └── store/        # Public store endpoints
├── __tests__/        # Unit + integration tests
└── index.ts          # Module export
```

### Exemplo: Modulo Raffle

#### 1. Model (`models/raffle.ts`)

Define a entidade no banco de dados:

```typescript
import { model } from "@medusajs/framework/utils";

const Raffle = model.define("raffle", {
  id: model.id().primaryKey(),
  title: model.text(),
  total_tickets: model.number(),
  ticket_price: model.number(),
  status: model.enum(RaffleStatus).default(RaffleStatus.DRAFT),
  // ...
});

export default Raffle;
```

#### 2. Service (`services/raffle.ts`)

Logica de negocio:

```typescript
import { MedusaService } from "@medusajs/framework/utils";

class RaffleService extends MedusaService({
  Raffle,
  RaffleTicket,
}) {
  async createRaffle(data: CreateRaffleInput): Promise<Raffle> {
    return await this.create(data);
  }

  async publishRaffle(raffleId: string): Promise<Raffle> {
    // Validacoes + update status
  }
}

export default RaffleService;
```

#### 3. Workflow (`workflows/purchase-raffle-tickets.ts`)

Operacao multi-step (transacional):

```typescript
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows";

export const purchaseRaffleTicketsWorkflow = createWorkflow(
  "purchase-raffle-tickets",
  function (input: PurchaseTicketsInput) {
    const tickets = reserveTicketsStep(input);
    const order = createOrderStep({ tickets });
    const payment = createPaymentStep({ order });

    return new WorkflowResponse({ tickets, order, payment });
  }
);
```

#### 4. Subscriber (`subscribers/handle-payment-captured.ts`)

Event handler:

```typescript
import { SubscriberArgs } from "@medusajs/framework";

export default async function handlePaymentCaptured({ event, container }: SubscriberArgs) {
  const raffleTicketService = container.resolve("raffleTicketService");
  const { order_id } = event.data;

  // Marcar tickets como pagos
  await raffleTicketService.confirmTickets(order_id);
}

export const config = {
  event: "payment.captured",
};
```

#### 5. API Route (`api/store/raffles/route.ts`)

Endpoint HTTP:

```typescript
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const raffleService = req.scope.resolve("raffleService");
  const raffles = await raffleService.listActiveRaffles();

  res.json({ raffles });
}
```

---

### Convencoes de Nomenclatura

- **Models**: PascalCase singular (`Raffle`, `RaffleTicket`)
- **Services**: PascalCase + "Service" (`RaffleService`)
- **Workflows**: camelCase + "Workflow" (`purchaseRaffleTicketsWorkflow`)
- **Subscribers**: camelCase descritivo (`handlePaymentCaptured`)
- **API Routes**: Seguir REST (`GET /store/raffles`, `POST /admin/raffles`)

---

## Convencoes de Codigo

### TypeScript

- **Strict mode**: Habilitado (`tsconfig.json`)
- **Tipos explicitos**: Sempre que possivel
- **Evitar `any`**: Usar `unknown` ou tipos especificos

### ESLint + Prettier

Configuracao em `.eslintrc.js` e `.prettierrc`:

```bash
# Verificar lint
npm run lint

# Formatar codigo
npm run format
```

### Naming Conventions

- **Variaveis**: camelCase (`raffleTicket`, `customerEmail`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_TICKETS_PER_CUSTOMER`)
- **Funcoes**: camelCase descritivo (`calculateTicketPrice`, `validateCPF`)
- **Classes**: PascalCase (`RaffleService`, `PixPaymentService`)
- **Interfaces/Types**: PascalCase (`CreateRaffleInput`, `RaffleStatus`)

### File Organization

- **Ordenacao de imports**:
  1. Node.js modules (`fs`, `path`)
  2. External dependencies (`@medusajs/...`, `ethers`)
  3. Internal modules (`@/modules/...`)
  4. Relative imports (`../services/...`)

- **Exportacoes**: Sempre via `index.ts`

```typescript
// src/modules/raffle/services/index.ts
export { default as RaffleService } from "./raffle";
export { default as RaffleTicketService } from "./raffle-ticket";
```

---

## Git Workflow

### Branch Strategy

```
main/master          # Producao (protegida)
  └── develop        # Integracao (padrao)
      ├── feature/*  # Novas features (feature/raffle-nft-mint)
      ├── fix/*      # Bug fixes (fix/ticket-duplicate)
      └── chore/*    # Manutencao (chore/update-deps)
```

### Commit Messages (Conventional Commits)

Formato:

```
<type>(<scope>): <subject>

[body opcional]

[footer opcional]
```

**Types**:

- `feat`: Nova feature
- `fix`: Bug fix
- `docs`: Documentacao
- `style`: Formatacao (sem mudanca de logica)
- `refactor`: Refatoracao (sem mudanca de comportamento)
- `test`: Adicionar/modificar testes
- `chore`: Manutencao (build, deps, config)

**Exemplos**:

```bash
git commit -m "feat(raffle): add blockchain draw with Chainlink VRF"
git commit -m "fix(brazil): correct PIX QR code generation"
git commit -m "docs(technical): add developer guide and database schema"
git commit -m "test(raffle): add unit tests for ticket purchase workflow"
```

### Pull Requests

1. Crie branch a partir de `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
```

2. Faca commits atomicos

3. Push e abra PR:

```bash
git push origin feature/my-feature
```

4. **Obrigatorio**: Aprovacao do `code-reviewer` antes de merge

---

## Testing

### Backend (Jest)

#### Testes Unitarios

```bash
npm run test:unit
```

#### Testes de Integracao

```bash
npm run test:integration:modules
npm run test:integration:http
```

#### Exemplo: Teste de Service

```typescript
// src/modules/raffle/__tests__/services/raffle.service.unit.spec.ts
import { RaffleService } from "../../services";

describe("RaffleService", () => {
  it("should create raffle", async () => {
    const service = new RaffleService(/* ... */);
    const raffle = await service.createRaffle({
      title: "Test Raffle",
      total_tickets: 100,
      ticket_price: 1000,
    });

    expect(raffle).toBeDefined();
    expect(raffle.title).toBe("Test Raffle");
  });
});
```

### Frontend (Vitest + Playwright)

#### Unit Tests (Vitest)

```bash
cd storefront
npm run test
```

#### E2E Tests (Playwright - futuro)

```bash
cd storefront
npx playwright test
```

### Smart Contracts (Hardhat)

```bash
npm run hardhat:test
```

---

## Troubleshooting

### Problema: Porta ja em uso

**Erro**:

```
Error: listen EADDRINUSE: address already in use :::9000
```

**Solucao**:

```bash
# Windows
netstat -ano | findstr :9000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:9000 | xargs kill -9
```

---

### Problema: Docker container nao inicia

**Erro**:

```
use-nerd-backend exited with code 1
```

**Solucao**:

```bash
# Ver logs
docker logs use-nerd-backend

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

### Problema: Database connection refused

**Erro**:

```
Error connecting to PostgreSQL: ECONNREFUSED
```

**Solucao**:

1. Verifique se PostgreSQL esta rodando:

```bash
docker ps | grep postgres
```

2. Teste conexao manual:

```bash
docker exec -it use-nerd-postgres psql -U postgres -d use-nerd
```

3. Verifique `.env`:

```env
# Docker: use "postgres"
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/use-nerd?sslmode=disable

# Local: use "localhost"
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/use-nerd?sslmode=disable
```

---

### Problema: Migrations nao aplicadas

**Erro**:

```
relation "raffle" does not exist
```

**Solucao**:

```bash
# Dentro do container
docker exec use-nerd-backend npx medusa db:migrate

# Local
npx medusa db:migrate
```

---

### Problema: Build errors (TypeScript)

**Erro**:

```
TS2307: Cannot find module '@medusajs/framework/utils'
```

**Solucao**:

1. Reinstale dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

2. Verifique Node.js version:

```bash
node -v  # Deve ser >= 20.x
```

---

### Problema: Storefront nao conecta no backend

**Erro** (Browser console):

```
Failed to fetch raffles: Network error
```

**Solucao**:

1. Verifique CORS em `.env`:

```env
STORE_CORS=http://localhost:3000,http://localhost:8000
```

2. Reinicie backend:

```bash
docker-compose restart medusa-backend
```

---

### Problema: Chainlink VRF callback nao funciona

**Erro**:

```
VRF request timeout
```

**Solucao**:

1. Verifique `CHAINLINK_VRF_SUBSCRIPTION_ID` no `.env`
2. Confirme saldo de LINK na subscription (Chainlink Dashboard)
3. Testnet Mumbai pode estar lenta - aguarde 5-10 minutos

---

## Recursos Adicionais

- [Documentacao Medusa v2](https://docs.medusajs.com/v2)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Polygon Developer Docs](https://docs.polygon.technology/)
- [Chainlink VRF Docs](https://docs.chain.link/vrf)
- [Mercado Pago API](https://www.mercadopago.com.br/developers)

---

**Mantenedores**: USE Nerd Dev Team
**Contato**: dev@use-nerd.com.br
