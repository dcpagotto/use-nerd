# 🔄 Fluxo Completo do Sistema de Rifas

## Visão Geral

Este documento descreve o fluxo end-to-end de uma rifa, desde a criação até o anúncio do vencedor.

---

## 📋 Fluxo 1: Criação e Publicação de Rifa

```mermaid
sequenceDiagram
    participant Admin
    participant API
    participant createRaffleWorkflow
    participant RaffleService
    participant publishRaffleWorkflow
    participant Blockchain

    Admin->>API: POST /admin/raffles
    API->>createRaffleWorkflow: Executar workflow
    createRaffleWorkflow->>RaffleService: createRaffle()
    RaffleService-->>createRaffleWorkflow: Rifa (status: draft)
    createRaffleWorkflow-->>API: Rifa criada
    API-->>Admin: 201 Created

    Admin->>API: POST /admin/raffles/:id/publish
    API->>publishRaffleWorkflow: Executar workflow
    publishRaffleWorkflow->>Blockchain: Deploy smart contract
    Blockchain-->>publishRaffleWorkflow: contract_address + tx_hash
    publishRaffleWorkflow->>RaffleService: publishRaffle()
    RaffleService->>RaffleService: Atualizar (status: active)
    RaffleService->>EventBus: raffle.published
    publishRaffleWorkflow-->>API: Rifa publicada
    API-->>Admin: 200 OK
```

**Steps**:
1. Admin cria rifa via API (status: draft)
2. Admin publica rifa
3. Workflow faz deploy na Polygon
4. Rifa fica disponível para compra (status: active)

---

## 🛒 Fluxo 2: Compra de Tickets

```mermaid
sequenceDiagram
    participant Cliente
    participant Storefront
    participant Medusa Cart
    participant Checkout
    participant handleOrderPlaced
    participant purchaseTicketsWorkflow
    participant RaffleTicketService
    participant handlePaymentCaptured
    participant mintNFTsWorkflow

    Cliente->>Storefront: Adicionar tickets ao carrinho
    Storefront->>Medusa Cart: POST /store/carts/:id/line-items
    Medusa Cart-->>Cliente: Carrinho atualizado

    Cliente->>Checkout: Finalizar pedido
    Checkout->>Medusa: Criar order
    Medusa->>EventBus: order.placed
    EventBus->>handleOrderPlaced: Subscriber triggered

    handleOrderPlaced->>purchaseTicketsWorkflow: Executar
    purchaseTicketsWorkflow->>RaffleTicketService: Gerar números
    purchaseTicketsWorkflow->>RaffleTicketService: Gerar códigos
    purchaseTicketsWorkflow->>RaffleTicketService: createTickets()
    RaffleTicketService-->>purchaseTicketsWorkflow: Tickets (status: reserved)
    purchaseTicketsWorkflow->>EventBus: raffle.tickets_purchased

    Cliente->>Checkout: Pagar (PIX/Cartão)
    Checkout->>Medusa: Capturar pagamento
    Medusa->>EventBus: order.payment_captured
    EventBus->>handlePaymentCaptured: Subscriber triggered

    handlePaymentCaptured->>RaffleTicketService: markAsPaid()
    RaffleTicketService-->>handlePaymentCaptured: Tickets (status: paid)
    handlePaymentCaptured->>mintNFTsWorkflow: Agendar mint (async)

    mintNFTsWorkflow->>IPFS: Upload metadata
    IPFS-->>mintNFTsWorkflow: metadata_uri
    mintNFTsWorkflow->>Blockchain: Mint NFT (ERC-721)
    Blockchain-->>mintNFTsWorkflow: nft_token_id + tx_hash
    mintNFTsWorkflow->>RaffleTicketService: updateNFTData()
    RaffleTicketService-->>mintNFTsWorkflow: Tickets (status: minted)
    mintNFTsWorkflow->>EventBus: raffle.tickets_minted
```

**Steps**:
1. Cliente adiciona tickets ao carrinho (produto Medusa normal)
2. Cliente finaliza pedido → `order.placed`
3. **handleOrderPlaced** cria tickets (status: reserved)
4. Cliente paga → `order.payment_captured`
5. **handlePaymentCaptured** marca tickets como pagos
6. **mintNFTsWorkflow** cria NFTs (assíncrono)
7. Tickets ficam com status: minted

---

## 🎲 Fluxo 3: Sorteio (Chainlink VRF)

