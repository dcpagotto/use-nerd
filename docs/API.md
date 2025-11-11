# API Reference

[English](#english) | [Portugues](#portugues)

---

## English

### Overview

USE Nerd provides RESTful APIs for both storefront and admin operations. All endpoints follow REST conventions and return JSON responses.

**Base URLs:**
- Store API: `http://localhost:9000/store`
- Admin API: `http://localhost:9000/admin`

**Authentication:**
- Store API: JWT tokens (customer authentication)
- Admin API: JWT tokens (admin authentication)

**API Version:** 2.0 (Medusa v2.0)

### Common Response Formats

#### Success Response
```json
{
  "data": {
    "id": "raffle_123",
    "title": "Summer Raffle 2025"
  }
}
```

#### Error Response
```json
{
  "type": "invalid_data",
  "message": "Max entries must be a positive number",
  "code": "INVALID_RAFFLE_CONFIG"
}
```

#### Paginated Response
```json
{
  "data": [...],
  "count": 100,
  "offset": 0,
  "limit": 20
}
```

### Authentication

#### Customer Login
```http
POST /store/auth/token
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

#### Admin Login
```http
POST /admin/auth/token
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

### Store API Endpoints

#### Products

##### List Products
```http
GET /store/products?limit=20&offset=0
```

**Query Parameters:**
- `limit` (number): Results per page (default: 20)
- `offset` (number): Offset for pagination
- `category_id` (string): Filter by category
- `q` (string): Search query

**Response:**
```json
{
  "products": [
    {
      "id": "prod_123",
      "title": "Product Name",
      "description": "Product description",
      "variants": [...],
      "images": [...]
    }
  ],
  "count": 100,
  "offset": 0,
  "limit": 20
}
```

##### Get Product
```http
GET /store/products/:id
```

#### Cart

##### Create Cart
```http
POST /store/carts
Content-Type: application/json

{
  "region_id": "reg_br"
}
```

##### Add to Cart
```http
POST /store/carts/:id/line-items
Content-Type: application/json

{
  "variant_id": "variant_123",
  "quantity": 1
}
```

#### Orders

##### Create Order
```http
POST /store/orders
Content-Type: application/json

{
  "cart_id": "cart_123"
}
```

##### Get Order
```http
GET /store/orders/:id
Authorization: Bearer {token}
```

#### Raffles (Custom)

##### List Active Raffles
```http
GET /store/raffles?status=active
```

**Response:**
```json
{
  "raffles": [
    {
      "id": "raffle_123",
      "title": "Summer Raffle 2025",
      "description": "Win amazing prizes!",
      "status": "active",
      "start_date": "2025-06-01T00:00:00Z",
      "end_date": "2025-08-31T23:59:59Z",
      "max_entries": 10000,
      "current_entries": 2547,
      "ticket_price": 1000,
      "currency_code": "BRL",
      "prizes": [...]
    }
  ]
}
```

##### Get Raffle Details
```http
GET /store/raffles/:id
```

**Response:**
```json
{
  "raffle": {
    "id": "raffle_123",
    "title": "Summer Raffle 2025",
    "description": "Win amazing prizes!",
    "rules": "Complete raffle rules...",
    "status": "active",
    "start_date": "2025-06-01T00:00:00Z",
    "end_date": "2025-08-31T23:59:59Z",
    "drawing_date": "2025-09-05T20:00:00Z",
    "max_entries": 10000,
    "current_entries": 2547,
    "ticket_price": 1000,
    "currency_code": "BRL",
    "prizes": [
      {
        "id": "prize_1",
        "position": 1,
        "title": "Grand Prize",
        "description": "iPhone 15 Pro Max",
        "value": 800000
      }
    ],
    "blockchain_proof": {
      "contract_address": "0x...",
      "network": "polygon"
    }
  }
}
```

##### Purchase Raffle Tickets
```http
POST /store/raffle-entries
Authorization: Bearer {token}
Content-Type: application/json

{
  "raffle_id": "raffle_123",
  "quantity": 5,
  "payment_method_id": "pm_123"
}
```

**Response:**
```json
{
  "entries": [
    {
      "id": "entry_1",
      "raffle_id": "raffle_123",
      "customer_id": "cus_123",
      "ticket_number": "00042",
      "purchase_date": "2025-06-15T10:30:00Z"
    }
  ],
  "order": {
    "id": "order_456",
    "total": 5000,
    "status": "completed"
  }
}
```

##### Get My Raffle Entries
```http
GET /store/customers/me/raffle-entries
Authorization: Bearer {token}
```

**Response:**
```json
{
  "entries": [
    {
      "id": "entry_1",
      "raffle": {
        "id": "raffle_123",
        "title": "Summer Raffle 2025"
      },
      "ticket_number": "00042",
      "purchase_date": "2025-06-15T10:30:00Z",
      "is_winner": false
    }
  ]
}
```

### Admin API Endpoints

#### Raffles Management

##### List All Raffles
```http
GET /admin/raffles?status=active&limit=20
Authorization: Bearer {admin_token}
```

##### Create Raffle
```http
POST /admin/raffles
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Summer Raffle 2025",
  "description": "Win amazing prizes!",
  "rules": "Complete raffle rules...",
  "start_date": "2025-06-01T00:00:00Z",
  "end_date": "2025-08-31T23:59:59Z",
  "drawing_date": "2025-09-05T20:00:00Z",
  "max_entries": 10000,
  "ticket_price": 1000,
  "currency_code": "BRL",
  "prizes": [
    {
      "position": 1,
      "title": "Grand Prize",
      "description": "iPhone 15 Pro Max",
      "value": 800000
    }
  ]
}
```

**Response:**
```json
{
  "raffle": {
    "id": "raffle_123",
    "status": "draft",
    ...
  }
}
```

##### Update Raffle
```http
PUT /admin/raffles/:id
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Updated Title",
  "max_entries": 15000
}
```

##### Publish Raffle
```http
POST /admin/raffles/:id/publish
Authorization: Bearer {admin_token}
```

##### Execute Raffle Drawing
```http
POST /admin/raffles/:id/draw
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "use_blockchain": true,
  "verify_eligibility": true
}
```

**Response:**
```json
{
  "drawing": {
    "id": "drawing_123",
    "raffle_id": "raffle_123",
    "executed_at": "2025-09-05T20:05:32Z",
    "blockchain_tx": "0xabc123...",
    "winners": [
      {
        "position": 1,
        "customer_id": "cus_789",
        "ticket_number": "03847",
        "prize_id": "prize_1"
      }
    ]
  }
}
```

##### Get Raffle Analytics
```http
GET /admin/raffles/:id/analytics
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "analytics": {
    "total_entries": 8547,
    "total_revenue": 8547000,
    "unique_participants": 2134,
    "daily_entries": [...],
    "entry_distribution": {...}
  }
}
```

#### Blockchain Operations

##### Verify Drawing Proof
```http
POST /admin/blockchain/verify-drawing
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "drawing_id": "drawing_123",
  "transaction_hash": "0xabc123..."
}
```

##### Get Blockchain Status
```http
GET /admin/blockchain/status
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "network": "polygon",
  "connected": true,
  "latest_block": 45678901,
  "contract_address": "0x...",
  "gas_price": "30 gwei"
}
```

### Webhooks

#### Raffle Drawing Complete
```json
{
  "event": "raffle.drawing.complete",
  "data": {
    "raffle_id": "raffle_123",
    "drawing_id": "drawing_123",
    "winners": [...]
  },
  "timestamp": "2025-09-05T20:05:32Z"
}
```

#### Order Created
```json
{
  "event": "order.created",
  "data": {
    "order_id": "order_456",
    "customer_id": "cus_123",
    "total": 5000
  },
  "timestamp": "2025-06-15T10:30:00Z"
}
```

### Rate Limits

- Store API: 100 requests/minute per IP
- Admin API: 1000 requests/minute per token
- Blockchain operations: 10 requests/minute

### Error Codes

| Code | Description |
|------|-------------|
| `RAFFLE_NOT_FOUND` | Raffle does not exist |
| `RAFFLE_ENDED` | Raffle has already ended |
| `RAFFLE_NOT_ACTIVE` | Raffle is not currently active |
| `MAX_ENTRIES_REACHED` | Maximum entries limit reached |
| `INSUFFICIENT_TICKETS` | Not enough tickets available |
| `INVALID_PAYMENT` | Payment processing failed |
| `BLOCKCHAIN_ERROR` | Blockchain operation failed |
| `UNAUTHORIZED` | Invalid or missing authentication |

---

## Portugues

### Visao Geral

USE Nerd fornece APIs RESTful para operacoes de loja e administracao. Todos os endpoints seguem convencoes REST e retornam respostas JSON.

**URLs Base:**
- API Loja: `http://localhost:9000/store`
- API Admin: `http://localhost:9000/admin`

**Autenticacao:**
- API Loja: Tokens JWT (autenticacao de cliente)
- API Admin: Tokens JWT (autenticacao de admin)

**Versao da API:** 2.0 (Medusa v2.0)

### Formatos de Resposta Comuns

#### Resposta de Sucesso
```json
{
  "data": {
    "id": "raffle_123",
    "title": "Sorteio de Verao 2025"
  }
}
```

#### Resposta de Erro
```json
{
  "type": "invalid_data",
  "message": "Maximo de entradas deve ser um numero positivo",
  "code": "INVALID_RAFFLE_CONFIG"
}
```

#### Resposta Paginada
```json
{
  "data": [...],
  "count": 100,
  "offset": 0,
  "limit": 20
}
```

### Autenticacao

#### Login de Cliente
```http
POST /store/auth/token
Content-Type: application/json

{
  "email": "cliente@exemplo.com",
  "password": "senha_segura"
}
```

**Resposta:**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

#### Login de Admin
```http
POST /admin/auth/token
Content-Type: application/json

{
  "email": "admin@exemplo.com",
  "password": "senha_admin"
}
```

### Endpoints da API Loja

#### Produtos

##### Listar Produtos
```http
GET /store/products?limit=20&offset=0
```

**Parametros de Query:**
- `limit` (number): Resultados por pagina (padrao: 20)
- `offset` (number): Offset para paginacao
- `category_id` (string): Filtrar por categoria
- `q` (string): Query de busca

#### Carrinho

##### Criar Carrinho
```http
POST /store/carts
Content-Type: application/json

{
  "region_id": "reg_br"
}
```

##### Adicionar ao Carrinho
```http
POST /store/carts/:id/line-items
Content-Type: application/json

{
  "variant_id": "variant_123",
  "quantity": 1
}
```

#### Sorteios (Customizado)

##### Listar Sorteios Ativos
```http
GET /store/raffles?status=active
```

##### Comprar Tickets de Sorteio
```http
POST /store/raffle-entries
Authorization: Bearer {token}
Content-Type: application/json

{
  "raffle_id": "raffle_123",
  "quantity": 5,
  "payment_method_id": "pm_123"
}
```

##### Obter Minhas Entradas de Sorteio
```http
GET /store/customers/me/raffle-entries
Authorization: Bearer {token}
```

### Endpoints da API Admin

#### Gestao de Sorteios

##### Criar Sorteio
```http
POST /admin/raffles
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Sorteio de Verao 2025",
  "description": "Ganhe premios incriveis!",
  "start_date": "2025-06-01T00:00:00Z",
  "end_date": "2025-08-31T23:59:59Z",
  "max_entries": 10000,
  "ticket_price": 1000
}
```

##### Executar Sorteio
```http
POST /admin/raffles/:id/draw
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "use_blockchain": true,
  "verify_eligibility": true
}
```

### Limites de Taxa

- API Loja: 100 requisicoes/minuto por IP
- API Admin: 1000 requisicoes/minuto por token
- Operacoes blockchain: 10 requisicoes/minuto

### Codigos de Erro

| Codigo | Descricao |
|--------|-----------|
| `RAFFLE_NOT_FOUND` | Sorteio nao existe |
| `RAFFLE_ENDED` | Sorteio ja encerrado |
| `RAFFLE_NOT_ACTIVE` | Sorteio nao esta ativo |
| `MAX_ENTRIES_REACHED` | Limite maximo de entradas atingido |
| `INSUFFICIENT_TICKETS` | Tickets insuficientes |
| `INVALID_PAYMENT` | Falha no processamento de pagamento |
| `BLOCKCHAIN_ERROR` | Operacao blockchain falhou |
| `UNAUTHORIZED` | Autenticacao invalida ou ausente |
