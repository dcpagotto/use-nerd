# 🎟️ Raffle Module - API Design Specification

**Versão**: 1.0
**Data**: 2025-11-11
**Status**: Design Phase
**Blockchain**: Polygon (MATIC)

---

## 📋 Visão Geral

O módulo Raffle implementa um sistema de rifas transparente e verificável usando blockchain Polygon. Cada rifa tem tickets que são vendidos como produtos normais do Medusa, mas com lógica especial de sorteio via smart contracts.

### Características Principais
- ✅ Rifas com múltiplos tickets
- ✅ Sorteio verificável via Chainlink VRF
- ✅ Tickets como NFTs (ERC-721)
- ✅ Transparência total na blockchain
- ✅ Integração nativa com carrinho Medusa
- ✅ Dashboard admin para gestão

---

## 🗂️ Modelos de Dados

### 1. Raffle (Rifa)

```typescript
interface Raffle {
  id: string;                          // UUID
  title: string;                       // "Rifa iPhone 15 Pro"
  description: string;                 // Descrição completa
  prize_description: string;           // "iPhone 15 Pro Max 256GB"

  // Configuração
  total_tickets: number;               // Ex: 1000 tickets
  ticket_price: number;                // Preço em centavos (BRL)
  max_tickets_per_customer: number;    // Limite por cliente (0 = sem limite)

  // Datas
  start_date: Date;                    // Início das vendas
  end_date: Date;                      // Fim das vendas
  draw_date: Date;                     // Data do sorteio

  // Status
  status: RaffleStatus;                // draft, active, sold_out, drawing, completed, cancelled

  // Blockchain
  contract_address?: string;           // Endereço do contrato na Polygon
  transaction_hash?: string;           // TX de criação
  chainlink_request_id?: string;       // ID da requisição VRF

  // Vencedor
  winner_ticket_number?: number;       // Número do ticket vencedor
  winner_customer_id?: string;         // ID do cliente vencedor
  winner_wallet_address?: string;      // Endereço da carteira
  winner_drawn_at?: Date;              // Data/hora do sorteio

  // Metadata
  image_url?: string;                  // Imagem da rifa
  terms_and_conditions?: string;       // Regulamento
  metadata?: Record<string, any>;      // Dados extras

  // Relações
  product_id?: string;                 // Produto Medusa associado
  tickets?: RaffleTicket[];            // Tickets vendidos

  // Timestamps
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

enum RaffleStatus {
  DRAFT = "draft",                     // Rascunho, não visível
  ACTIVE = "active",                   // Vendas abertas
  SOLD_OUT = "sold_out",               // Todos tickets vendidos
  DRAWING = "drawing",                 // Sorteio em andamento
  COMPLETED = "completed",             // Sorteio realizado
  CANCELLED = "cancelled"              // Cancelada
}
```

### 2. RaffleTicket (Ticket de Rifa)

```typescript
interface RaffleTicket {
  id: string;                          // UUID
  raffle_id: string;                   // Rifa associada

  // Identificação
  ticket_number: number;               // Número sequencial (1-1000)
  ticket_code: string;                 // Código único "RF2024-0001"

  // Comprador
  customer_id: string;                 // Cliente que comprou
  order_id: string;                    // Pedido Medusa
  line_item_id: string;                // Item do pedido

  // NFT
  nft_token_id?: string;               // ID do token NFT
  nft_transaction_hash?: string;       // TX de mint do NFT
  nft_metadata_uri?: string;           // URI do metadata IPFS

  // Status
  status: TicketStatus;                // reserved, paid, minted, winner
  is_winner: boolean;                  // Flag de vencedor

  // Pagamento
  paid_at?: Date;                      // Data do pagamento
  price_paid: number;                  // Valor pago (centavos)

  // Timestamps
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  // Relações
  raffle?: Raffle;
  customer?: Customer;
  order?: Order;
}

enum TicketStatus {
  RESERVED = "reserved",               // Reservado (carrinho)
  PAID = "paid",                       // Pago, aguardando mint
  MINTED = "minted",                   // NFT criado
  WINNER = "winner"                    // Ticket vencedor
}
```

### 3. RaffleDraw (Sorteio)

