# Module Documentation

[English](#english) | [Portugues](#portugues)

---

## English

### Overview

This directory contains documentation for all custom modules in the USE Nerd platform. Each module is documented separately with its architecture, API, and usage examples.

### Module Structure

Each module in USE Nerd follows a standard structure:

```
src/modules/module-name/
├── models/           # Data models and entities
├── services/         # Business logic and service layer
├── repositories/     # Data access layer
├── workflows/        # Module-specific workflows
├── subscribers/      # Event subscribers
├── migrations/       # Database migrations
├── __tests__/       # Unit and integration tests
└── index.ts         # Module exports
```

---

## Available Modules

### Core Modules (Medusa v2.0)

Built-in commerce modules provided by Medusa. See [Medusa Documentation](https://docs.medusajs.com/) for details.

- **Product Module** - Product catalog management
- **Cart Module** - Shopping cart functionality
- **Order Module** - Order processing
- **Customer Module** - Customer management
- **Payment Module** - Payment processing
- **Fulfillment Module** - Order fulfillment
- **Inventory Module** - Stock management
- **Region Module** - Multi-region support

---

## Custom Modules

### 1. Raffle Module

**Status:** Planned

Manages raffle campaigns, ticket sales, and drawings.

[View Full Documentation](./raffle/README.md)

**Key Features:**
- Create and manage raffle campaigns
- Handle ticket purchases
- Execute provably fair drawings
- Manage winners and prizes

**Entities:**
- `Raffle` - Raffle campaign configuration
- `RaffleEntry` - User raffle tickets
- `RaffleDrawing` - Drawing execution records
- `RaffleWinner` - Winner information
- `RafflePrize` - Prize definitions

**Services:**
- `RaffleService` - Core raffle operations
- `RaffleEntryService` - Entry management
- `RaffleDrawingService` - Drawing execution

**Workflows:**
- `RafflePurchaseWorkflow` - Ticket purchase flow
- `RaffleDrawingWorkflow` - Drawing execution flow
- `WinnerNotificationWorkflow` - Winner notification

**API Endpoints:**
- Store: `/store/raffles`, `/store/raffle-entries`
- Admin: `/admin/raffles`, `/admin/raffle-drawings`

---

### 2. Blockchain Module

**Status:** Planned

Provides blockchain integration for verifiable randomness and proof storage.

[View Full Documentation](./blockchain/README.md)

**Key Features:**
- Polygon blockchain integration
- Chainlink VRF for randomness
- On-chain proof storage
- Transaction management
- Gas optimization

**Services:**
- `BlockchainService` - Core blockchain operations
- `RandomnessProvider` - VRF integration
- `ProofValidator` - Verify on-chain proofs
- `WalletService` - Wallet management
- `ContractManager` - Smart contract deployment

**Events:**
- `RandomnessRequested` - VRF request initiated
- `RandomnessFulfilled` - Random number received
- `ProofStored` - Proof written to blockchain
- `TransactionConfirmed` - Transaction confirmed

**API Endpoints:**
- Admin: `/admin/blockchain/status`, `/admin/blockchain/verify`

---

### 3. Notification Module

**Status:** Planned

Handles all customer and admin notifications across multiple channels.

[View Full Documentation](./notification/README.md)

**Key Features:**
- Email notifications
- SMS notifications (Brazilian providers)
- Push notifications (future)
- Template management
- Notification preferences

**Services:**
- `EmailService` - Email delivery
- `SMSService` - SMS delivery
- `TemplateService` - Template management
- `NotificationPreferenceService` - User preferences

**Notification Types:**
- Order confirmations
- Raffle purchase confirmations
- Winner announcements
- Shipping updates
- Marketing campaigns

---

### 4. Analytics Module

**Status:** Planned

Provides business intelligence and analytics capabilities.

[View Full Documentation](./analytics/README.md)

**Key Features:**
- Raffle performance metrics
- Sales analytics
- Customer insights
- Revenue reporting
- Conversion tracking

**Services:**
- `RaffleAnalyticsService` - Raffle metrics
- `SalesAnalyticsService` - Sales data
- `CustomerAnalyticsService` - Customer behavior
- `ReportingService` - Report generation

---

## Module Development Guidelines

### Creating a New Module

1. **Define Module Structure**
```typescript
// src/modules/your-module/index.ts
import { Module } from "@medusajs/framework/utils"

export default Module("your-module", {
  service: YourModuleService,
})
```

2. **Define Models**
```typescript
// src/modules/your-module/models/your-model.ts
import { model } from "@medusajs/framework/utils"

const YourModel = model.define("your_model", {
  id: model.id().primaryKey(),
  name: model.text(),
  // ... other fields
})

export default YourModel
```

3. **Create Service**
```typescript
// src/modules/your-module/services/your-service.ts
import { MedusaService } from "@medusajs/framework/utils"

class YourModuleService extends MedusaService({
  YourModel,
}) {
  async create(data) {
    return await this.yourModelRepository_.create(data)
  }
}

export default YourModuleService
```

4. **Add Tests**
```typescript
// src/modules/your-module/__tests__/your-service.spec.ts
describe("YourModuleService", () => {
  it("should create entity", async () => {
    // Test implementation
  })
})
```

5. **Document the Module**
   - Create `docs/modules/your-module/README.md`
   - Document entities, services, and API
   - Provide usage examples

### Module Best Practices

1. **Single Responsibility**
   - Each module should have a clear, focused purpose
   - Don't create "god modules" that do everything

2. **Clear Interfaces**
   - Define clear service interfaces
   - Document input/output types
   - Use TypeScript strictly

3. **Event-Driven Design**
   - Emit events for significant actions
   - Subscribe to events from other modules
   - Keep modules loosely coupled

4. **Testing**
   - Unit test all services
   - Integration test workflows
   - Mock external dependencies

5. **Documentation**
   - Keep module docs updated
   - Include usage examples
   - Document breaking changes

---

## Module Dependencies

```
┌─────────────────┐
│  Raffle Module  │
└────────┬────────┘
         │
         ├──depends on──▶ Blockchain Module (randomness)
         ├──depends on──▶ Order Module (purchases)
         ├──depends on──▶ Customer Module (participants)
         └──depends on──▶ Notification Module (alerts)

┌─────────────────────┐
│  Blockchain Module  │
└─────────────────────┘
         │
         └──no dependencies (infrastructure)

┌─────────────────────┐
│ Notification Module │
└─────────────────────┘
         │
         ├──depends on──▶ Customer Module (recipients)
         └──depends on──▶ Order Module (order notifications)
```

---

## Portugues

### Visao Geral

Este diretorio contem documentacao para todos os modulos customizados na plataforma USE Nerd. Cada modulo e documentado separadamente com sua arquitetura, API e exemplos de uso.

### Estrutura de Modulo

Cada modulo no USE Nerd segue uma estrutura padrao:

```
src/modules/nome-modulo/
├── models/           # Modelos de dados e entidades
├── services/         # Logica de negocio e camada de servico
├── repositories/     # Camada de acesso a dados
├── workflows/        # Workflows especificos do modulo
├── subscribers/      # Subscribers de eventos
├── migrations/       # Migracoes de banco de dados
├── __tests__/       # Testes unitarios e de integracao
└── index.ts         # Exports do modulo
```

---

## Modulos Disponiveis

### Modulos Core (Medusa v2.0)

Modulos de comercio integrados fornecidos pelo Medusa.

---

## Modulos Customizados

### 1. Modulo de Sorteio

**Status:** Planejado

Gerencia campanhas de sorteio, vendas de tickets e sorteios.

[Ver Documentacao Completa](./raffle/README.md)

**Funcionalidades Principais:**
- Criar e gerenciar campanhas de sorteio
- Lidar com compras de tickets
- Executar sorteios proveravelmente justos
- Gerenciar vencedores e premios

---

### 2. Modulo Blockchain

**Status:** Planejado

Fornece integracao blockchain para aleatoriedade verificavel e armazenamento de provas.

[Ver Documentacao Completa](./blockchain/README.md)

**Funcionalidades Principais:**
- Integracao blockchain Polygon
- Chainlink VRF para aleatoriedade
- Armazenamento de provas on-chain
- Gestao de transacoes
- Otimizacao de gas

---

### 3. Modulo de Notificacao

**Status:** Planejado

Gerencia todas as notificacoes de clientes e admin em multiplos canais.

---

### 4. Modulo de Analytics

**Status:** Planejado

Fornece capacidades de business intelligence e analytics.

---

## Diretrizes de Desenvolvimento de Modulo

### Criando um Novo Modulo

Ver secao em Ingles acima para exemplos de codigo e melhores praticas.

### Melhores Praticas de Modulo

1. **Responsabilidade Unica**
2. **Interfaces Claras**
3. **Design Orientado a Eventos**
4. **Testes**
5. **Documentacao**
