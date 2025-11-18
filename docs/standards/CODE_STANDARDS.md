# Code Standards - USE Nerd Platform

**Project**: USE Nerd E-commerce Platform
**Version**: 1.0
**Last Updated**: 2025-11-18
**Maintained By**: Development Team

[English](#english) | [Português](#português)

---

## English

### Table of Contents

1. [TypeScript Guidelines](#typescript-guidelines)
2. [Naming Conventions](#naming-conventions)
3. [File Organization](#file-organization)
4. [React Component Patterns](#react-component-patterns)
5. [Medusa Service Patterns](#medusa-service-patterns)
6. [Testing Standards](#testing-standards)
7. [Documentation Standards](#documentation-standards)
8. [Git Commit Conventions](#git-commit-conventions)
9. [Code Review Checklist](#code-review-checklist)

---

## TypeScript Guidelines

### Strict Mode Configuration

**Always use TypeScript strict mode** - configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Type Definitions

**DO**:
```typescript
// Explicit return types for functions
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Proper interface definitions
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// Type aliases for complex types
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Generics for reusable types
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
```

**DON'T**:
```typescript
// ❌ Implicit any
function processData(data) {
  return data.map(item => item.value);
}

// ❌ Any type (unless absolutely necessary)
const config: any = getConfig();

// ❌ Type assertions without good reason
const user = response as User; // Prefer proper typing
```

### Null and Undefined Handling

```typescript
// DO: Use optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Guest';

// DO: Check for null/undefined explicitly
if (order !== null && order !== undefined) {
  processOrder(order);
}

// DON'T: Assume values exist
const total = order.items.reduce(...); // ❌ order might be null
```

### Utility Types

```typescript
// Partial - make all properties optional
type PartialUser = Partial<User>;

// Pick - select specific properties
type UserCredentials = Pick<User, 'email' | 'password'>;

// Omit - exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Record - key-value pairs
type UserRoles = Record<string, 'admin' | 'customer' | 'moderator'>;

// ReturnType - extract return type of function
type OrderTotal = ReturnType<typeof calculateTotal>;
```

---

## Naming Conventions

### General Rules

| Type | Convention | Example |
|------|-----------|---------|
| **Variables** | camelCase | `userProfile`, `orderTotal` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS`, `API_BASE_URL` |
| **Functions** | camelCase (verb) | `getUserById`, `calculateDiscount` |
| **Classes** | PascalCase | `UserService`, `PaymentProcessor` |
| **Interfaces** | PascalCase | `User`, `OrderItem` |
| **Types** | PascalCase | `PaymentStatus`, `ApiResponse` |
| **Enums** | PascalCase | `OrderStatus`, `UserRole` |
| **Files** | kebab-case | `user-service.ts`, `order-utils.ts` |
| **Directories** | kebab-case | `user-management`, `payment-processing` |
| **React Components** | PascalCase | `UserProfile.tsx`, `OrderList.tsx` |

### Specific Patterns

**Boolean Variables**:
```typescript
// Use is, has, should, can prefixes
const isActive = true;
const hasPermission = checkPermission(user);
const shouldRefresh = lastUpdate < Date.now() - 5000;
const canDelete = user.role === 'admin';
```

**Event Handlers**:
```typescript
// Use handle prefix
const handleSubmit = (event: FormEvent) => { ... };
const handleClick = () => { ... };
const handleUserLogin = async (credentials: Credentials) => { ... };
```

**Async Functions**:
```typescript
// Clear async naming
async function fetchUserData(userId: string): Promise<User> { ... }
async function createOrder(orderData: CreateOrderDTO): Promise<Order> { ... }
```

---

## File Organization

### Backend Structure (Medusa)

```
src/
├── modules/                    # Custom Medusa modules
│   ├── raffle/
│   │   ├── models/            # Data models
│   │   │   ├── raffle.ts
│   │   │   └── raffle-ticket.ts
│   │   ├── services/          # Business logic
│   │   │   └── raffle.ts
│   │   ├── repositories/      # Data access
│   │   │   └── raffle.ts
│   │   ├── workflows/         # Complex operations
│   │   │   └── create-raffle.ts
│   │   ├── subscribers/       # Event handlers
│   │   │   └── raffle-draw.ts
│   │   ├── types/             # Type definitions
│   │   │   └── index.ts
│   │   ├── __tests__/         # Module tests
│   │   │   ├── raffle.service.spec.ts
│   │   │   └── raffle.workflow.spec.ts
│   │   └── index.ts           # Module exports
│   │
│   ├── brazil/                # Brazil-specific integrations
│   │   ├── models/
│   │   │   ├── pix-payment.ts
│   │   │   ├── nfe.ts
│   │   │   └── shipping-quote.ts
│   │   ├── services/
│   │   │   ├── pix.ts
│   │   │   ├── nfe.ts
│   │   │   └── melhor-envio.ts
│   │   └── ...
│   │
│   └── crypto-payment/        # Future: Blockchain payments
│
├── api/                       # API routes
│   ├── store/                 # Storefront routes
│   │   └── raffle/
│   │       └── route.ts
│   ├── admin/                 # Admin routes
│   │   └── raffle/
│   │       └── route.ts
│   └── middlewares/
│       ├── auth.ts
│       └── rate-limit.ts
│
├── utils/                     # Shared utilities
│   ├── logger.ts
│   ├── validators.ts
│   └── helpers.ts
│
├── scripts/                   # CLI scripts
│   ├── seed-database.ts
│   └── fix-product-prices.ts
│
└── instrumentation.ts         # Monitoring setup
```

### Frontend Structure (Next.js)

```
storefront/
├── app/                       # Next.js App Router
│   ├── (store)/              # Store layout group
│   │   ├── page.tsx          # Home page
│   │   ├── produtos/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── rifas/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── checkout/
│   │       └── page.tsx
│   │
│   ├── layout.tsx            # Root layout
│   ├── loading.tsx           # Loading UI
│   ├── error.tsx             # Error UI
│   └── not-found.tsx         # 404 page
│
├── components/               # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── RaffleCard.tsx
│
├── lib/                      # Utilities & clients
│   ├── medusa-client.ts     # Medusa API client
│   ├── strapi-client.ts     # Strapi CMS client
│   └── utils.ts
│
├── styles/
│   └── globals.css          # Global styles
│
└── public/                   # Static assets
    ├── images/
    └── icons/
```

---

## React Component Patterns

### Server vs Client Components

**Default to Server Components**:

```typescript
// app/produtos/page.tsx
// ✅ Server Component (default)
import { getMedusaClient } from '@/lib/medusa-client';

export default async function ProductsPage() {
  const medusa = getMedusaClient();
  const { products } = await medusa.products.list();

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

**Use Client Components only when needed**:

```typescript
// components/AddToCartButton.tsx
'use client'; // ✅ Client Component - needs interactivity

import { useState } from 'react';

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    // Add to cart logic
    setLoading(false);
  };

  return (
    <button onClick={handleAddToCart} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

### Component Structure

```typescript
// ✅ Proper component structure
import { FC } from 'react';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    thumbnail?: string;
  };
  variant?: 'default' | 'compact';
  onAddToCart?: (productId: string) => void;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  variant = 'default',
  onAddToCart,
}) => {
  // Component logic here

  return (
    <div className={`product-card ${variant}`}>
      {/* JSX */}
    </div>
  );
};

// Default props for optional values
ProductCard.defaultProps = {
  variant: 'default',
};
```

### Hooks Usage

```typescript
// ✅ Custom hooks
import { useState, useEffect } from 'react';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await fetch('/api/products');
        setProducts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}
```

---

## Medusa Service Patterns

### Service Class Structure

```typescript
// src/modules/raffle/services/raffle.ts
import { TransactionBaseService } from '@medusajs/medusa';
import { Raffle } from '../models/raffle';
import RaffleRepository from '../repositories/raffle';

type InjectedDependencies = {
  raffleRepository: typeof RaffleRepository;
  eventBusService: any;
  logger: any;
};

class RaffleService extends TransactionBaseService {
  protected raffleRepository_: typeof RaffleRepository;
  protected eventBus_: any;
  protected logger_: any;

  constructor({ raffleRepository, eventBusService, logger }: InjectedDependencies) {
    super(arguments[0]);

    this.raffleRepository_ = raffleRepository;
    this.eventBus_ = eventBusService;
    this.logger_ = logger;
  }

  // ✅ Clear method naming
  async retrieve(raffleId: string): Promise<Raffle> {
    const raffleRepo = this.manager_.withRepository(this.raffleRepository_);
    const raffle = await raffleRepo.findOne({ where: { id: raffleId } });

    if (!raffle) {
      throw new Error(`Raffle with id ${raffleId} not found`);
    }

    return raffle;
  }

  async create(data: CreateRaffleInput): Promise<Raffle> {
    return await this.atomicPhase_(async (manager) => {
      const raffleRepo = manager.withRepository(this.raffleRepository_);

      const raffle = raffleRepo.create({
        title: data.title,
        description: data.description,
        ticket_price: data.ticket_price,
        total_tickets: data.total_tickets,
        draw_date: data.draw_date,
      });

      const result = await raffleRepo.save(raffle);

      // Emit event
      await this.eventBus_.emit('raffle.created', { id: result.id });

      return result;
    });
  }

  async purchaseTicket(raffleId: string, customerId: string, quantity: number): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      // Business logic with transaction
      const raffleRepo = manager.withRepository(this.raffleRepository_);
      const raffle = await raffleRepo.findOne({ where: { id: raffleId } });

      if (!raffle) {
        throw new Error('Raffle not found');
      }

      if (raffle.tickets_sold + quantity > raffle.total_tickets) {
        throw new Error('Not enough tickets available');
      }

      // Update sold tickets
      raffle.tickets_sold += quantity;
      await raffleRepo.save(raffle);

      this.logger_.info(`Purchased ${quantity} tickets for raffle ${raffleId}`);
    });
  }
}

export default RaffleService;
```

### Model Definition

```typescript
// src/modules/raffle/models/raffle.ts
import { BeforeInsert, Column, Entity } from 'typeorm';
import { BaseEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';

@Entity()
export class Raffle extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int' })
  ticket_price: number;

  @Column({ type: 'int' })
  total_tickets: number;

  @Column({ type: 'int', default: 0 })
  tickets_sold: number;

  @Column({ type: 'timestamp' })
  draw_date: Date;

  @Column({ type: 'varchar', nullable: true })
  winner_id: string | null;

  @Column({ type: 'varchar', default: 'active' })
  status: 'active' | 'completed' | 'cancelled';

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'raffle');
  }
}
```

---

## Testing Standards

### Test Coverage Requirements

- **Minimum 80% coverage** for all modules
- **100% coverage** for critical business logic (payments, raffles)
- **Integration tests** for all API endpoints
- **E2E tests** for critical user flows

### Unit Test Structure (Jest)

```typescript
// src/modules/raffle/__tests__/raffle.service.spec.ts
import { RaffleService } from '../services/raffle';
import { Raffle } from '../models/raffle';

describe('RaffleService', () => {
  let raffleService: RaffleService;
  let mockRaffleRepository: any;
  let mockEventBus: any;
  let mockLogger: any;

  beforeEach(() => {
    // Setup mocks
    mockRaffleRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockEventBus = {
      emit: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    raffleService = new RaffleService({
      raffleRepository: mockRaffleRepository,
      eventBusService: mockEventBus,
      logger: mockLogger,
    });
  });

  describe('create', () => {
    it('should create a raffle successfully', async () => {
      // Arrange
      const raffleData = {
        title: 'Test Raffle',
        ticket_price: 1000,
        total_tickets: 100,
        draw_date: new Date('2025-12-31'),
      };

      const expectedRaffle = {
        id: 'raffle_123',
        ...raffleData,
        tickets_sold: 0,
        status: 'active',
      };

      mockRaffleRepository.create.mockReturnValue(expectedRaffle);
      mockRaffleRepository.save.mockResolvedValue(expectedRaffle);

      // Act
      const result = await raffleService.create(raffleData);

      // Assert
      expect(result).toEqual(expectedRaffle);
      expect(mockEventBus.emit).toHaveBeenCalledWith('raffle.created', { id: 'raffle_123' });
    });

    it('should throw error when ticket price is invalid', async () => {
      // Arrange
      const invalidData = {
        title: 'Test Raffle',
        ticket_price: -100,
        total_tickets: 100,
        draw_date: new Date('2025-12-31'),
      };

      // Act & Assert
      await expect(raffleService.create(invalidData)).rejects.toThrow('Invalid ticket price');
    });
  });

  describe('purchaseTicket', () => {
    it('should purchase tickets when available', async () => {
      // Test implementation
    });

    it('should throw error when not enough tickets available', async () => {
      // Test implementation
    });
  });
});
```

### Integration Test Example

```typescript
// src/api/store/raffle/__tests__/raffle.route.spec.ts
import { setupTestServer } from '@medusajs/medusa/dist/utils';

describe('POST /store/raffles/:id/purchase', () => {
  let testServer;
  let dbConnection;

  beforeAll(async () => {
    const setup = await setupTestServer();
    testServer = setup.server;
    dbConnection = setup.dbConnection;
  });

  afterAll(async () => {
    await dbConnection.close();
  });

  it('should purchase raffle tickets', async () => {
    // Create test raffle
    const raffle = await createTestRaffle({
      title: 'Test Raffle',
      ticket_price: 1000,
      total_tickets: 100,
    });

    // Purchase tickets
    const response = await testServer.post(`/store/raffles/${raffle.id}/purchase`)
      .send({ quantity: 5 })
      .expect(200);

    expect(response.body.raffle.tickets_sold).toBe(5);
  });
});
```

### E2E Test Example (Playwright)

```typescript
// storefront/__tests__/e2e/raffle-purchase.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Raffle Purchase Flow', () => {
  test('should allow user to purchase raffle tickets', async ({ page }) => {
    // Navigate to raffle page
    await page.goto('/rifas/raffle_123');

    // Check raffle details are displayed
    await expect(page.locator('h1')).toContainText('Test Raffle');
    await expect(page.locator('[data-testid="ticket-price"]')).toContainText('R$ 10,00');

    // Select quantity
    await page.locator('[data-testid="quantity-input"]').fill('5');

    // Click purchase button
    await page.locator('[data-testid="purchase-button"]').click();

    // Wait for confirmation
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Tickets purchased successfully');
  });
});
```

---

## Documentation Standards

### JSDoc Comments

```typescript
/**
 * Calculate the total price of cart items including discounts and taxes
 *
 * @param items - Array of cart items
 * @param discountCode - Optional discount code to apply
 * @returns Object containing subtotal, discount, tax, and total
 *
 * @example
 * ```typescript
 * const total = calculateCartTotal(cartItems, 'SUMMER2025');
 * console.log(total.total); // 15000 (in cents)
 * ```
 */
export function calculateCartTotal(
  items: CartItem[],
  discountCode?: string
): CartTotal {
  // Implementation
}
```

### README Files

Every module should have a README:

```markdown
# Raffle Module

## Overview
Manages raffle creation, ticket sales, and winner draws.

## Features
- Create raffles with configurable parameters
- Sell tickets with inventory control
- Automated draw scheduling
- Winner notification

## Installation
See main project README

## Usage
```typescript
import { RaffleService } from './modules/raffle/services/raffle';

const raffle = await raffleService.create({
  title: 'Summer Raffle 2025',
  ticket_price: 1000,
  total_tickets: 100,
  draw_date: new Date('2025-12-31'),
});
```

## API Endpoints
- `POST /admin/raffles` - Create raffle
- `GET /store/raffles` - List active raffles
- `POST /store/raffles/:id/purchase` - Purchase tickets

## Testing
```bash
npm test src/modules/raffle
```
```

---

## Git Commit Conventions

### Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(raffle): add ticket purchase validation` |
| `fix` | Bug fix | `fix(payment): correct PIX qr code generation` |
| `docs` | Documentation | `docs(api): update raffle endpoints` |
| `style` | Code style (formatting) | `style(components): format with prettier` |
| `refactor` | Code refactoring | `refactor(service): simplify raffle logic` |
| `test` | Add/update tests | `test(raffle): add purchase flow tests` |
| `chore` | Maintenance | `chore(deps): update medusa to v2.1` |
| `perf` | Performance improvement | `perf(db): add index on raffle tickets` |

### Good Commit Examples

```bash
# Feature
git commit -m "feat(raffle): implement ticket purchase with inventory control

- Add purchaseTicket method to RaffleService
- Validate ticket availability
- Emit raffle.ticket_purchased event
- Update tickets_sold counter

Closes #123"

# Bug fix
git commit -m "fix(payment): prevent duplicate PIX payment processing

Race condition was causing duplicate payments when user
refreshed the payment page. Added idempotency check using
payment_intent_id.

Fixes #456"

# Documentation
git commit -m "docs(deployment): add AWS deployment guide

Added comprehensive guide covering:
- ECS Fargate setup
- RDS configuration
- Environment variables
- Monitoring setup"
```

### Bad Commit Examples

```bash
# ❌ Too vague
git commit -m "fix bug"

# ❌ No type
git commit -m "updated raffle service"

# ❌ Multiple changes
git commit -m "feat: add raffle, fix payment, update docs"
```

---

## Code Review Checklist

### Reviewer Checklist

Before approving a pull request, verify:

- [ ] **Code Quality**
  - [ ] Follows TypeScript strict mode
  - [ ] No `any` types (unless justified)
  - [ ] Proper error handling
  - [ ] No console.log (use logger instead)
  - [ ] DRY principle followed

- [ ] **Testing**
  - [ ] Unit tests added/updated
  - [ ] Test coverage >= 80%
  - [ ] All tests pass
  - [ ] Edge cases covered

- [ ] **Security**
  - [ ] No exposed secrets
  - [ ] Input validation present
  - [ ] SQL injection prevented
  - [ ] XSS protection in place
  - [ ] Authentication/authorization checked

- [ ] **Performance**
  - [ ] No N+1 queries
  - [ ] Proper database indexes
  - [ ] Efficient algorithms used
  - [ ] No memory leaks

- [ ] **Documentation**
  - [ ] JSDoc comments added
  - [ ] README updated if needed
  - [ ] API docs updated
  - [ ] Complex logic explained

- [ ] **Git**
  - [ ] Conventional commit format
  - [ ] Atomic commits
  - [ ] No merge commits (use rebase)
  - [ ] Branch up to date with main

---

## Português

### Sumário

1. [Diretrizes TypeScript](#diretrizes-typescript)
2. [Convenções de Nomenclatura](#convenções-de-nomenclatura)
3. [Organização de Arquivos](#organização-de-arquivos)
4. [Padrões de Componentes React](#padrões-de-componentes-react)
5. [Padrões de Serviços Medusa](#padrões-de-serviços-medusa)
6. [Padrões de Testes](#padrões-de-testes)
7. [Padrões de Documentação](#padrões-de-documentação)
8. [Convenções de Commit Git](#convenções-de-commit-git)
9. [Checklist de Code Review](#checklist-de-code-review)

---

## Diretrizes TypeScript

### Configuração Strict Mode

**Sempre use TypeScript strict mode** - configurado em `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Definições de Tipos

**FAÇA**:
```typescript
// Tipos de retorno explícitos
function calcularTotal(items: ItemCarrinho[]): number {
  return items.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}

// Interfaces apropriadas
interface Usuario {
  id: string;
  email: string;
  nome: string;
  criadoEm: Date;
}
```

**NÃO FAÇA**:
```typescript
// ❌ Any implícito
function processarDados(dados) {
  return dados.map(item => item.valor);
}

// ❌ Tipo any (a menos que absolutamente necessário)
const config: any = obterConfig();
```

---

## Convenções de Nomenclatura

### Regras Gerais

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| **Variáveis** | camelCase | `perfilUsuario`, `totalPedido` |
| **Constantes** | UPPER_SNAKE_CASE | `MAX_TENTATIVAS`, `URL_BASE_API` |
| **Funções** | camelCase (verbo) | `obterUsuarioPorId`, `calcularDesconto` |
| **Classes** | PascalCase | `ServicoUsuario`, `ProcessadorPagamento` |
| **Interfaces** | PascalCase | `Usuario`, `ItemPedido` |
| **Arquivos** | kebab-case | `servico-usuario.ts`, `utils-pedido.ts` |
| **Componentes React** | PascalCase | `PerfilUsuario.tsx`, `ListaPedidos.tsx` |

---

## Organização de Arquivos

### Estrutura Backend (Medusa)

```
src/
├── modules/                    # Módulos customizados Medusa
│   ├── raffle/
│   │   ├── models/            # Modelos de dados
│   │   ├── services/          # Lógica de negócio
│   │   ├── repositories/      # Acesso a dados
│   │   ├── workflows/         # Operações complexas
│   │   ├── __tests__/         # Testes do módulo
│   │   └── index.ts
│   │
│   └── brazil/                # Integrações Brasil
│       ├── services/
│       │   ├── pix.ts
│       │   ├── nfe.ts
│       │   └── melhor-envio.ts
│       └── ...
```

---

## Padrões de Componentes React

### Server vs Client Components

**Padrão: Server Components**:

```typescript
// app/produtos/page.tsx
// ✅ Server Component (padrão)
import { getMedusaClient } from '@/lib/medusa-client';

export default async function PaginaProdutos() {
  const medusa = getMedusaClient();
  const { products } = await medusa.products.list();

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(produto => (
        <CardProduto key={produto.id} produto={produto} />
      ))}
    </div>
  );
}
```

**Use Client Components apenas quando necessário**:

```typescript
// components/BotaoAdicionarCarrinho.tsx
'use client'; // ✅ Client Component - precisa interatividade

import { useState } from 'react';

export function BotaoAdicionarCarrinho({ produtoId }: Props) {
  const [carregando, setCarregando] = useState(false);

  const adicionarAoCarrinho = async () => {
    setCarregando(true);
    // Lógica de adicionar ao carrinho
    setCarregando(false);
  };

  return (
    <button onClick={adicionarAoCarrinho} disabled={carregando}>
      {carregando ? 'Adicionando...' : 'Adicionar ao Carrinho'}
    </button>
  );
}
```

---

## Padrões de Serviços Medusa

### Estrutura de Classe de Serviço

```typescript
// src/modules/raffle/services/raffle.ts
import { TransactionBaseService } from '@medusajs/medusa';
import { Raffle } from '../models/raffle';

class RaffleService extends TransactionBaseService {
  protected raffleRepository_: typeof RaffleRepository;

  async criar(dados: CriarRaffleInput): Promise<Raffle> {
    return await this.atomicPhase_(async (manager) => {
      const raffleRepo = manager.withRepository(this.raffleRepository_);

      const raffle = raffleRepo.create({
        titulo: dados.titulo,
        descricao: dados.descricao,
        preco_bilhete: dados.preco_bilhete,
        total_bilhetes: dados.total_bilhetes,
        data_sorteio: dados.data_sorteio,
      });

      const resultado = await raffleRepo.save(raffle);
      return resultado;
    });
  }
}

export default RaffleService;
```

---

## Padrões de Testes

### Requisitos de Cobertura

- **Mínimo 80% de cobertura** para todos os módulos
- **100% de cobertura** para lógica crítica (pagamentos, rifas)
- **Testes de integração** para todos endpoints da API
- **Testes E2E** para fluxos críticos de usuário

### Estrutura de Teste Unitário (Jest)

```typescript
// src/modules/raffle/__tests__/raffle.service.spec.ts
describe('RaffleService', () => {
  let raffleService: RaffleService;

  beforeEach(() => {
    // Setup dos mocks
  });

  describe('criar', () => {
    it('deve criar uma rifa com sucesso', async () => {
      // Arrange
      const dadosRifa = {
        titulo: 'Rifa de Teste',
        preco_bilhete: 1000,
        total_bilhetes: 100,
        data_sorteio: new Date('2025-12-31'),
      };

      // Act
      const resultado = await raffleService.criar(dadosRifa);

      // Assert
      expect(resultado).toEqual(expect.objectContaining(dadosRifa));
    });

    it('deve lançar erro quando preço do bilhete é inválido', async () => {
      // Test implementation
    });
  });
});
```

---

## Padrões de Documentação

### Comentários JSDoc

```typescript
/**
 * Calcula o preço total dos itens do carrinho incluindo descontos e impostos
 *
 * @param items - Array de itens do carrinho
 * @param codigoDesconto - Código de desconto opcional para aplicar
 * @returns Objeto contendo subtotal, desconto, imposto e total
 *
 * @example
 * ```typescript
 * const total = calcularTotalCarrinho(itens, 'VERAO2025');
 * console.log(total.total); // 15000 (em centavos)
 * ```
 */
export function calcularTotalCarrinho(
  items: ItemCarrinho[],
  codigoDesconto?: string
): TotalCarrinho {
  // Implementação
}
```

---

## Convenções de Commit Git

### Formato Conventional Commits

```
<tipo>(<escopo>): <assunto>

<corpo>

<rodapé>
```

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat(rifa): adicionar validação de compra` |
| `fix` | Correção de bug | `fix(pagamento): corrigir geração QR code PIX` |
| `docs` | Documentação | `docs(api): atualizar endpoints de rifa` |
| `test` | Adicionar/atualizar testes | `test(rifa): adicionar testes de compra` |
| `refactor` | Refatoração | `refactor(servico): simplificar lógica de rifa` |

### Exemplos de Bons Commits

```bash
# Funcionalidade
git commit -m "feat(rifa): implementar compra de bilhetes com controle de estoque

- Adicionar método comprarBilhete ao RaffleService
- Validar disponibilidade de bilhetes
- Emitir evento rifa.bilhete_comprado
- Atualizar contador bilhetes_vendidos

Fecha #123"

# Correção
git commit -m "fix(pagamento): prevenir processamento duplicado PIX

Condição de corrida estava causando pagamentos duplicados
quando usuário atualizava página. Adicionado verificação de
idempotência usando payment_intent_id.

Corrige #456"
```

---

## Checklist de Code Review

### Checklist do Revisor

Antes de aprovar um pull request, verificar:

- [ ] **Qualidade de Código**
  - [ ] Segue TypeScript strict mode
  - [ ] Sem tipos `any` (a menos que justificado)
  - [ ] Tratamento de erros apropriado
  - [ ] Sem console.log (usar logger)

- [ ] **Testes**
  - [ ] Testes unitários adicionados/atualizados
  - [ ] Cobertura >= 80%
  - [ ] Todos testes passando

- [ ] **Segurança**
  - [ ] Sem secrets expostos
  - [ ] Validação de input presente
  - [ ] Prevenção de SQL injection
  - [ ] Proteção XSS implementada

- [ ] **Documentação**
  - [ ] Comentários JSDoc adicionados
  - [ ] README atualizado se necessário
  - [ ] Lógica complexa explicada

---

**Document Version**: 1.0
**Last Updated**: 2025-11-18
**Maintained By**: Development Team