```typescript
interface RaffleDraw {
  id: string;                          // UUID
  raffle_id: string;                   // Rifa sorteada

  // Chainlink VRF
  vrf_request_id: string;              // ID da requisição
  vrf_random_words: string[];          // Números aleatórios retornados
  vrf_transaction_hash: string;        // TX da requisição

  // Resultado
  winner_ticket_number: number;        // Número sorteado
  winner_ticket_id: string;            // ID do ticket vencedor
  winner_customer_id: string;          // Cliente vencedor

  // Status
  status: DrawStatus;                  // requested, pending, completed, failed

  // Metadata
  drawn_at: Date;                      // Data/hora do sorteio
  executed_by: string;                 // User que executou (admin)
  metadata?: Record<string, any>;

  // Timestamps
  created_at: Date;
  updated_at: Date;

  // Relações
  raffle?: Raffle;
  winner_ticket?: RaffleTicket;
}

enum DrawStatus {
  REQUESTED = "requested",             // Solicitado ao Chainlink
  PENDING = "pending",                 // Aguardando resposta
  COMPLETED = "completed",             // Sorteio finalizado
  FAILED = "failed"                    // Erro no sorteio
}
```

---

## 🔌 API Endpoints

### Store API (Cliente)

#### 1. Listar Rifas Ativas
```http
GET /store/raffles
```

**Query Parameters:**
- `limit` (number): Quantidade de resultados (default: 20)
- `offset` (number): Offset para paginação
- `status` (string): Filtrar por status (active, sold_out)
- `sort` (string): Ordenação (created_at, draw_date, -ticket_price)

**Response 200:**
```json
{
  "raffles": [
    {
      "id": "raffle_01HXXX",
      "title": "Rifa iPhone 15 Pro",
      "prize_description": "iPhone 15 Pro Max 256GB Space Black",
      "total_tickets": 1000,
      "tickets_sold": 450,
      "ticket_price": 5000,
      "currency_code": "brl",
      "start_date": "2025-11-01T00:00:00Z",
      "end_date": "2025-11-30T23:59:59Z",
      "draw_date": "2025-12-01T20:00:00Z",
      "status": "active",
      "image_url": "https://...",
      "product_id": "prod_01HYYY"
    }
  ],
  "count": 1,
  "offset": 0,
  "limit": 20
}
```

#### 2. Obter Detalhes da Rifa
```http
GET /store/raffles/:id
```

**Response 200:**
```json
{
  "raffle": {
    "id": "raffle_01HXXX",
    "title": "Rifa iPhone 15 Pro",
    "description": "Concorra a um iPhone 15 Pro...",
    "prize_description": "iPhone 15 Pro Max 256GB",
    "total_tickets": 1000,
    "tickets_sold": 450,
    "tickets_available": 550,
    "ticket_price": 5000,
    "currency_code": "brl",
    "max_tickets_per_customer": 10,
    "start_date": "2025-11-01T00:00:00Z",
    "end_date": "2025-11-30T23:59:59Z",
    "draw_date": "2025-12-01T20:00:00Z",
    "status": "active",
    "image_url": "https://...",
    "terms_and_conditions": "...",
    "product_id": "prod_01HYYY",
    "contract_address": "0x123...",
    "recent_tickets": [
      {
        "ticket_number": 445,
        "customer_name": "João S.",
        "created_at": "2025-11-10T15:30:00Z"
      }
    ]
  }
}
```

#### 3. Meus Tickets
```http
GET /store/raffles/me/tickets
```

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `raffle_id` (string): Filtrar por rifa específica
- `status` (string): Filtrar por status

**Response 200:**
```json
{
  "tickets": [
    {
      "id": "ticket_01HZZZ",
      "raffle_id": "raffle_01HXXX",
      "ticket_number": 123,
      "ticket_code": "RF2024-0123",
      "status": "minted",
      "is_winner": false,
      "paid_at": "2025-11-10T14:00:00Z",
      "nft_token_id": "456",
      "nft_transaction_hash": "0xabc...",
      "raffle": {
        "title": "Rifa iPhone 15 Pro",
        "draw_date": "2025-12-01T20:00:00Z",
        "status": "active"
      }
    }
  ],
  "count": 5
}
```

#### 4. Adicionar Ticket ao Carrinho
```http
POST /store/carts/:cart_id/line-items
```

**Body:**
```json
{
  "variant_id": "variant_01HXXX",
  "quantity": 3,
  "metadata": {
    "raffle_id": "raffle_01HXXX",
    "raffle_ticket": true
  }
}
```

**Response 200:** (Carrinho Medusa padrão)

---

### Admin API

#### 1. Listar Todas as Rifas
```http
GET /admin/raffles
```

**Query Parameters:**
- `limit`, `offset`, `status`, `sort`