```mermaid
sequenceDiagram
    participant Admin
    participant API
    participant executeDrawWorkflow
    participant RaffleService
    participant RaffleDrawService
    participant Chainlink VRF
    participant Webhook
    participant handleVRFCallback
    participant notifyWinner

    Admin->>API: POST /admin/raffles/:id/draw
    API->>executeDrawWorkflow: Executar
    executeDrawWorkflow->>RaffleService: startDraw() (status: drawing)
    executeDrawWorkflow->>Chainlink VRF: requestRandomness()
    Chainlink VRF-->>executeDrawWorkflow: vrf_request_id + tx_hash
    executeDrawWorkflow->>RaffleDrawService: createDraw()
    RaffleDrawService-->>executeDrawWorkflow: Draw (status: requested)
    executeDrawWorkflow->>EventBus: raffle.draw_started
    executeDrawWorkflow-->>API: Draw iniciado
    API-->>Admin: 200 OK (aguardando VRF...)

    Note over Chainlink VRF: Gerando randomness...
    Note over Chainlink VRF: Confirmações de blocos...

    Chainlink VRF->>Webhook: Callback com random_words[]
    Webhook->>EventBus: raffle.chainlink_vrf_callback
    EventBus->>handleVRFCallback: Subscriber triggered

    handleVRFCallback->>RaffleDrawService: calculateWinnerNumber()
    RaffleDrawService-->>handleVRFCallback: winner_number
    handleVRFCallback->>RaffleTicketService: getTicketByNumber()
    RaffleTicketService-->>handleVRFCallback: winner_ticket
    handleVRFCallback->>RaffleTicketService: markAsWinner()
    handleVRFCallback->>RaffleService: completeDraw()
    RaffleService-->>handleVRFCallback: Rifa (status: completed)
    handleVRFCallback->>RaffleDrawService: completeDraw()
    handleVRFCallback->>EventBus: raffle.draw_completed
    handleVRFCallback->>EventBus: raffle.winner_announced

    EventBus->>notifyWinner: Subscriber triggered
    notifyWinner->>EmailService: Enviar email ao vencedor
    notifyWinner->>NotificationService: Criar notificação in-app
    notifyWinner->>TaskService: Criar task de entrega
    notifyWinner->>EmailService: Notificar admin
```

**Steps**:
1. Admin executa sorteio via API
2. Workflow solicita randomness ao Chainlink VRF
3. Cria registro do sorteio (status: requested)
4. **Aguarda callback do Chainlink** (webhook)
5. **handleVRFCallback** processa resultado:
   - Calcula número vencedor
   - Busca ticket vencedor
   - Marca ticket como vencedor
   - Atualiza rifa (status: completed)
6. **notifyWinner** envia notificações

---

## 🔔 Subscribers e Eventos

### Subscribers Implementados

| Subscriber | Evento | Descrição |
|-----------|--------|-----------|
| `handleOrderPlaced` | `order.placed` | Detecta compra de tickets e cria registros |
| `handlePaymentCaptured` | `order.payment_captured` | Marca tickets como pagos e agenda mint |
| `handleTicketsPurchased` | `raffle.tickets_purchased` | Processa compra (interno) |
| `handleChainlinkVRFCallback` | `raffle.chainlink_vrf_callback` | Processa resultado VRF |
| `notifyWinner` | `raffle.winner_announced` | Notifica vencedor e admin |

### Eventos do Sistema

**Eventos Medusa** (externos):
- `order.placed` - Pedido criado
- `order.payment_captured` - Pagamento capturado

**Eventos Raffle** (internos):
- `raffle.created` - Rifa criada
- `raffle.published` - Rifa publicada (blockchain)
- `raffle.tickets_purchased` - Tickets comprados
- `raffle.tickets_minted` - NFTs criados
- `raffle.draw_started` - Sorteio iniciado
- `raffle.draw_completed` - Sorteio finalizado
- `raffle.winner_announced` - Vencedor anunciado
- `raffle.cancelled` - Rifa cancelada
- `raffle.chainlink_vrf_callback` - Callback VRF (custom)

---

## 🎯 Estados dos Tickets

```
RESERVED → PAID → MINTED → WINNER
    ↓        ↓        ↓
 (carrinho) (pago)  (NFT criado)  (sorteado)
```

---

## 🎰 Estados da Rifa

```
DRAFT → ACTIVE → SOLD_OUT → DRAWING → COMPLETED
                                ↓
                           CANCELLED
```

---

## ⚙️ Configuração de Subscribers no Medusa

Os subscribers são automaticamente registrados pelo Medusa quando:
1. Estão na pasta `subscribers/`
2. Exportam `config` com `SubscriberConfig`
3. Exportam função default assíncrona

Exemplo:
```typescript
export const config: SubscriberConfig = {
  event: "order.placed",
  context: {
    subscriberId: "raffle-order-placed-handler",
  },
};
```

---

