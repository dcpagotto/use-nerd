# USE Nerd - Architecture Documentation

**Version:** 1.0
**Last Updated:** 2025-11-18
**Status:** Active Development

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Design Patterns](#design-patterns)
5. [Module Structure](#module-structure)
6. [Data Flow](#data-flow)
7. [External Integrations](#external-integrations)
8. [Security Architecture](#security-architecture)
9. [Scalability Considerations](#scalability-considerations)

---

## 1. System Overview

USE Nerd is a modern e-commerce platform built for the Brazilian market, featuring an innovative blockchain-based raffle system. The platform combines Medusa v2.0 commerce capabilities with Next.js 14 for a cutting-edge storefront, Strapi CMS for content management, and Polygon blockchain integration for transparent raffle mechanics.

### Key Features

- **E-commerce Core**: Full-featured online store powered by Medusa v2.0
- **Blockchain Raffles**: Transparent, verifiable raffles using smart contracts on Polygon
- **Brazilian Market**: Native support for PIX payments, Mercado Pago, NFe fiscal compliance
- **Content Management**: Strapi CMS for dynamic pages, banners, and blog posts
- **Modern UI**: Next.js 14 with App Router and cyberpunk-themed Tailwind CSS
- **Crypto Payments**: Coinbase Commerce integration for cryptocurrency transactions

---

## 2. Architecture Diagram

### High-Level System Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Next.js 14 Storefront (Port 3000)                          │ │
│  │  ┌─────────────┬──────────────┬─────────────────────────┐   │ │
│  │  │ App Router  │ Components   │ Client Libraries        │   │ │
│  │  │             │              │                         │   │ │
│  │  │ /produtos   │ - Header     │ - medusa-api.ts        │   │ │
│  │  │ /rifas      │ - Footer     │ - strapi-client.ts     │   │ │
│  │  │ /checkout   │ - Cards      │ - web3-client.ts       │   │ │
│  │  │ /nerd-      │ - Banners    │ - medusa-enhanced.ts   │   │ │
│  │  │  premiado   │ - Hero       │                         │   │ │
│  │  │ /blog       │ - Raffle     │                         │   │ │
│  │  │ /sobre      │   Components │                         │   │ │
│  │  └─────────────┴──────────────┴─────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬───────────────────────────────────────┘
                            │ HTTP/REST + Fetch API
                            ▼
┌───────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                              │
│                                                                   │
│  ┌──────────────────────────────┬───────────────────────────────┐ │
│  │ Medusa Backend (Port 9000)   │ Strapi CMS (Port 1337)       │ │
│  │                              │                               │ │
│  │ ┌──────────────────────────┐ │ ┌───────────────────────────┐ │ │
│  │ │ Core Modules:            │ │ │ Content Types:            │ │ │
│  │ │ - Product                │ │ │ - Pages                   │ │ │
│  │ │ - Cart                   │ │ │ - Banners                 │ │ │
│  │ │ - Order                  │ │ │ - Hero Section            │ │ │
│  │ │ - Customer               │ │ │ - Nerd Premiado (Winners) │ │ │
│  │ │ - Payment                │ │ │ - Site Settings           │ │ │
│  │ │ - Shipping               │ │ │ - Theme Settings          │ │ │
│  │ │                          │ │ │                           │ │ │
│  │ │ Custom Modules:          │ │ └───────────────────────────┘ │ │
│  │ │ ├─ raffle/               │ │                               │ │
│  │ │ │  ├─ models/            │ │ REST API + GraphQL (Optional) │ │
│  │ │ │  │  ├─ raffle.ts       │ │                               │ │
│  │ │ │  │  ├─ ticket.ts       │ │ Public API:                   │ │
│  │ │ │  │  └─ draw.ts         │ │ - GET /api/pages              │ │
│  │ │ │  ├─ services/          │ │ - GET /api/banners            │ │
│  │ │ │  ├─ workflows/         │ │ - GET /api/hero-sections      │ │
│  │ │ │  ├─ subscribers/       │ │ - GET /api/nerd-premiados     │ │
│  │ │ │  └─ api/               │ │                               │ │
│  │ │ ├─ brazil/               │ │                               │ │
│  │ │ │  ├─ models/            │ │                               │ │
│  │ │ │  │  ├─ nfe.ts          │ │                               │ │
│  │ │ │  │  ├─ pix-payment.ts  │ │                               │ │
│  │ │ │  │  └─ shipping.ts     │ │                               │ │
│  │ │ │  └─ services/          │ │                               │ │
│  │ │ └─ crypto-payment/       │ │                               │ │
│  │ │    └─ services/          │ │                               │ │
│  │ └──────────────────────────┘ │                               │ │
│  │                              │                               │ │
│  │ Admin UI (Port 5173 - Dev)   │                               │ │
│  │ - Vite-powered dashboard     │                               │ │
│  └──────────────────────────────┴───────────────────────────────┘ │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                ┌───────────┴──────────┬──────────────┐
                ▼                      ▼              ▼
┌─────────────────────────┐  ┌──────────────┐  ┌─────────────────┐
│ PostgreSQL Database     │  │ Redis Cache  │  │ Blockchain Layer│
│ (Port 5432)             │  │ (Port 6379)  │  │                 │
│                         │  │              │  │ Polygon Network │
│ Schemas:                │  │ Cache:       │  │ (Planned)       │
│ - public (Medusa)       │  │ - Sessions   │  │                 │
│ - strapi (Strapi CMS)   │  │ - Jobs Queue │  │ Smart Contracts:│
│                         │  │ - Rate Limit │  │ - RaffleNFT.sol │
│ Tables:                 │  │              │  │ - VRF Oracle    │
│ - product (50+ tables)  │  │              │  │ (Chainlink)     │
│ - raffle                │  │              │  │                 │
│ - raffle_ticket         │  │              │  │                 │
│ - raffle_draw           │  │              │  │                 │
│ - nfe                   │  │              │  │                 │
│ - pix_payment           │  │              │  │                 │
│ - shipping_quote        │  │              │  │                 │
└─────────────────────────┘  └──────────────┘  └─────────────────┘
```

### Service Communication Flow

```
┌──────────┐         ┌──────────┐         ┌──────────────┐
│ Frontend │  HTTP   │  Medusa  │  SQL    │  PostgreSQL  │
│ Next.js  ├────────►│ Backend  ├────────►│   Database   │
│          │         │          │         │              │
└──────────┘         └────┬─────┘         └──────────────┘
     │                    │
     │ HTTP               │ HTTP
     ▼                    ▼
┌──────────┐         ┌──────────────┐
│  Strapi  │         │ External APIs│
│   CMS    │         │ - Stripe     │
│          │         │ - Coinbase   │
└──────────┘         │ - Mercado    │
                     │   Pago       │
                     └──────────────┘
```

---

## 3. Technology Stack

### Backend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Medusa | v2.11.3 | E-commerce engine |
| **Runtime** | Node.js | 20+ | JavaScript runtime |
| **Language** | TypeScript | 5.6.2 | Type-safe development |
| **Database** | PostgreSQL | 15 | Relational database |
| **Cache** | Redis | 7 | Caching & job queue |
| **ORM** | Medusa Data Models | v2.11.3 | Data modeling |
| **API Style** | REST | - | HTTP endpoints |

### Frontend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Next.js | 14.2.18 | React framework |
| **Language** | TypeScript | 5.6.3 | Type-safe development |
| **Styling** | Tailwind CSS | 3.4.18 | Utility-first CSS |
| **State** | Zustand | 5.0.1 | Client state management |
| **HTTP Client** | Fetch API | Native | API requests |
| **Animations** | Framer Motion | 11.11.11 | UI animations |
| **Markdown** | react-markdown | 10.1.0 | Rich text rendering |
| **Notifications** | react-hot-toast | 2.4.1 | Toast notifications |

### CMS

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Platform** | Strapi | 4.26+ | Headless CMS |
| **Database** | PostgreSQL | 15 | Shared with Medusa |
| **Schema** | strapi | - | Separate DB schema |

### Blockchain (Planned - Phase 2+)

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Network** | Polygon | Mainnet | Layer 2 blockchain |
| **Language** | Solidity | 0.8.x | Smart contracts |
| **Framework** | Hardhat | 2.22.0 | Contract development |
| **Library** | Ethers.js | 6.13.0 | Web3 interactions |
| **VRF** | Chainlink | v2 | Verifiable randomness |
| **Contracts** | OpenZeppelin | 5.0.0 | Security standards |

### Infrastructure

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Containerization** | Docker | Latest | Service isolation |
| **Orchestration** | Docker Compose | 3.8 | Multi-container apps |
| **CI/CD** | GitHub Actions | - | Automation (planned) |

### Testing

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Unit Tests** | Jest | 29.7.0 | Backend testing |
| **Frontend Tests** | Vitest | 2.1.4 | Frontend testing |
| **E2E Tests** | Playwright | - | User flows (planned) |
| **Contract Tests** | Hardhat | 2.22.0 | Smart contract testing |

---

## 4. Design Patterns

### Module Pattern (Medusa Modules)

All custom business logic is organized as **Medusa Modules** following a consistent structure:

```
src/modules/{module-name}/
├── models/           # Data models (database entities)
│   ├── {entity}.ts
│   └── index.ts
├── services/         # Business logic services
│   ├── {service}.ts
│   └── index.ts
├── repositories/     # Data access (optional, auto-generated)
├── workflows/        # Complex multi-step operations
│   ├── {workflow}.ts
│   └── index.ts
├── subscribers/      # Event handlers
│   ├── {subscriber}.ts
│   └── index.ts
├── api/              # HTTP endpoints (optional)
│   └── route.ts
├── types/            # TypeScript types and interfaces
│   └── index.ts
└── index.ts          # Module exports
```

**Benefits:**
- Clear separation of concerns
- Reusable business logic
- Type-safe contracts
- Event-driven architecture
- Easy testing and mocking

### Service Layer Pattern

Business logic is encapsulated in **Services** that extend `MedusaService`:

```typescript
// Example: RaffleService
class RaffleService extends MedusaService({ Raffle }) {
  async createRaffle(data: CreateRaffleDTO): Promise<Raffle> {
    // 1. Validate input
    this.validateRaffleData(data);

    // 2. Execute business logic
    const raffle = await this.create(data);

    // 3. Emit events
    await this.eventBusModuleService_?.emit("raffle.created", {
      raffle_id: raffle.id,
    });

    return raffle;
  }
}
```

**Benefits:**
- Single responsibility
- Testable units
- Dependency injection
- Event emission
- Transaction management

### Repository Pattern

Data access is abstracted through **Repositories** (auto-generated by Medusa):

```typescript
// Auto-generated by Medusa from models
const raffles = await raffleRepository.find({
  where: { status: RaffleStatus.ACTIVE },
  relations: ["tickets", "draws"],
});
```

**Benefits:**
- Database abstraction
- Query optimization
- Type-safe queries
- Automatic migrations

### Workflow Pattern

Complex, multi-step operations are managed using **Workflows**:

```typescript
// Example: Purchase Raffle Tickets Workflow
export const purchaseRaffleTicketsWorkflow = createWorkflow(
  "purchase-raffle-tickets",
  (input: PurchaseRaffleTicketsWorkflowInput) => {
    // Step 1: Reserve tickets
    const tickets = step("reserve-tickets", async () => {...});

    // Step 2: Process payment
    const payment = step("process-payment", async () => {...});

    // Step 3: Confirm tickets
    const confirmed = step("confirm-tickets", async () => {...});

    // Step 4: Emit events
    step("emit-events", async () => {...});

    return { tickets: confirmed };
  }
);
```

**Benefits:**
- Transaction safety (rollback on failure)
- Step-by-step execution
- Error handling
- Retry logic
- Observability

### Event-Driven Architecture

Modules communicate via **Events** using the Event Bus:

```typescript
// Emit event
await eventBusService.emit("order.placed", { order_id });

// Subscribe to event
class OrderSubscriber {
  async handleOrderPlaced(data: { order_id: string }) {
    // Generate NFe
    await nfeService.generateNFe(data.order_id);
  }
}
```

**Benefits:**
- Loose coupling
- Async processing
- Scalability
- Extensibility

### Server-Side Rendering (Next.js)

Frontend uses **React Server Components** by default:

```typescript
// Server Component (default)
export default async function ProductsPage() {
  const products = await medusaClient.products.list();
  return <ProductGrid products={products} />;
}

// Client Component (when needed)
'use client';
export default function AddToCartButton() {
  const [loading, setLoading] = useState(false);
  // Client-side interactivity
}
```

**Benefits:**
- Fast initial load
- SEO-friendly
- Reduced JavaScript bundle
- Direct database access (server)

---

## 5. Module Structure

### Core Medusa Modules (Built-in)

| Module | Purpose | Key Entities |
|--------|---------|--------------|
| **Product** | Product catalog | Product, Variant, Image, Option |
| **Cart** | Shopping cart | Cart, LineItem, Address |
| **Order** | Order management | Order, Fulfillment, Return |
| **Customer** | Customer accounts | Customer, Address, Group |
| **Payment** | Payment processing | Payment, Refund, PaymentSession |
| **Shipping** | Shipping methods | ShippingOption, ShippingProfile |
| **Region** | Regional settings | Region, Currency, TaxRate |
| **Pricing** | Dynamic pricing | PriceList, MoneyAmount |

### Custom Modules (USE Nerd)

#### 1. Raffle Module (`src/modules/raffle/`)

**Purpose:** Manage blockchain-verified raffles with ticket sales and random draws.

**Models:**
- `Raffle`: Raffle configuration and status
- `RaffleTicket`: Individual tickets sold
- `RaffleDraw`: Draw execution records

**Services:**
- `RaffleService`: Core raffle operations
- `RaffleTicketService`: Ticket management
- `RaffleDrawService`: Draw execution

**Workflows:**
- `createRaffleWorkflow`: Create and validate raffle
- `publishRaffleWorkflow`: Deploy to blockchain
- `purchaseRaffleTicketsWorkflow`: Buy tickets
- `executeRaffleDrawWorkflow`: Execute VRF draw

**API Endpoints:**
- `GET /store/raffles`: List active raffles
- `GET /store/raffles/:id`: Get raffle details
- `POST /admin/raffles`: Create raffle
- `POST /admin/raffles/:id/test-draw`: Test draw (dev)

**Key Features:**
- Product type specifications (Car, Computer, Electronics, etc.)
- Supplier information tracking
- Delivery type management
- Winner announcement
- Blockchain integration (planned)

#### 2. Brazil Module (`src/modules/brazil/`)

**Purpose:** Brazilian market integrations (payments, shipping, fiscal).

**Models:**
- `NFe`: Nota Fiscal Eletrônica (electronic invoice)
- `PixPayment`: PIX instant payment records
- `ShippingQuote`: Shipping rate quotes

**Services:**
- `NFeService`: NFe generation and management
- `PixPaymentService`: PIX payment processing
- `ShippingService`: Shipping quote integration

**External Integrations:**
- **Mercado Pago**: Payment gateway
- **Melhor Envio**: Shipping quotes (planned)
- **eNotas/Focus NFe**: NFe generation (planned)

**Key Features:**
- CPF/CNPJ validation
- Brazilian address formatting
- PIX QR code generation
- NFe XML/PDF generation
- Shipping calculator

#### 3. Crypto Payment Module (`src/modules/crypto-payment/`)

**Purpose:** Cryptocurrency payment integration via Coinbase Commerce.

**Services:**
- `CoinbaseCommerceService`: Charge creation and webhook handling

**External Integrations:**
- **Coinbase Commerce**: Crypto payment gateway

**Key Features:**
- Multi-currency support (BTC, ETH, USDC, etc.)
- Webhook verification
- Payment status tracking
- Auto-conversion to fiat

---

## 6. Data Flow

### User Flow: Product Purchase

```
1. Customer browses products (Frontend)
   │
   ├─→ GET /store/products (Medusa API)
   │   └─→ ProductService.listProducts()
   │       └─→ PostgreSQL: SELECT * FROM product WHERE status='published'
   │
2. Customer adds to cart
   │
   ├─→ POST /store/cart/:id/line-items (Medusa API)
   │   └─→ CartService.addLineItem()
   │       ├─→ Validate product availability
   │       ├─→ Calculate pricing
   │       └─→ PostgreSQL: INSERT INTO cart_line_item
   │
3. Customer proceeds to checkout
   │
   ├─→ POST /store/checkout (Medusa API)
   │   └─→ OrderService.createOrder()
   │       ├─→ Create order
   │       ├─→ Reserve inventory
   │       ├─→ Calculate totals
   │       └─→ PostgreSQL: INSERT INTO order, order_item
   │
4. Payment processing
   │
   ├─→ POST /store/payment-sessions (Medusa API)
   │   └─→ PaymentService.createPaymentSession()
   │       ├─→ Stripe: Create payment intent
   │       └─→ Return client_secret
   │
5. Payment confirmation (Webhook)
   │
   ├─→ POST /webhooks/stripe (Medusa Webhook)
   │   └─→ OrderService.completeOrder()
   │       ├─→ Update order status
   │       ├─→ Emit: "order.placed" event
   │       └─→ PostgreSQL: UPDATE order SET status='completed'
   │
6. Post-order processing (Event Subscribers)
   │
   ├─→ NFeSubscriber.handleOrderPlaced()
   │   └─→ NFeService.generateNFe()
   │       ├─→ Validate customer data
   │       ├─→ Call NFe provider API
   │       └─→ PostgreSQL: INSERT INTO nfe
   │
   └─→ EmailSubscriber.handleOrderPlaced()
       └─→ EmailService.sendConfirmation()
           └─→ SendGrid: Send email
```

### User Flow: Raffle Ticket Purchase

```
1. Customer views active raffles
   │
   ├─→ GET /store/raffles?status=active (Custom API)
   │   └─→ RaffleService.listActiveRaffles()
   │       └─→ PostgreSQL: SELECT * FROM raffle WHERE status='active'
   │
2. Customer selects raffle and quantity
   │
3. Add raffle tickets to cart (as product variant)
   │
   ├─→ POST /store/cart/:id/line-items
   │   └─→ CartService.addLineItem()
   │       ├─→ Validate raffle availability
   │       ├─→ Check max tickets per customer
   │       └─→ Reserve ticket numbers
   │
4. Complete order (same as product purchase)
   │
5. Raffle ticket assignment (Event Subscriber)
   │
   ├─→ RaffleSubscriber.handleOrderPlaced()
   │   └─→ purchaseRaffleTicketsWorkflow.run()
   │       ├─→ Step 1: Reserve specific ticket numbers
   │       ├─→ Step 2: Confirm payment
   │       ├─→ Step 3: Assign tickets to customer
   │       ├─→ Step 4: Emit "raffle.tickets_purchased" event
   │       └─→ PostgreSQL: INSERT INTO raffle_ticket (batch)
   │
6. Raffle draw (Admin triggered or scheduled)
   │
   ├─→ POST /admin/raffles/:id/execute-draw
   │   └─→ executeRaffleDrawWorkflow.run()
   │       ├─→ Step 1: Validate raffle can be drawn
   │       ├─→ Step 2: Request Chainlink VRF random number (planned)
   │       ├─→ Step 3: Calculate winner ticket
   │       ├─→ Step 4: Update raffle with winner
   │       ├─→ Step 5: Emit "raffle.winner_announced" event
   │       └─→ PostgreSQL: UPDATE raffle, INSERT INTO raffle_draw
   │
7. Winner notification
   │
   └─→ RaffleSubscriber.handleWinnerAnnounced()
       ├─→ EmailService.sendWinnerNotification()
       └─→ Update frontend "Nerd Premiado" (via Strapi)
```

### Content Flow: CMS Pages

```
1. Admin creates page in Strapi CMS
   │
   ├─→ POST /admin/pages (Strapi Admin)
   │   └─→ PostgreSQL: INSERT INTO strapi.pages
   │
2. Frontend fetches page content
   │
   ├─→ GET /api/pages?filters[slug][$eq]=sobre (Strapi Public API)
   │   └─→ PostgreSQL: SELECT * FROM strapi.pages WHERE slug='sobre'
   │
3. Next.js renders page
   │
   └─→ app/[slug]/page.tsx (Server Component)
       ├─→ strapiClient.getPageBySlug('sobre')
       ├─→ RichTextRenderer component
       └─→ HTML response to browser
```

---

## 7. External Integrations

### Payment Providers

#### Stripe (Primary Gateway)

**Use Cases:**
- Credit card payments
- PIX (Brazil instant payment)
- Payment intents
- Subscription billing (future)

**Implementation:**
```typescript
// Medusa built-in integration
await paymentService.createPaymentSession({
  provider: 'stripe',
  amount: 10000, // BRL 100.00
  currency_code: 'brl',
});
```

**Webhooks:**
- `POST /webhooks/stripe`: Handle payment events

#### Coinbase Commerce (Crypto Payments)

**Use Cases:**
- Bitcoin (BTC)
- Ethereum (ETH)
- USD Coin (USDC)
- Other cryptocurrencies

**Implementation:**
```typescript
// Custom integration
const charge = await coinbaseService.createCharge({
  name: 'Order #12345',
  description: 'Products',
  pricing_type: 'fixed_price',
  local_price: { amount: '100.00', currency: 'BRL' },
});
```

**Webhooks:**
- `POST /api/webhooks/coinbase`: Handle charge events

#### Mercado Pago (Brazil)

**Use Cases:**
- Credit cards (Brazilian)
- PIX
- Boleto bancário
- Installment payments

**Status:** Planned integration

### Shipping Providers

#### Melhor Envio (Brazil)

**Use Cases:**
- Multi-carrier shipping quotes
- Real-time tracking
- Label generation

**Status:** Planned integration

### Fiscal/Compliance

#### eNotas / Focus NFe (Brazil)

**Use Cases:**
- NFe (Nota Fiscal Eletrônica) generation
- NFe XML/PDF storage
- SEFAZ validation

**Status:** Planned integration

### Blockchain Services

#### Alchemy (Polygon RPC)

**Use Cases:**
- Ethereum/Polygon node access
- Transaction broadcasting
- Event indexing

**Status:** Planned integration

#### Chainlink VRF (Verifiable Random Function)

**Use Cases:**
- Provably fair raffle draws
- On-chain randomness

**Status:** Planned integration

### Content Delivery

#### Strapi CMS (Internal)

**Use Cases:**
- Dynamic pages (Sobre, Blog posts)
- Banners and promotions
- Hero sections
- Winner gallery (Nerd Premiado)
- Site settings

**Implementation:**
- Self-hosted on Port 1337
- Shared PostgreSQL database
- REST API integration

---

## 8. Security Architecture

### Authentication & Authorization

#### Medusa Admin

- **Method:** JWT (JSON Web Tokens)
- **Endpoint:** `POST /admin/auth`
- **Token Storage:** HTTP-only cookies
- **Expiration:** Configurable (default: 24h)

```http
POST /admin/auth
Content-Type: application/json

{
  "email": "admin@use-nerd.com.br",
  "password": "secure-password"
}

Response:
{
  "user": {...},
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Store API

- **Method:** Publishable API Key
- **Header:** `x-publishable-api-key: pk_xxx...`
- **Scope:** Read-only store operations

```http
GET /store/products
x-publishable-api-key: pk_c9f247ebb15729b47c19f524b7830283...
```

#### Customer Sessions

- **Method:** Session cookies
- **Endpoint:** `POST /store/auth`
- **Storage:** Redis (session store)

### Data Protection

#### Environment Variables

- **Secrets:** Stored in `.env` file (never committed)
- **Production:** Use secrets management (AWS Secrets Manager, Vault)

**Critical Secrets:**
- `JWT_SECRET`
- `COOKIE_SECRET`
- `STRIPE_SECRET_KEY`
- `COINBASE_COMMERCE_API_KEY`
- `PRIVATE_KEY` (wallet - never commit!)

#### Database Security

- **PostgreSQL:** SSL connections in production
- **Passwords:** Encrypted with bcrypt
- **PII:** Customer data encrypted at rest (planned)

#### API Security

- **CORS:** Strict origin policies
- **Rate Limiting:** Redis-based (planned)
- **Input Validation:** Zod schemas (planned)
- **SQL Injection:** Protected by ORM (parameterized queries)
- **XSS:** React auto-escaping + CSP headers (planned)

### Webhook Security

#### Stripe Webhooks

- **Verification:** HMAC signature validation
- **Secret:** `STRIPE_WEBHOOK_SECRET`

```typescript
const signature = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

#### Coinbase Webhooks

- **Verification:** HMAC-SHA256 signature validation
- **Secret:** `COINBASE_COMMERCE_WEBHOOK_SECRET`

### Smart Contract Security (Planned)

- **Auditing:** Third-party security audit before mainnet
- **Standards:** OpenZeppelin contracts (battle-tested)
- **Access Control:** Role-based permissions
- **Upgradeability:** Proxy pattern for fixes
- **Testing:** 100% test coverage requirement

---

## 9. Scalability Considerations

### Horizontal Scaling

#### Application Layer

- **Medusa Backend:** Stateless design (scales with load balancer)
- **Next.js Frontend:** Vercel/Netlify edge deployment
- **Strapi CMS:** Read replicas for content delivery

#### Database Layer

- **PostgreSQL:** Master-replica replication
- **Connection Pooling:** PgBouncer
- **Read Replicas:** Separate for analytics

#### Cache Layer

- **Redis:** Cluster mode for high availability
- **CDN:** Cloudflare/AWS CloudFront for static assets

### Performance Optimization

#### Backend

- **Database Indexes:** Strategic indexing on query patterns
- **Query Optimization:** N+1 prevention with joins
- **Caching:** Redis for frequently accessed data
- **Job Queue:** Background processing for heavy tasks

#### Frontend

- **Code Splitting:** Route-based chunks
- **Image Optimization:** Next.js Image component
- **Bundle Analysis:** Regular bundle size monitoring
- **Server Components:** Reduce client JavaScript

### Monitoring & Observability

- **APM:** Sentry for error tracking (planned)
- **Metrics:** Prometheus + Grafana (planned)
- **Logs:** Structured logging with Winston
- **Alerts:** Critical error notifications

---

## Appendix

### Directory Structure

```
use-nerd/
├── src/
│   ├── modules/              # Custom Medusa modules
│   │   ├── raffle/
│   │   ├── brazil/
│   │   └── crypto-payment/
│   ├── api/                  # Custom API endpoints
│   │   ├── admin/
│   │   ├── store/
│   │   └── webhooks/
│   ├── scripts/              # Utility scripts
│   └── admin/                # Admin UI customizations
├── storefront/               # Next.js 14 frontend
│   ├── app/                  # App Router pages
│   ├── components/           # React components
│   └── lib/                  # Client libraries
├── strapi-cms/               # Strapi CMS
│   ├── src/api/              # Content types
│   └── config/               # Strapi configuration
├── docker-compose.yml        # Local development stack
├── medusa-config.ts          # Medusa configuration
└── docs/                     # Documentation
    ├── technical/
    └── modules/
```

### Key Technologies Summary

| Layer | Primary Tech | Secondary Tech |
|-------|-------------|----------------|
| **Backend** | Medusa v2.0 + TypeScript | Node.js 20, PostgreSQL 15, Redis 7 |
| **Frontend** | Next.js 14 + TypeScript | Tailwind CSS, Zustand, Ethers.js |
| **CMS** | Strapi 4.26 | PostgreSQL (shared) |
| **Blockchain** | Polygon (planned) | Hardhat, OpenZeppelin, Chainlink |
| **Infrastructure** | Docker Compose | GitHub Actions (planned) |

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-18 | Initial architecture documentation |

---

**Document Maintained By:** USE Nerd Development Team
**Contact:** dhiego@pagotto.eu