**Response 200:**
```json
{
  "raffles": [...],
  "count": 10
}
```

#### 2. Criar Rifa
```http
POST /admin/raffles
```

**Body:**
```json
{
  "title": "Rifa iPhone 15 Pro",
  "description": "Concorra a um iPhone...",
  "prize_description": "iPhone 15 Pro Max 256GB",
  "total_tickets": 1000,
  "ticket_price": 5000,
  "max_tickets_per_customer": 10,
  "start_date": "2025-11-01T00:00:00Z",
  "end_date": "2025-11-30T23:59:59Z",
  "draw_date": "2025-12-01T20:00:00Z",
  "image_url": "https://...",
  "terms_and_conditions": "...",
  "product_id": "prod_01HYYY",
  "status": "draft"
}
```

**Response 200:**
```json
{
  "raffle": { /* raffle object */ }
}
```

#### 3. Atualizar Rifa
```http
POST /admin/raffles/:id
```

**Body:** (campos para atualizar)

#### 4. Publicar Rifa (Draft → Active)
```http
POST /admin/raffles/:id/publish
```

**Response 200:**
```json
{
  "raffle": {
    "id": "raffle_01HXXX",
    "status": "active",
    "contract_address": "0x123...",
    "transaction_hash": "0xdef..."
  }
}
```

#### 5. Executar Sorteio
```http
POST /admin/raffles/:id/draw
```

**Response 200:**
```json
{
  "draw": {
    "id": "draw_01HZZZ",
    "raffle_id": "raffle_01HXXX",
    "status": "requested",
    "vrf_request_id": "123",
    "vrf_transaction_hash": "0xabc..."
  }
}
```

#### 6. Dashboard de Rifa
```http
GET /admin/raffles/:id/dashboard
```

**Response 200:**
```json
{
  "raffle": { /* raffle object */ },
  "stats": {
    "total_tickets": 1000,
    "tickets_sold": 850,
    "tickets_available": 150,
    "total_revenue": 425000,
    "unique_customers": 320,
    "average_tickets_per_customer": 2.66,
    "sales_by_day": [
      { "date": "2025-11-01", "tickets": 50, "revenue": 25000 }
    ]
  },
  "recent_tickets": [ /* últimos 10 tickets */ ],
  "top_customers": [
    { "customer_id": "cus_01", "name": "João Silva", "tickets": 10 }
  ]
}
```

---

## 🔄 Workflows

### 1. createRaffleWorkflow
**Trigger:** Admin cria nova rifa
**Steps:**
1. Validar dados da rifa
2. Criar registro no banco
3. Criar produto Medusa associado (se não existir)
4. Deploy smart contract (se status = active)
5. Retornar rifa criada

### 2. publishRaffleWorkflow
**Trigger:** Admin publica rifa (draft → active)
**Steps:**
1. Validar que rifa está em draft
2. Deploy smart contract na Polygon
3. Aguardar confirmação da transação
4. Atualizar status para active
5. Disparar evento raffle.published

### 3. purchaseRaffleTicketsWorkflow
**Trigger:** Cliente completa pagamento de pedido com tickets
**Steps:**
1. Identificar line items que são tickets de rifa
2. Para cada ticket:
   - Gerar número sequencial
   - Gerar código único
   - Criar registro RaffleTicket
   - Reservar número na blockchain
3. Agendar mint de NFTs (job assíncrono)
4. Disparar evento raffle.tickets_purchased

### 4. mintTicketNFTsWorkflow
**Trigger:** Job assíncrono após compra
**Steps:**
1. Para cada ticket pago não mintado:
   - Criar metadata JSON (IPFS)
   - Chamar smart contract para mint
   - Aguardar confirmação
   - Atualizar ticket com nft_token_id e transaction_hash
2. Disparar evento raffle.tickets_minted

### 5. executeRaffleDrawWorkflow
**Trigger:** Admin executa sorteio
**Steps:**
1. Validar que rifa está sold_out ou end_date passou
2. Atualizar status para drawing
3. Solicitar número aleatório ao Chainlink VRF
4. Criar registro RaffleDraw
5. Aguardar callback do Chainlink (webhook)
6. Calcular ticket vencedor (random % total_tickets)
7. Atualizar rifa com vencedor
8. Atualizar ticket vencedor (is_winner = true, status = winner)
9. Atualizar status para completed
10. Disparar eventos raffle.draw_completed e raffle.winner_announced

