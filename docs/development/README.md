# Development Guide

[English](#english) | [Portugues](#portugues)

---

## English

### Getting Started

This guide will help you set up your development environment and understand the development workflow for USE Nerd.

### Prerequisites

- **Node.js** >= 20.x
- **npm** or **yarn**
- **PostgreSQL** 14+
- **Redis** 6+
- **Git**
- **VS Code** (recommended) or your preferred IDE

### Initial Setup

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd use-nerd
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Environment Variables

```bash
cp .env.template .env
```

Edit `.env` with your local configuration:

```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medusa_dev

# Redis
REDIS_URL=redis://localhost:6379

# CORS
STORE_CORS=http://localhost:8000
ADMIN_CORS=http://localhost:5173,http://localhost:9000
AUTH_CORS=http://localhost:5173,http://localhost:9000

# Secrets (use strong values in production)
JWT_SECRET=supersecret_dev_only
COOKIE_SECRET=supersecret_dev_only
```

#### 4. Set Up Database

```bash
# Create database (if not exists)
createdb medusa_dev

# Run migrations
npx medusa migrations run
```

#### 5. Seed Database (Optional)

```bash
npm run seed
```

#### 6. Start Development Server

```bash
npm run dev
```

The Medusa backend will be available at `http://localhost:9000`

---

## Development Workflow

### Daily Development

1. **Pull Latest Changes**
```bash
git checkout develop
git pull origin develop
```

2. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make Changes and Test**
```bash
# Run tests frequently
npm run test:unit

# Check types
npx tsc --noEmit
```

4. **Commit Changes**
```bash
git add .
git commit -m "feat(scope): your commit message"
```

5. **Push and Create PR**
```bash
git push origin feature/your-feature-name
# Create PR on GitHub
```

---

## Project Structure

```
use-nerd/
├── src/
│   ├── admin/                    # Admin UI customizations
│   │   ├── components/           # Custom React components
│   │   ├── routes/              # Custom admin routes
│   │   └── widgets/             # Dashboard widgets
│   │
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin API endpoints
│   │   │   └── custom/          # Custom admin routes
│   │   └── store/               # Store API endpoints
│   │       └── custom/          # Custom store routes
│   │
│   ├── modules/                 # Custom modules
│   │   ├── raffle/              # Raffle module (future)
│   │   └── blockchain/          # Blockchain module (future)
│   │
│   ├── workflows/               # Custom workflows
│   │   ├── raffle-purchase/     # Raffle purchase workflow
│   │   └── raffle-drawing/      # Drawing execution workflow
│   │
│   ├── subscribers/             # Event subscribers
│   │   ├── order.ts            # Order event handlers
│   │   └── raffle.ts           # Raffle event handlers
│   │
│   ├── jobs/                    # Background jobs
│   │   └── scheduled/           # Scheduled tasks
│   │
│   ├── links/                   # Module links
│   │
│   └── scripts/                 # Utility scripts
│       └── seed.ts             # Database seeding
│
├── integration-tests/           # Integration tests
│   ├── http/                    # HTTP API tests
│   └── modules/                 # Module tests
│
├── docs/                        # Documentation
│
├── medusa-config.ts            # Medusa configuration
├── tsconfig.json               # TypeScript config
└── jest.config.js              # Jest config
```

---

## Working with Modules

### Creating a Custom Module

1. **Create Module Directory**
```bash
mkdir -p src/modules/your-module
```

2. **Define Module Structure**
```typescript
// src/modules/your-module/index.ts
import { Module } from "@medusajs/framework/utils"
import YourModuleService from "./services/your-module"

export const YOUR_MODULE = "yourModule"

export default Module(YOUR_MODULE, {
  service: YourModuleService,
})
```

3. **Create Service**
```typescript
// src/modules/your-module/services/your-module.ts
import { MedusaService } from "@medusajs/framework/utils"
import YourModel from "../models/your-model"

class YourModuleService extends MedusaService({
  YourModel,
}) {
  async customMethod(data: any) {
    // Implementation
    return await this.yourModelRepository_.create(data)
  }
}

export default YourModuleService
```

4. **Define Models**
```typescript
// src/modules/your-module/models/your-model.ts
import { model } from "@medusajs/framework/utils"

const YourModel = model.define("your_model", {
  id: model.id().primaryKey(),
  name: model.text(),
  status: model.enum(["active", "inactive"]),
  created_at: model.dateTime().default("now()"),
  updated_at: model.dateTime().default("now()"),
})

export default YourModel
```

---

## Working with Workflows

### Creating a Workflow

```typescript
// src/workflows/your-workflow/index.ts
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { step1, step2, step3 } from "./steps"

type WorkflowInput = {
  data: string
}

export const yourWorkflow = createWorkflow(
  "your-workflow",
  (input: WorkflowInput) => {
    const result1 = step1(input)
    const result2 = step2(result1)
    const result3 = step3(result2)

    return new WorkflowResponse(result3)
  }
)
```

### Creating Workflow Steps

```typescript
// src/workflows/your-workflow/steps/step1.ts
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const step1 = createStep(
  "step-1",
  async (input: { data: string }) => {
    // Do something
    const result = processData(input.data)

    return new StepResponse(result, {
      // Compensation data for rollback
      originalData: input.data
    })
  },
  async (compensationData) => {
    // Compensation logic (rollback)
    if (compensationData) {
      await rollbackChanges(compensationData.originalData)
    }
  }
)
```

---

## Working with API Routes

### Creating Store API Route

```typescript
// src/api/store/custom-endpoint/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  // Access services via req.scope.resolve
  const yourService = req.scope.resolve("yourModuleService")

  const data = await yourService.list()

  res.json({ data })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const yourService = req.scope.resolve("yourModuleService")

  const result = await yourService.create(req.body)

  res.status(201).json({ data: result })
}
```

### Creating Admin API Route

```typescript
// src/api/admin/custom-endpoint/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { authenticate } from "@medusajs/framework/http"

export const GET = authenticate("admin")(
  async (req: MedusaRequest, res: MedusaResponse) => {
    // Only authenticated admins can access
    const yourService = req.scope.resolve("yourModuleService")

    const data = await yourService.list()

    res.json({ data })
  }
)
```

---

## Testing

### Unit Tests

```typescript
// src/modules/your-module/__tests__/your-service.spec.ts
import { createMedusaContainer } from "@medusajs/framework/utils"
import YourModuleService from "../services/your-module"

describe("YourModuleService", () => {
  let service: YourModuleService

  beforeEach(() => {
    const container = createMedusaContainer()
    service = new YourModuleService(container)
  })

  describe("customMethod", () => {
    it("should create entity successfully", async () => {
      const data = { name: "Test" }

      const result = await service.customMethod(data)

      expect(result).toBeDefined()
      expect(result.name).toBe("Test")
    })

    it("should throw error on invalid data", async () => {
      const invalidData = { name: "" }

      await expect(service.customMethod(invalidData))
        .rejects
        .toThrow("Name is required")
    })
  })
})
```

### Integration Tests

```typescript
// integration-tests/http/your-endpoint.spec.ts
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe("Custom Endpoint", () => {
      it("should return data", async () => {
        const response = await api.get("/store/custom-endpoint")

        expect(response.status).toBe(200)
        expect(response.data.data).toBeDefined()
      })

      it("should create entity", async () => {
        const payload = { name: "Test" }

        const response = await api.post("/admin/custom-endpoint", payload)

        expect(response.status).toBe(201)
        expect(response.data.data.name).toBe("Test")
      })
    })
  },
})
```

### Running Tests

```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration:http
npm run test:integration:modules

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.spec.ts

# Watch mode
npm test -- --watch
```

---

## Debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Medusa",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "program": "${workspaceFolder}/node_modules/jest/bin/jest",
      "args": ["--runInBand", "--no-cache"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Console Logging Best Practices

```typescript
// Use structured logging
import { Logger } from "@medusajs/framework/logger"

class YourService {
  protected logger_: Logger

  async someMethod(id: string) {
    this.logger_.info("Processing item", { id })

    try {
      const result = await this.process(id)
      this.logger_.info("Item processed successfully", { id, result })
      return result
    } catch (error) {
      this.logger_.error("Failed to process item", { id, error })
      throw error
    }
  }
}
```

---

## Database Migrations

### Creating a Migration

```bash
# Generate migration file
npx medusa migrations create AddYourTable
```

Edit the generated migration:

```typescript
// migrations/TIMESTAMP_AddYourTable.ts
import { MigrationInterface, QueryRunner } from "typeorm"

export class AddYourTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE your_table (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE your_table`)
  }
}
```

### Running Migrations

```bash
# Run pending migrations
npx medusa migrations run

