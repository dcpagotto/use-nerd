# Testing Strategy - USE Nerd Platform

**Project**: USE Nerd E-commerce Platform
**Version**: 1.0
**Last Updated**: 2025-11-18
**Maintained By**: QA Team

[English](#english) | [Português](#português)

---

## English

### Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test Coverage Targets](#test-coverage-targets)
3. [Unit Testing (Jest)](#unit-testing-jest)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing (Playwright)](#end-to-end-testing-playwright)
6. [Performance Testing](#performance-testing)
7. [Security Testing](#security-testing)
8. [Manual Testing Checklist](#manual-testing-checklist)
9. [CI/CD Testing Pipeline](#cicd-testing-pipeline)
10. [Test Data Management](#test-data-management)

---

## Testing Philosophy

### Testing Pyramid

```
           /\
          /  \
         / E2E \          ← Few (Critical user flows)
        /______\
       /        \
      /Integration\       ← Some (API endpoints, workflows)
     /____________\
    /              \
   /  Unit Tests    \     ← Many (Business logic, utilities)
  /__________________\
```

**Principle**: More unit tests, fewer integration tests, even fewer E2E tests.

### Test-Driven Development (TDD)

**Encouraged but not mandatory**. For critical business logic:

1. **Red**: Write failing test first
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

### Testing Principles

- **Fast**: Tests should run quickly (unit tests < 100ms each)
- **Isolated**: Tests should not depend on each other
- **Repeatable**: Same result every time
- **Self-Validating**: Clear pass/fail (no manual verification)
- **Timely**: Written close to production code

---

## Test Coverage Targets

### Coverage Goals

| Test Type | Coverage Target | Priority |
|-----------|----------------|----------|
| **Unit Tests** | 80% minimum | High |
| **Critical Paths** | 100% | Critical |
| **Integration** | 70% | Medium |
| **E2E** | Critical flows | High |

### Critical Paths Requiring 100% Coverage

1. **Payment Processing**
   - PIX payment creation
   - Mercado Pago integration
   - Payment webhook handling
   - Refund processing

2. **Raffle System**
   - Ticket purchase validation
   - Inventory control
   - Draw execution
   - Winner selection

3. **Order Management**
   - Cart to order conversion
   - Stock updates
   - Order status transitions

4. **Authentication**
   - Login/logout
   - Password reset
   - Token refresh
   - Session management

### Measuring Coverage

```bash
# Run tests with coverage
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html

# Coverage thresholds in package.json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      },
      "./src/modules/raffle/": {
        "branches": 100,
        "functions": 100,
        "lines": 100,
        "statements": 100
      },
      "./src/modules/brazil/services/pix.ts": {
        "branches": 100,
        "functions": 100,
        "lines": 100,
        "statements": 100
      }
    }
  }
}
```

---

## Unit Testing (Jest)

### Configuration

```typescript
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.spec.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/types/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

export default config;
```

### Test Structure (AAA Pattern)

```typescript
// src/modules/raffle/__tests__/raffle.service.spec.ts
import { RaffleService } from '../services/raffle';
import { Raffle } from '../models/raffle';

describe('RaffleService', () => {
  let raffleService: RaffleService;
  let mockRaffleRepository: jest.Mocked<any>;
  let mockEventBus: jest.Mocked<any>;

  beforeEach(() => {
    // Setup fresh mocks before each test
    mockRaffleRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockEventBus = {
      emit: jest.fn(),
    };

    raffleService = new RaffleService({
      raffleRepository: mockRaffleRepository,
      eventBusService: mockEventBus,
    });
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a raffle successfully', async () => {
      // ============================================
      // ARRANGE - Setup test data and expectations
      // ============================================
      const raffleData = {
        title: 'Summer Raffle 2025',
        description: 'Win amazing prizes',
        ticket_price: 1000, // R$ 10.00 in cents
        total_tickets: 100,
        draw_date: new Date('2025-12-31'),
      };

      const expectedRaffle: Raffle = {
        id: 'raffle_123',
        ...raffleData,
        tickets_sold: 0,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRaffleRepository.create.mockReturnValue(expectedRaffle);
      mockRaffleRepository.save.mockResolvedValue(expectedRaffle);

      // ============================================
      // ACT - Execute the code under test
      // ============================================
      const result = await raffleService.create(raffleData);

      // ============================================
      // ASSERT - Verify expectations
      // ============================================
      expect(result).toEqual(expectedRaffle);
      expect(mockRaffleRepository.create).toHaveBeenCalledWith(raffleData);
      expect(mockRaffleRepository.save).toHaveBeenCalledWith(expectedRaffle);
      expect(mockEventBus.emit).toHaveBeenCalledWith('raffle.created', {
        id: 'raffle_123',
      });
    });

    it('should throw error when ticket price is negative', async () => {
      // Arrange
      const invalidData = {
        title: 'Test Raffle',
        ticket_price: -100,
        total_tickets: 100,
        draw_date: new Date('2025-12-31'),
      };

      // Act & Assert
      await expect(raffleService.create(invalidData)).rejects.toThrow(
        'Ticket price must be positive'
      );

      // Verify event was not emitted
      expect(mockEventBus.emit).not.toHaveBeenCalled();
    });

    it('should throw error when total tickets is zero', async () => {
      // Arrange
      const invalidData = {
        title: 'Test Raffle',
        ticket_price: 1000,
        total_tickets: 0,
        draw_date: new Date('2025-12-31'),
      };

      // Act & Assert
      await expect(raffleService.create(invalidData)).rejects.toThrow(
        'Total tickets must be greater than zero'
      );
    });

    it('should throw error when draw date is in the past', async () => {
      // Arrange
      const invalidData = {
        title: 'Test Raffle',
        ticket_price: 1000,
        total_tickets: 100,
        draw_date: new Date('2020-01-01'),
      };

      // Act & Assert
      await expect(raffleService.create(invalidData)).rejects.toThrow(
        'Draw date must be in the future'
      );
    });
  });

  describe('purchaseTicket', () => {
    it('should purchase tickets when available', async () => {
      // Arrange
      const raffleId = 'raffle_123';
      const customerId = 'customer_456';
      const quantity = 5;

      const existingRaffle: Raffle = {
        id: raffleId,
        title: 'Test Raffle',
        ticket_price: 1000,
        total_tickets: 100,
        tickets_sold: 10,
        status: 'active',
        draw_date: new Date('2025-12-31'),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRaffleRepository.findOne.mockResolvedValue(existingRaffle);
      mockRaffleRepository.save.mockResolvedValue({
        ...existingRaffle,
        tickets_sold: 15,
      });

      // Act
      await raffleService.purchaseTicket(raffleId, customerId, quantity);

      // Assert
      expect(mockRaffleRepository.findOne).toHaveBeenCalledWith({
        where: { id: raffleId },
      });

      expect(mockRaffleRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          tickets_sold: 15,
        })
      );

      expect(mockEventBus.emit).toHaveBeenCalledWith('raffle.ticket_purchased', {
        raffleId,
        customerId,
        quantity,
      });
    });

    it('should throw error when not enough tickets available', async () => {
      // Arrange
      const existingRaffle: Raffle = {
        id: 'raffle_123',
        title: 'Test Raffle',
        ticket_price: 1000,
        total_tickets: 100,
        tickets_sold: 98, // Only 2 left
        status: 'active',
        draw_date: new Date('2025-12-31'),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRaffleRepository.findOne.mockResolvedValue(existingRaffle);

      // Act & Assert
      await expect(
        raffleService.purchaseTicket('raffle_123', 'customer_456', 5)
      ).rejects.toThrow('Not enough tickets available');

      // Verify repository was not updated
      expect(mockRaffleRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when raffle is not active', async () => {
      // Arrange
      const completedRaffle: Raffle = {
        id: 'raffle_123',
        title: 'Test Raffle',
        ticket_price: 1000,
        total_tickets: 100,
        tickets_sold: 100,
        status: 'completed',
        draw_date: new Date('2025-12-31'),
        winner_id: 'customer_999',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRaffleRepository.findOne.mockResolvedValue(completedRaffle);

      // Act & Assert
      await expect(
        raffleService.purchaseTicket('raffle_123', 'customer_456', 1)
      ).rejects.toThrow('Raffle is not active');
    });
  });

  describe('retrieve', () => {
    it('should retrieve raffle by id', async () => {
      // Arrange
      const raffle: Raffle = {
        id: 'raffle_123',
        title: 'Test Raffle',
        ticket_price: 1000,
        total_tickets: 100,
        tickets_sold: 50,
        status: 'active',
        draw_date: new Date('2025-12-31'),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRaffleRepository.findOne.mockResolvedValue(raffle);

      // Act
      const result = await raffleService.retrieve('raffle_123');

      // Assert
      expect(result).toEqual(raffle);
      expect(mockRaffleRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'raffle_123' },
      });
    });

    it('should throw error when raffle not found', async () => {
      // Arrange
      mockRaffleRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(raffleService.retrieve('nonexistent_id')).rejects.toThrow(
        'Raffle with id nonexistent_id not found'
      );
    });
  });
});
```

### Testing Utilities

```typescript
// src/utils/__tests__/validators.spec.ts
import { isValidCPF, isValidCNPJ, formatCurrency } from '../validators';

describe('Validators', () => {
  describe('isValidCPF', () => {
    it('should validate correct CPF', () => {
      expect(isValidCPF('12345678909')).toBe(true);
      expect(isValidCPF('11144477735')).toBe(true);
    });

    it('should reject invalid CPF', () => {
      expect(isValidCPF('12345678900')).toBe(false); // Invalid check digit
      expect(isValidCPF('11111111111')).toBe(false); // All same digits
      expect(isValidCPF('123')).toBe(false); // Too short
    });

    it('should reject non-numeric CPF', () => {
      expect(isValidCPF('123.456.789-09')).toBe(false);
      expect(isValidCPF('abc12345678')).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    it('should format cents to BRL currency', () => {
      expect(formatCurrency(1000)).toBe('R$ 10,00');
      expect(formatCurrency(150)).toBe('R$ 1,50');
      expect(formatCurrency(99999)).toBe('R$ 999,99');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });

    it('should handle negative values', () => {
      expect(formatCurrency(-1000)).toBe('-R$ 10,00');
    });
  });
});
```

### Mocking External Dependencies

```typescript
// src/modules/brazil/__tests__/pix.service.spec.ts
import { PixService } from '../services/pix';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PixService', () => {
  let pixService: PixService;

  beforeEach(() => {
    pixService = new PixService();
  });

  it('should generate PIX QR code', async () => {
    // Arrange
    const mockResponse = {
      data: {
        txid: 'abc123',
        qrcode: 'data:image/png;base64,...',
        pixCopiaECola: '00020126...',
      },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    // Act
    const result = await pixService.generateQrCode('order_123', 5000);

    // Assert
    expect(result).toEqual({
      qrCode: mockResponse.data.qrcode,
      copyPaste: mockResponse.data.pixCopiaECola,
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/pix'),
      expect.objectContaining({
        valor: { original: '50.00' },
      }),
      expect.any(Object)
    );
  });

  it('should handle API errors gracefully', async () => {
    // Arrange
    mockedAxios.post.mockRejectedValue(new Error('API Error'));

    // Act & Assert
    await expect(
      pixService.generateQrCode('order_123', 5000)
    ).rejects.toThrow('Failed to generate PIX QR code');
  });
});
```

---

## Integration Testing

### Medusa Integration Tests

```typescript
// src/api/store/raffle/__tests__/purchase-ticket.spec.ts
import { setupTestServer } from '@medusajs/medusa/dist/utils';
import { Raffle } from '../../../../modules/raffle/models/raffle';

describe('POST /store/raffles/:id/purchase', () => {
  let testServer;
  let dbConnection;
  let testRaffle: Raffle;

  beforeAll(async () => {
    const setup = await setupTestServer();
    testServer = setup.server;
    dbConnection = setup.dbConnection;
  });

  afterAll(async () => {
    await dbConnection.close();
  });

  beforeEach(async () => {
    // Create test raffle
    testRaffle = await createTestRaffle({
      title: 'Integration Test Raffle',
      ticket_price: 1000,
      total_tickets: 100,
      draw_date: new Date('2025-12-31'),
    });
  });

  afterEach(async () => {
    // Clean up test data
    await cleanupTestData();
  });

  it('should successfully purchase raffle tickets', async () => {
    // Act
    const response = await testServer
      .post(`/store/raffles/${testRaffle.id}/purchase`)
      .send({ quantity: 5 })
      .expect(200);

    // Assert
    expect(response.body).toMatchObject({
      raffle: {
        id: testRaffle.id,
        tickets_sold: 5,
      },
      tickets: expect.arrayContaining([
        expect.objectContaining({
          raffle_id: testRaffle.id,
          customer_id: expect.any(String),
        }),
      ]),
    });

    // Verify database state
    const updatedRaffle = await dbConnection.manager.findOne(Raffle, {
      where: { id: testRaffle.id },
    });

    expect(updatedRaffle.tickets_sold).toBe(5);
  });

  it('should return 400 when purchasing more tickets than available', async () => {
    // Act
    const response = await testServer
      .post(`/store/raffles/${testRaffle.id}/purchase`)
      .send({ quantity: 150 }) // More than total_tickets (100)
      .expect(400);

    // Assert
    expect(response.body.message).toContain('Not enough tickets available');
  });

  it('should handle concurrent purchases correctly', async () => {
    // Act - Simulate 10 concurrent purchases of 10 tickets each
    const purchases = Array.from({ length: 10 }, () =>
      testServer
        .post(`/store/raffles/${testRaffle.id}/purchase`)
        .send({ quantity: 10 })
    );

    const results = await Promise.allSettled(purchases);

    // Assert - Exactly 10 purchases should succeed (100 total tickets)
    const successful = results.filter((r) => r.status === 'fulfilled');
    const failed = results.filter((r) => r.status === 'rejected');

    expect(successful.length).toBe(10);
    expect(failed.length).toBe(0);

    // Verify final state
    const finalRaffle = await dbConnection.manager.findOne(Raffle, {
      where: { id: testRaffle.id },
    });

    expect(finalRaffle.tickets_sold).toBe(100);
  });
});
```

### Testing Workflows

```typescript
// src/modules/raffle/__tests__/create-raffle.workflow.spec.ts
import { createRaffleWorkflow } from '../workflows/create-raffle';

describe('createRaffleWorkflow', () => {
  it('should execute all steps successfully', async () => {
    // Arrange
    const input = {
      title: 'Workflow Test Raffle',
      ticket_price: 1000,
      total_tickets: 100,
      draw_date: new Date('2025-12-31'),
      prize_description: 'Amazing prize',
    };

    // Act
    const result = await createRaffleWorkflow(container).run({ input });

    // Assert
    expect(result).toMatchObject({
      raffle: expect.objectContaining({
        id: expect.stringMatching(/^raffle_/),
        title: input.title,
        status: 'active',
      }),
      notifications_sent: true,
    });
  });

  it('should rollback on failure', async () => {
    // Arrange - Invalid data to trigger failure
    const input = {
      title: '',
      ticket_price: -100,
      total_tickets: 0,
      draw_date: new Date('2020-01-01'),
    };

    // Act & Assert
    await expect(
      createRaffleWorkflow(container).run({ input })
    ).rejects.toThrow();

    // Verify no raffle was created (rollback successful)
    const raffles = await raffleRepository.find();
    expect(raffles.length).toBe(0);
  });
});
```

---

## End-to-End Testing (Playwright)

### Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './storefront/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// storefront/__tests__/e2e/raffle-purchase.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Raffle Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test data
    await page.goto('/');
  });

  test('should complete full raffle purchase', async ({ page }) => {
    // Navigate to raffles page
    await page.goto('/rifas');

    // Verify raffles are displayed
    await expect(page.locator('h1')).toContainText('Rifas Ativas');

    // Click on first raffle
    await page.locator('[data-testid="raffle-card"]').first().click();

    // Verify raffle details page
    await expect(page.locator('[data-testid="raffle-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="ticket-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="tickets-available"]')).toBeVisible();

    // Select quantity
    await page.locator('[data-testid="quantity-input"]').fill('5');

    // Verify total price updates
    const totalPrice = await page.locator('[data-testid="total-price"]').textContent();
    expect(totalPrice).toContain('R$ 50,00');

    // Click purchase button
    await page.locator('[data-testid="purchase-button"]').click();

    // Login if not authenticated
    const loginVisible = await page.locator('[data-testid="login-form"]').isVisible();
    if (loginVisible) {
      await page.locator('[data-testid="email-input"]').fill('test@example.com');
      await page.locator('[data-testid="password-input"]').fill('Password123!');
      await page.locator('[data-testid="login-button"]').click();
    }

    // Wait for redirect to payment
    await page.waitForURL('**/checkout/**');

    // Verify order summary
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-total"]')).toContainText('R$ 50,00');

    // Select PIX payment
    await page.locator('[data-testid="payment-method-pix"]').click();

    // Confirm purchase
    await page.locator('[data-testid="confirm-purchase-button"]').click();

    // Wait for PIX QR code
    await expect(page.locator('[data-testid="pix-qrcode"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="pix-copy-paste"]')).toBeVisible();

    // Verify success message
    await expect(page.locator('[data-testid="purchase-success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="purchase-success-message"]')).toContainText(
      'Aguardando pagamento'
    );
  });

  test('should show error when purchasing too many tickets', async ({ page }) => {
    await page.goto('/rifas');

    await page.locator('[data-testid="raffle-card"]').first().click();

    // Try to purchase more than available
    await page.locator('[data-testid="quantity-input"]').fill('999');
    await page.locator('[data-testid="purchase-button"]').click();

    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'bilhetes disponíveis'
    );
  });

  test('should work on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/rifas');

    // Verify mobile layout
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();

    // Open mobile menu
    await page.locator('[data-testid="mobile-menu-button"]').click();
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Navigate via mobile menu
    await page.locator('[data-testid="mobile-menu-rifas"]').click();

    // Verify raffle card is visible on mobile
    await expect(page.locator('[data-testid="raffle-card"]').first()).toBeVisible();
  });
});
```

### Visual Regression Testing

```typescript
// storefront/__tests__/e2e/visual-regression.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('home page should match snapshot', async ({ page }) => {
    await page.goto('/');

    // Wait for images to load
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('raffle page should match snapshot', async ({ page }) => {
    await page.goto('/rifas');

    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('raffle-list.png', {
      fullPage: true,
    });
  });

  test('raffle card component should match snapshot', async ({ page }) => {
    await page.goto('/rifas');

    const raffleCard = page.locator('[data-testid="raffle-card"]').first();
    await expect(raffleCard).toHaveScreenshot('raffle-card.png');
  });
});
```

---

## Performance Testing

### Load Testing with k6

```javascript
// tests/load/raffle-purchase.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const failureRate = new Rate('failed_requests');

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    failed_requests: ['rate<0.1'],     // Error rate must be below 10%
  },
};