### 6. cancelRaffleWorkflow
**Trigger:** Admin cancela rifa
**Steps:**
1. Validar que rifa pode ser cancelada
2. Processar reembolso de todos os tickets
3. Atualizar status para cancelled
4. Pausar smart contract
5. Disparar evento raffle.cancelled

---

## 📡 Eventos (Subscribers)

### Eventos do Módulo Raffle

```typescript
// Rifa criada
raffle.created
{ raffle_id, status: "draft" }

// Rifa publicada (ativada)
raffle.published
{ raffle_id, contract_address, transaction_hash }

// Tickets comprados
raffle.tickets_purchased
{ raffle_id, ticket_ids, customer_id, quantity }

// NFTs mintados
raffle.tickets_minted
{ raffle_id, ticket_ids, nft_token_ids }

// Sorteio iniciado
raffle.draw_started
{ raffle_id, draw_id, vrf_request_id }

// Sorteio completado
raffle.draw_completed
{ raffle_id, draw_id, winner_ticket_id }

// Vencedor anunciado
raffle.winner_announced
{ raffle_id, winner_ticket_id, winner_customer_id }

// Rifa cancelada
raffle.cancelled
{ raffle_id, refund_count }
```

### Subscribers de Integração

```typescript
// Escutar order.placed do Medusa
subscriber: handleOrderPlaced
- Verifica se tem tickets de rifa no pedido
- Dispara purchaseRaffleTicketsWorkflow

// Escutar order.payment_captured
subscriber: handlePaymentCaptured
- Atualiza tickets para status "paid"
- Agenda mint de NFTs

// Escutar raffle.winner_announced
subscriber: notifyWinner
- Envia email para o vencedor
- Cria notificação no sistema
```

---

## 🔐 Validações & Regras de Negócio

### Validações de Rifa
- ✅ `total_tickets` deve ser > 0 e <= 100000
- ✅ `ticket_price` deve ser > 0
- ✅ `end_date` deve ser >= `start_date`
- ✅ `draw_date` deve ser >= `end_date`
- ✅ Não pode publicar rifa sem produto associado
- ✅ Não pode editar rifa após publicação (apenas alguns campos)

### Validações de Compra
- ✅ Cliente não pode comprar mais que `max_tickets_per_customer`
- ✅ Não pode comprar tickets de rifa inativa/cancelada
- ✅ Não pode comprar mais tickets que disponíveis
- ✅ Validar estoque de tickets em tempo real (race condition)

### Validações de Sorteio
- ✅ Só pode sortear rifa com status active ou sold_out
- ✅ Deve ter pelo menos 1 ticket vendido
- ✅ Não pode sortear antes da draw_date (ou deve ter aprovação admin)
- ✅ Não pode sortear rifa já sorteada

---

## 📊 Integrações

### Blockchain (Polygon)
- **Smart Contract**: RaffleSystem.sol
- **Funções**:
  - `createRaffle(totalTickets)`: Cria nova rifa
  - `purchaseTickets(raffleId, quantity)`: Compra tickets
  - `mintTicketNFT(ticketId, metadata)`: Mint NFT
  - `requestRandomness(raffleId)`: Solicita VRF
  - `fulfillRandomness(requestId, randomWords)`: Callback VRF

### Chainlink VRF
- **Rede**: Polygon Mumbai (testnet) / Polygon Mainnet
- **Coordinator**: (endereço configurado em .env)
- **Subscription**: Gerenciada pelo admin

### IPFS (Metadata NFT)
- **Provider**: Pinata ou similar
- **Formato**:
```json
{
  "name": "USE Nerd Raffle Ticket #123",
  "description": "Ticket para Rifa iPhone 15 Pro",
  "image": "https://...",
  "attributes": [
    { "trait_type": "Raffle", "value": "iPhone 15 Pro" },
    { "trait_type": "Ticket Number", "value": 123 },
    { "trait_type": "Purchase Date", "value": "2025-11-10" }
  ]
}
```

---

## 🚀 Próximos Passos

1. ✅ Design aprovado
2. ⏳ Criar estrutura de pastas do módulo
3. ⏳ Implementar modelos (data models)
4. ⏳ Implementar serviços (business logic)
5. ⏳ Implementar workflows
6. ⏳ Criar rotas API
7. ⏳ Desenvolver smart contracts
8. ⏳ Testes unitários e integração
9. ⏳ Documentação final

---

**Notas:**
- Este design segue 100% os padrões do Medusa v2.0
- Todos os endpoints seguem convenções REST
- Workflows seguem o padrão de orquestração do Medusa
- Eventos permitem extensibilidade futura
