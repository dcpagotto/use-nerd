# Architecture Overview

[English](#english) | [Portugues](#portugues)

---

## English

### System Overview

USE Nerd is built on Medusa v2.0, a modular commerce platform, extended with custom modules for blockchain integration and raffle mechanics. The architecture follows Domain-Driven Design (DDD) principles and clean architecture patterns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Presentation Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js     │  │  Admin UI    │  │  Mobile App  │      │
│  │  Storefront  │  │  (React)     │  │  (Future)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ REST API / GraphQL (Future)
                 │
┌────────────────▼────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Workflows   │  │  Subscribers │  │  Jobs        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                        Domain Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Commerce    │  │  Raffle      │  │  Blockchain  │      │
│  │  Modules     │  │  Module      │  │  Module      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    Infrastructure Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │  Redis       │  │  Polygon     │      │
│  │  Database    │  │  Cache       │  │  Network     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. Medusa Core Modules

Built-in commerce modules provided by Medusa v2.0:

- **Product Module**: Product catalog, variants, categories
- **Cart Module**: Shopping cart management
- **Order Module**: Order processing and fulfillment
- **Customer Module**: Customer accounts and authentication
- **Payment Module**: Payment processing integration
- **Region Module**: Multi-region support (Brazil focus)
- **Inventory Module**: Stock management

#### 2. Custom Modules

##### Raffle Module
- **Purpose**: Manage raffle campaigns, entries, and drawings
- **Responsibilities**:
  - Create and configure raffle campaigns
  - Handle user entries and ticket purchases
  - Manage raffle lifecycle (active, drawing, completed)
  - Store raffle results and winner information

- **Key Entities**:
  - `Raffle`: Campaign configuration and metadata
  - `RaffleEntry`: User participation records
  - `RaffleDrawing`: Drawing events and results
  - `RaffleWinner`: Winner records

##### Blockchain Module
- **Purpose**: Integrate with Polygon blockchain for verifiable randomness
- **Responsibilities**:
  - Generate provably fair random numbers
  - Store drawing proofs on-chain
  - Verify blockchain transactions
  - Manage smart contract interactions

- **Key Components**:
  - `BlockchainService`: Core blockchain interactions
  - `RandomnessProvider`: Chainlink VRF integration
  - `ProofValidator`: Verify on-chain proofs
  - `ContractManager`: Smart contract deployment and management

#### 3. Workflows

Workflows orchestrate complex business processes across modules:

- **RafflePurchaseWorkflow**: Handle raffle ticket purchase
  - Validate purchase
  - Create order
  - Generate raffle entries
  - Send confirmation

- **RaffleDrawingWorkflow**: Execute raffle drawing
  - Verify eligibility
  - Request blockchain randomness
  - Select winners
  - Update raffle status
  - Notify winners

- **OrderFulfillmentWorkflow**: Process order fulfillment
  - Standard e-commerce flow
  - Extended for raffle prizes

#### 4. Subscribers

Event-driven components that react to domain events:

- **OrderSubscriber**: React to order events
- **RaffleSubscriber**: Handle raffle lifecycle events
- **NotificationSubscriber**: Send emails/SMS
- **BlockchainSubscriber**: Monitor blockchain events

#### 5. API Layer

REST API endpoints organized by domain:

```
/store/
  /products          # Product catalog
  /cart              # Shopping cart
  /orders            # Order management
  /raffles           # Public raffle endpoints
  /raffle-entries    # User raffle participation

/admin/
  /products          # Product management
  /orders            # Order administration
  /raffles           # Raffle campaign management
  /blockchain        # Blockchain operations
  /analytics         # Business analytics
```

### Data Flow

#### Raffle Purchase Flow

```
User → Storefront → API → RafflePurchaseWorkflow
                              ↓
                         CartService
                              ↓
                         PaymentModule
                              ↓
                         OrderModule
                              ↓
                         RaffleModule
                              ↓
                         Database
                              ↓
                         OrderSubscriber → NotificationService
```

#### Raffle Drawing Flow

```
Admin → Admin UI → API → RaffleDrawingWorkflow
                              ↓
                         RaffleModule (validate)
                              ↓
                         BlockchainModule (request randomness)
                              ↓
                         Polygon Network (Chainlink VRF)
                              ↓
                         BlockchainSubscriber (receives callback)
                              ↓
                         RaffleModule (select winners)
                              ↓
                         Database (update results)
                              ↓
                         NotificationService (notify winners)
```

### Technology Decisions

See [Architecture Decision Records](./adr/README.md) for detailed rationale:

- [ADR-001: Use Medusa v2.0](./adr/001-medusa-v2.md)
- [ADR-002: Polygon for Blockchain](./adr/002-polygon-blockchain.md)
- [ADR-003: PostgreSQL Database](./adr/003-postgresql-database.md)
- [ADR-004: Module-based Architecture](./adr/004-module-architecture.md)

### Security Considerations

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (RBAC)
   - API key authentication for integrations

2. **Data Protection**
   - Encrypted sensitive data at rest
   - HTTPS/TLS for all communications
   - PII handling compliance (LGPD - Brazilian GDPR)

3. **Blockchain Security**
   - Private key management with HSM
   - Multi-signature wallets for critical operations
   - Rate limiting on blockchain calls
   - Gas price monitoring

4. **API Security**
   - Rate limiting
   - Input validation and sanitization
   - CORS configuration
   - SQL injection prevention (via ORM)

### Scalability Strategy

1. **Horizontal Scaling**
   - Stateless API servers
   - Load balancer distribution
   - Redis for session management

2. **Database Optimization**
   - Read replicas for reporting
   - Connection pooling
   - Query optimization and indexing
   - Partitioning for large tables

3. **Caching Strategy**
   - Redis for session and cache
   - API response caching
   - Static asset CDN

4. **Background Processing**
   - Queue-based job processing
   - Async workflows
   - Scheduled jobs for batch operations

### Monitoring & Observability

1. **Metrics**
   - Application performance metrics
   - Business metrics (orders, raffles, revenue)
   - Infrastructure metrics

2. **Logging**
   - Structured logging (JSON)
   - Log aggregation
   - Error tracking

3. **Tracing**
   - Distributed tracing for workflows
   - Transaction tracking
   - Blockchain transaction monitoring

### Future Architecture Enhancements

- GraphQL API alongside REST
- Event streaming with Kafka
- Microservices extraction for high-load modules
- Multi-region deployment
- Mobile app integration
- Real-time notifications via WebSocket

---

## Portugues

### Visao Geral do Sistema

USE Nerd e construido sobre Medusa v2.0, uma plataforma de comercio modular, estendida com modulos customizados para integracao blockchain e mecanicas de sorteio. A arquitetura segue principios de Domain-Driven Design (DDD) e padroes de arquitetura limpa.

### Arquitetura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                      Camada de Apresentacao                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Next.js     │  │  Admin UI    │  │  App Mobile  │      │
│  │  Storefront  │  │  (React)     │  │  (Futuro)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ REST API / GraphQL (Futuro)
                 │
┌────────────────▼────────────────────────────────────────────┐
│                      Camada de Aplicacao                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Workflows   │  │  Subscribers │  │  Jobs        │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                       Camada de Dominio                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Modulos     │  │  Modulo      │  │  Modulo      │      │
│  │  Comercio    │  │  Sorteio     │  │  Blockchain  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│                   Camada de Infraestrutura                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │  Redis       │  │  Polygon     │      │
│  │  Database    │  │  Cache       │  │  Network     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Principais

#### 1. Modulos Core do Medusa

Modulos de comercio integrados fornecidos pelo Medusa v2.0:

- **Modulo de Produto**: Catalogo de produtos, variantes, categorias
- **Modulo de Carrinho**: Gestao de carrinho de compras
- **Modulo de Pedido**: Processamento e fulfillment de pedidos
- **Modulo de Cliente**: Contas de cliente e autenticacao
- **Modulo de Pagamento**: Integracao de processamento de pagamentos
- **Modulo de Regiao**: Suporte multi-regiao (foco Brasil)
- **Modulo de Inventario**: Gestao de estoque

#### 2. Modulos Customizados

##### Modulo de Sorteio
- **Proposito**: Gerenciar campanhas de sorteio, entradas e sorteios
- **Responsabilidades**:
  - Criar e configurar campanhas de sorteio
  - Gerenciar entradas de usuario e compra de tickets
  - Gerenciar ciclo de vida do sorteio (ativo, sorteando, completo)
  - Armazenar resultados e informacoes de vencedores

- **Entidades Principais**:
  - `Raffle`: Configuracao e metadados da campanha
  - `RaffleEntry`: Registros de participacao do usuario
  - `RaffleDrawing`: Eventos de sorteio e resultados
  - `RaffleWinner`: Registros de vencedores

##### Modulo Blockchain
- **Proposito**: Integrar com blockchain Polygon para aleatoriedade verificavel
- **Responsabilidades**:
  - Gerar numeros aleatorios proveravelmente justos
  - Armazenar provas de sorteio on-chain
  - Verificar transacoes blockchain
  - Gerenciar interacoes com smart contracts

- **Componentes Principais**:
  - `BlockchainService`: Interacoes core com blockchain
  - `RandomnessProvider`: Integracao Chainlink VRF
  - `ProofValidator`: Verificar provas on-chain
  - `ContractManager`: Deploy e gestao de smart contracts

#### 3. Workflows

Workflows orquestram processos de negocio complexos entre modulos:

- **RafflePurchaseWorkflow**: Lidar com compra de ticket de sorteio
  - Validar compra
  - Criar pedido
  - Gerar entradas de sorteio
  - Enviar confirmacao

- **RaffleDrawingWorkflow**: Executar sorteio
  - Verificar elegibilidade
  - Solicitar aleatoriedade blockchain
  - Selecionar vencedores
  - Atualizar status do sorteio
  - Notificar vencedores

- **OrderFulfillmentWorkflow**: Processar fulfillment de pedidos
  - Fluxo padrao e-commerce
  - Estendido para premios de sorteio

#### 4. Subscribers

Componentes orientados a eventos que reagem a eventos de dominio:

- **OrderSubscriber**: Reagir a eventos de pedido
- **RaffleSubscriber**: Lidar com eventos de ciclo de vida do sorteio
- **NotificationSubscriber**: Enviar emails/SMS
- **BlockchainSubscriber**: Monitorar eventos blockchain

#### 5. Camada de API

Endpoints REST API organizados por dominio:

```
/store/
  /products          # Catalogo de produtos
  /cart              # Carrinho de compras
  /orders            # Gestao de pedidos
  /raffles           # Endpoints publicos de sorteio
  /raffle-entries    # Participacao em sorteio do usuario

/admin/
  /products          # Gestao de produtos
  /orders            # Administracao de pedidos
  /raffles           # Gestao de campanhas de sorteio
  /blockchain        # Operacoes blockchain
  /analytics         # Analytics de negocio
```

### Fluxo de Dados

#### Fluxo de Compra de Sorteio

```
Usuario → Storefront → API → RafflePurchaseWorkflow
                                  ↓
                             CartService
                                  ↓
                             PaymentModule
                                  ↓
                             OrderModule
                                  ↓
                             RaffleModule
                                  ↓
                             Database
                                  ↓
                             OrderSubscriber → NotificationService
```

#### Fluxo de Execucao de Sorteio

```
Admin → Admin UI → API → RaffleDrawingWorkflow
                              ↓
                         RaffleModule (validar)
                              ↓
                         BlockchainModule (solicitar aleatoriedade)
                              ↓
                         Polygon Network (Chainlink VRF)
                              ↓
                         BlockchainSubscriber (recebe callback)
                              ↓
                         RaffleModule (selecionar vencedores)
                              ↓
                         Database (atualizar resultados)
                              ↓
                         NotificationService (notificar vencedores)
```

### Decisoes Tecnologicas

Veja [Registros de Decisao de Arquitetura](./adr/README.md) para justificativa detalhada:

- [ADR-001: Usar Medusa v2.0](./adr/001-medusa-v2.md)
- [ADR-002: Polygon para Blockchain](./adr/002-polygon-blockchain.md)
- [ADR-003: Banco de Dados PostgreSQL](./adr/003-postgresql-database.md)
- [ADR-004: Arquitetura Baseada em Modulos](./adr/004-module-architecture.md)

### Consideracoes de Seguranca

1. **Autenticacao & Autorizacao**
   - Autenticacao baseada em JWT
   - Controle de acesso baseado em funcoes (RBAC)
   - Autenticacao via API key para integracoes

2. **Protecao de Dados**
   - Dados sensiveis criptografados em repouso
   - HTTPS/TLS para todas comunicacoes
   - Conformidade com tratamento de PII (LGPD)

3. **Seguranca Blockchain**
   - Gestao de chaves privadas com HSM
   - Wallets multi-assinatura para operacoes criticas
   - Rate limiting em chamadas blockchain
   - Monitoramento de preco de gas

4. **Seguranca da API**
   - Rate limiting
   - Validacao e sanitizacao de input
   - Configuracao CORS
   - Prevencao de SQL injection (via ORM)

### Estrategia de Escalabilidade

1. **Escalabilidade Horizontal**
   - Servidores API stateless
   - Distribuicao via load balancer
   - Redis para gestao de sessao

2. **Otimizacao de Banco de Dados**
   - Read replicas para reporting
   - Connection pooling
   - Otimizacao de queries e indexacao
   - Particao para tabelas grandes

3. **Estrategia de Cache**
   - Redis para sessao e cache
   - Cache de resposta de API
   - CDN para assets estaticos

4. **Processamento em Background**
   - Processamento de jobs baseado em fila
   - Workflows assincronos
   - Jobs agendados para operacoes em lote

### Monitoramento & Observabilidade

1. **Metricas**
   - Metricas de performance da aplicacao
   - Metricas de negocio (pedidos, sorteios, receita)
   - Metricas de infraestrutura

2. **Logging**
   - Logging estruturado (JSON)
   - Agregacao de logs
   - Rastreamento de erros

3. **Tracing**
   - Tracing distribuido para workflows
   - Rastreamento de transacoes
   - Monitoramento de transacoes blockchain

### Melhorias Futuras de Arquitetura

- API GraphQL junto com REST
- Event streaming com Kafka
- Extracao de microservicos para modulos de alta carga
- Deploy multi-regiao
- Integracao com app mobile
- Notificacoes em tempo real via WebSocket