const BASE_URL = 'http://localhost:9000';

export default function () {
  // List raffles
  const listResponse = http.get(`${BASE_URL}/store/raffles`);

  check(listResponse, {
    'list raffles status 200': (r) => r.status === 200,
    'list raffles response time < 500ms': (r) => r.timings.duration < 500,
  });

  failureRate.add(listResponse.status !== 200);

  if (listResponse.status === 200) {
    const raffles = JSON.parse(listResponse.body).raffles;

    if (raffles.length > 0) {
      const raffleId = raffles[0].id;

      // Get raffle details
      const detailResponse = http.get(`${BASE_URL}/store/raffles/${raffleId}`);

      check(detailResponse, {
        'get raffle status 200': (r) => r.status === 200,
        'get raffle response time < 200ms': (r) => r.timings.duration < 200,
      });

      failureRate.add(detailResponse.status !== 200);
    }
  }

  sleep(1);
}
```

**Run load tests**:

```bash
# Install k6
brew install k6  # macOS
# or
choco install k6  # Windows

# Run test
k6 run tests/load/raffle-purchase.js

# With custom configuration
k6 run --vus 100 --duration 5m tests/load/raffle-purchase.js
```

### Performance Benchmarks

```typescript
// src/utils/__tests__/performance.spec.ts
describe('Performance Benchmarks', () => {
  it('should calculate raffle winner in under 100ms', async () => {
    const raffle = await createTestRaffle({ total_tickets: 10000 });

    const startTime = performance.now();
    const winner = await raffleService.selectWinner(raffle.id);
    const endTime = performance.now();

    const duration = endTime - startTime;

    expect(duration).toBeLessThan(100);
    expect(winner).toBeDefined();
  });

  it('should handle 100 concurrent ticket purchases', async () => {
    const raffle = await createTestRaffle({ total_tickets: 1000 });

    const purchases = Array.from({ length: 100 }, (_, i) =>
      raffleService.purchaseTicket(raffle.id, `customer_${i}`, 5)
    );

    const startTime = performance.now();
    await Promise.all(purchases);
    const endTime = performance.now();

    const duration = endTime - startTime;

    expect(duration).toBeLessThan(5000); // Should complete in under 5 seconds
  });
});
```

---

## Security Testing

### Automated Security Scanning

```bash
# npm audit
npm audit --production