# Revert last migration
npx medusa migrations revert
```

---

## Code Quality Tools

### TypeScript Type Checking

```bash
# Check types without emitting files
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

### Linting (if configured)

```bash
npm run lint
npm run lint:fix
```

### Formatting (if configured)

```bash
npm run format
```

---

## Common Issues & Solutions

### Issue: Database Connection Failed

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# Check connection string in .env
# Ensure DATABASE_URL is correct
```

### Issue: Redis Connection Failed

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# Should return "PONG"
```

### Issue: Port Already in Use

**Solution:**
```bash
# Find process using port 9000
lsof -i :9000

# Kill the process
kill -9 <PID>
```

### Issue: Migration Failed

**Solution:**
```bash
# Revert the migration
npx medusa migrations revert

# Fix the migration file
# Run again
npx medusa migrations run
```

---

## Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm start                      # Start production server

# Database
npx medusa migrations run      # Run migrations
npx medusa migrations revert   # Revert last migration
npm run seed                   # Seed database

# Testing
npm run test:unit              # Unit tests
npm run test:integration:http  # HTTP integration tests
npm test -- --coverage         # All tests with coverage

# Utilities
npx medusa exec ./src/scripts/your-script.ts  # Run script
```

---

## Portugues

### Introducao

Este guia ajudara voce a configurar seu ambiente de desenvolvimento e entender o fluxo de trabalho de desenvolvimento para USE Nerd.

### Pre-requisitos

- **Node.js** >= 20.x
- **npm** ou **yarn**
- **PostgreSQL** 14+
- **Redis** 6+
- **Git**
- **VS Code** (recomendado) ou sua IDE preferida

### Configuracao Inicial

Ver secao em Ingles acima para passos detalhados de configuracao.

### Fluxo de Trabalho de Desenvolvimento

Ver secao em Ingles acima para workflow diario de desenvolvimento.

### Estrutura do Projeto

Ver secao em Ingles acima para estrutura detalhada de diretorios.

### Comandos Uteis

```bash
# Desenvolvimento
npm run dev                    # Iniciar servidor dev
npm run build                  # Build para producao
npm start                      # Iniciar servidor producao

# Banco de Dados
npx medusa migrations run      # Executar migracoes
npm run seed                   # Popular banco de dados

# Testes
npm run test:unit              # Testes unitarios
npm test -- --coverage         # Todos os testes com cobertura
```