## 🔐 Webhook do Chainlink VRF

Para processar o callback do Chainlink, criar endpoint:

```typescript
// src/api/webhooks/chainlink/route.ts
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { requestId, randomWords } = req.body;

  // Disparar evento interno
  await eventBusService.emit("raffle.chainlink_vrf_callback", {
    vrf_request_id: requestId,
    random_words: randomWords,
  });

  res.status(200).json({ success: true });
}
```

**URL do webhook**: `https://your-domain.com/webhooks/chainlink`

---

## 🧪 Testando o Fluxo Completo

### Endpoint de Teste (Desenvolvimento)

Para testar o fluxo sem interagir com o Chainlink VRF real, use:

```bash
POST /admin/raffles/:id/test-draw
```

Este endpoint:
1. Valida que a rifa está ativa
2. Muda status para "drawing"
3. Cria registro de draw com VRF simulado
4. Gera números aleatórios pseudo-random
5. Dispara evento `raffle.chainlink_vrf_callback` após 2s
6. Processa vencedor automaticamente

**Exemplo de uso**:
```bash
curl -X POST http://localhost:9000/admin/raffles/raffle_123/test-draw \
  -H "Content-Type: application/json"
```

**Resposta**:
```json
{
  "message": "Test draw initiated successfully",
  "draw": {
    "id": "draw_abc",
    "raffle_id": "raffle_123",
    "vrf_request_id": "test-1699876543210-x7k2m",
    "status": "requested"
  },
  "preview": {
    "winner_number": 42,
    "total_tickets": 100,
    "random_words": ["12345678901234567890"]
  },
  "note": "VRF callback will be processed in ~2 seconds"
}
```

⚠️ **IMPORTANTE**: Este endpoint é automaticamente desabilitado em `NODE_ENV=production`

### Fluxo de Teste End-to-End

1. **Criar Rifa**:
```bash
POST /admin/raffles
{
  "title": "iPhone 15 Pro Max",
  "prize_description": "iPhone 15 Pro Max 256GB",
  "total_tickets": 100,
  "ticket_price": 5000,
  "draw_date": "2025-12-31T23:59:59Z"
}
```

2. **Publicar Rifa** (simula deploy blockchain):
```bash
POST /admin/raffles/:id/publish
```

3. **Comprar Tickets** (via storefront):
```bash
POST /store/carts/:id/line-items
{
  "variant_id": "variant_raffle_ticket",
  "quantity": 5,
  "metadata": { "raffle_id": "raffle_123" }
}
```

4. **Finalizar Pedido**:
```bash
POST /store/carts/:id/complete
```

5. **Simular Pagamento**:
```bash
POST /admin/orders/:id/capture-payment
```

6. **Executar Sorteio de Teste**:
```bash
POST /admin/raffles/:id/test-draw
```

7. **Verificar Vencedor** (após 2-3 segundos):
```bash
GET /admin/raffles/:id
# Verificar campos: winner_ticket_number, winner_customer_id, status: "completed"
```

---

## 🚀 Próximos Passos

Para ativar completamente o sistema:

1. ✅ **Webhook Chainlink VRF** - Implementado em `src/api/webhooks/chainlink/route.ts`
2. ✅ **Endpoint de Teste** - Implementado em `src/api/admin/raffles/[id]/test-draw/route.ts`
3. **Integrar services reais** nos subscribers (remover TODOs):
   - Email service (SendGrid, Resend, etc.)
   - Notification service (in-app)
   - Customer service (dados do cliente)
   - Task service (gerenciamento de entregas)
4. **Deploy smart contracts** (Polygon Mumbai testnet):
   - RaffleSystem.sol
   - TicketNFT.sol (ERC-721)
   - Integração Chainlink VRF
5. **Configurar APIs externas**:
   - Chainlink VRF subscription (vrf.chain.link)
   - IPFS/Pinata (NFT metadata)
   - Polygon RPC URL
6. **Testes automatizados**:
   - Unit tests (services)
   - Integration tests (workflows)
   - E2E tests (fluxo completo)

---

## ⚠️ Considerações Importantes

### Idempotência
- Subscribers devem ser idempotentes
- Verificar se operação já foi executada
- Usar transaction IDs ou flags no metadata

### Retry Logic
- Subscribers não devem propagar erros fatais
- Implementar retry com exponential backoff
- Usar dead letter queue para falhas críticas

### Performance
- Mint de NFTs é assíncrono (não bloqueia checkout)
- Usar jobs/queues para operações demoradas
- Cachear dados frequentemente acessados

### Segurança
- Validar webhook signatures (Chainlink)
- Rate limiting em endpoints públicos
- Logs estruturados para auditoria