# Fix vulnerabilities
npm audit fix

# Snyk scanning
npx snyk test

# OWASP Dependency Check
dependency-check --project "USE Nerd" --scan ./
```

### Security Test Cases

```typescript
// src/api/__tests__/security.spec.ts
describe('Security Tests', () => {
  describe('SQL Injection Prevention', () => {
    it('should prevent SQL injection in search', async () => {
      const maliciousInput = "'; DROP TABLE users; --";

      const response = await testServer
        .get('/store/products')
        .query({ q: maliciousInput })
        .expect(200);

      // Should return empty results, not error
      expect(response.body.products).toEqual([]);

      // Verify users table still exists
      const users = await dbConnection.query('SELECT COUNT(*) FROM users');
      expect(users).toBeDefined();
    });
  });

  describe('XSS Prevention', () => {
    it('should sanitize user input', async () => {
      const maliciousInput = '<script>alert("XSS")</script>';

      const response = await testServer
        .post('/store/contact')
        .send({ message: maliciousInput })
        .expect(200);

      // Verify script tags are escaped
      const savedMessage = await getMessage(response.body.id);
      expect(savedMessage.message).not.toContain('<script>');
      expect(savedMessage.message).toContain('&lt;script&gt;');
    });
  });

  describe('Authentication', () => {
    it('should require authentication for protected endpoints', async () => {
      await testServer
        .get('/store/customers/me')
        .expect(401);
    });

    it('should reject invalid JWT tokens', async () => {
      await testServer
        .get('/store/customers/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });

    it('should reject expired tokens', async () => {
      const expiredToken = generateExpiredToken();

      await testServer
        .get('/store/customers/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('Rate Limiting', () => {
    it('should rate limit after too many requests', async () => {
      // Make 101 requests (limit is 100 per 15 min)
      const requests = Array.from({ length: 101 }, () =>
        testServer.get('/store/products')
      );

      const results = await Promise.allSettled(requests);

      // Last request should be rate limited
      const lastResult = results[100];
      expect(lastResult.status).toBe('rejected');
    });
  });
});
```

---

## Manual Testing Checklist

### Pre-Release Testing Checklist

**Raffle Module**:
- [ ] Create new raffle as admin
- [ ] View active raffles on storefront
- [ ] Purchase tickets (various quantities)
- [ ] Verify inventory decrements correctly
- [ ] Test sold-out scenario
- [ ] Verify raffle draw execution
- [ ] Check winner selection
- [ ] Verify winner notification

**Payment Integration (PIX)**:
- [ ] Generate PIX QR code
- [ ] Verify QR code displays correctly
- [ ] Copy-paste PIX code works
- [ ] Webhook receives payment confirmation
- [ ] Order status updates on payment
- [ ] Timeout/expiration works

**Payment Integration (Mercado Pago)**:
- [ ] Credit card payment flow
- [ ] Installment options display
- [ ] Payment confirmation received
- [ ] Refund process works

**Shipping (Melhor Envio)**:
- [ ] Calculate shipping quote
- [ ] Multiple carrier options shown
- [ ] Correct prices displayed
- [ ] Address validation works

**User Authentication**:
- [ ] User registration
- [ ] Email verification
- [ ] Login/logout
- [ ] Password reset
- [ ] Session persistence

**Responsive Design**:
- [ ] Mobile (375px width)
- [ ] Tablet (768px width)
- [ ] Desktop (1920px width)
- [ ] Touch interactions on mobile

**Cross-Browser Compatibility**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

## CI/CD Testing Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit -- --coverage
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

  e2e-tests:
    runs-on: ubuntu-latest
    needs: integration-tests

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  security-scan:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        run: npm audit --production

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

## Test Data Management

### Test Data Factory

```typescript
// src/test-utils/factories.ts
import { Raffle } from '../modules/raffle/models/raffle';

export async function createTestRaffle(overrides?: Partial<Raffle>): Promise<Raffle> {
  const defaults = {
    title: 'Test Raffle',
    description: 'This is a test raffle',
    ticket_price: 1000,
    total_tickets: 100,
    tickets_sold: 0,
    draw_date: new Date('2025-12-31'),
    status: 'active' as const,
  };

  const raffleData = { ...defaults, ...overrides };

  return await raffleRepository.save(raffleRepository.create(raffleData));
}

export async function createTestCustomer(overrides?: any) {
  const defaults = {
    email: `test${Date.now()}@example.com`,
    first_name: 'Test',
    last_name: 'Customer',
    password_hash: await hashPassword('Password123!'),
  };

  const customerData = { ...defaults, ...overrides };

  return await customerRepository.save(customerRepository.create(customerData));
}
```

### Database Seeding for Tests

```typescript
// src/test-utils/seed.ts
export async function seedTestDatabase() {
  // Create test admin user
  await createTestUser({
    email: 'admin@test.com',
    role: 'admin',
  });

  // Create test customers
  for (let i = 0; i < 5; i++) {
    await createTestCustomer({
      email: `customer${i}@test.com`,
    });
  }

  // Create test raffles
  for (let i = 0; i < 3; i++) {
    await createTestRaffle({
      title: `Test Raffle ${i + 1}`,
      ticket_price: 1000 * (i + 1),
    });
  }
}

export async function cleanupTestDatabase() {
  await raffleTicketRepository.delete({});
  await raffleRepository.delete({});
  await orderRepository.delete({});
  await customerRepository.delete({});
  await userRepository.delete({});
}
```

---

## Português

### Sumário

1. [Filosofia de Testes](#filosofia-de-testes)
2. [Metas de Cobertura](#metas-de-cobertura)
3. [Testes Unitários (Jest)](#testes-unitários-jest)
4. [Testes de Integração](#testes-de-integração)
5. [Testes E2E (Playwright)](#testes-e2e-playwright)
6. [Testes de Performance](#testes-de-performance)
7. [Testes de Segurança](#testes-de-segurança)
8. [Checklist de Testes Manuais](#checklist-de-testes-manuais)
9. [Pipeline de Testes CI/CD](#pipeline-de-testes-cicd)

---

## Filosofia de Testes

### Pirâmide de Testes

```
           /\
          /  \
         / E2E \          ← Poucos (Fluxos críticos)
        /______\
       /        \
      /Integração \       ← Alguns (Endpoints API, workflows)
     /____________\
    /              \
   /Testes Unitários\     ← Muitos (Lógica de negócio, utilitários)
  /__________________\
```

**Princípio**: Mais testes unitários, menos testes de integração, ainda menos testes E2E.

---

## Metas de Cobertura

### Objetivos de Cobertura

| Tipo de Teste | Meta de Cobertura | Prioridade |
|--------------|------------------|-----------|
| **Testes Unitários** | 80% mínimo | Alta |
| **Caminhos Críticos** | 100% | Crítica |
| **Integração** | 70% | Média |
| **E2E** | Fluxos críticos | Alta |

### Caminhos Críticos Requerendo 100% de Cobertura

1. **Processamento de Pagamento**
   - Criação de pagamento PIX
   - Integração Mercado Pago
   - Processamento de webhook
   - Processamento de reembolso

2. **Sistema de Rifas**
   - Validação de compra de bilhetes
   - Controle de inventário
   - Execução de sorteio
   - Seleção de vencedor

3. **Gerenciamento de Pedidos**
   - Conversão de carrinho para pedido
   - Atualizações de estoque
   - Transições de status de pedido

4. **Autenticação**
   - Login/logout
   - Reset de senha
   - Refresh de token
   - Gerenciamento de sessão

---

## Testes Unitários (Jest)

### Estrutura de Teste (Padrão AAA)

```typescript
describe('RaffleService', () => {
  it('deve criar uma rifa com sucesso', async () => {
    // ============================================
    // ARRANGE - Configurar dados de teste
    // ============================================
    const dadosRifa = {
      titulo: 'Rifa de Verão 2025',
      descricao: 'Ganhe prêmios incríveis',
      preco_bilhete: 1000, // R$ 10,00 em centavos
      total_bilhetes: 100,
      data_sorteio: new Date('2025-12-31'),
    };

    // ============================================
    // ACT - Executar código em teste
    // ============================================
    const resultado = await raffleService.criar(dadosRifa);

    // ============================================
    // ASSERT - Verificar expectativas
    // ============================================
    expect(resultado).toEqual(expect.objectContaining(dadosRifa));
  });
});
```

---

## Checklist de Testes Manuais

### Checklist de Testes Pré-Lançamento

**Módulo de Rifas**:
- [ ] Criar nova rifa como admin
- [ ] Visualizar rifas ativas na loja
- [ ] Comprar bilhetes (várias quantidades)
- [ ] Verificar decremento correto do inventário
- [ ] Testar cenário de esgotado
- [ ] Verificar execução do sorteio
- [ ] Verificar seleção do vencedor
- [ ] Verificar notificação do vencedor

**Integração de Pagamento (PIX)**:
- [ ] Gerar QR code PIX
- [ ] Verificar exibição correta do QR code
- [ ] Copiar-colar código PIX funciona
- [ ] Webhook recebe confirmação de pagamento
- [ ] Status do pedido atualiza no pagamento
- [ ] Timeout/expiração funciona

**Autenticação de Usuário**:
- [ ] Registro de usuário
- [ ] Verificação de email
- [ ] Login/logout
- [ ] Reset de senha
- [ ] Persistência de sessão

**Design Responsivo**:
- [ ] Mobile (largura 375px)
- [ ] Tablet (largura 768px)
- [ ] Desktop (largura 1920px)
- [ ] Interações touch no mobile

**Compatibilidade entre Navegadores**:
- [ ] Chrome (mais recente)
- [ ] Firefox (mais recente)
- [ ] Safari (mais recente)
- [ ] Edge (mais recente)
- [ ] Safari Mobile
- [ ] Chrome Mobile

---

**Document Version**: 1.0
**Last Updated**: 2025-11-18
**Maintained By**: QA Team
**Contact**: qa@usenerd.com.br
