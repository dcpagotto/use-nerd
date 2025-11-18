# 🎯 PLANO MESTRE: NERD-PREMIADO COM BLOCKCHAIN
**Sistema de Rifas com Polygon + Alchemy + Chainlink VRF + Stripe**

**Data de Criação**: 17 de Novembro de 2025
**Versão**: 2.0 (Especificações Finais Aprovadas)
**Status**: 📋 PLANEJAMENTO COMPLETO - PRONTO PARA EXECUÇÃO

---

## 📑 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura Técnica](#arquitetura-técnica)
3. [Integrações Externas](#integrações-externas)
4. [Especificações Funcionais](#especificações-funcionais)
5. [Roadmap de Desenvolvimento](#roadmap-de-desenvolvimento)
6. [Documentação de APIs](#documentação-de-apis)
7. [Configurações e Variáveis](#configurações-e-variáveis)
8. [Guia de Implementação](#guia-de-implementação)
9. [Testes e QA](#testes-e-qa)
10. [Deploy e Produção](#deploy-e-produção)

---

## 🎯 VISÃO GERAL

### Objetivo
Criar um sistema completo de rifas (Nerd-Premiado) integrado com blockchain Polygon, onde:

- ✅ **Compras na loja** dão direito a números automaticamente
- ✅ **Compra direta de números** no Nerd-Premiado
- ✅ **Pacotes de números** com preços promocionais
- ✅ **Todos os números registrados na blockchain** Polygon via Alchemy
- ✅ **Sorteios justos e verificáveis** via Chainlink VRF
- ✅ **Pagamentos via Stripe** (PIX, cartão, cripto com conversão automática)
- ✅ **Notificações multichannel** para vencedores
- ✅ **Painel admin** para gerenciar rifas e configurações blockchain

### Princípios de Desenvolvimento
1. ⚠️ **NÃO ALTERAR** o que já está funcionando (produtos, checkout, Medusa core)
2. ✅ **INTEGRAR** módulo de rifas ao fluxo existente
3. 🔒 **GARANTIR** segurança blockchain e pagamentos
4. 📊 **MANTER** rastreabilidade total (DB + Blockchain)
5. 🎨 **SEGUIR** tema cyberpunk existente

---

## 🏗️ ARQUITETURA TÉCNICA

### Stack Tecnológico

#### Backend
- **Framework**: Medusa v2.0 (Node.js + TypeScript)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Blockchain Provider**: **Alchemy** (Polygon Mumbai → Mainnet)
- **Smart Contracts**: Solidity 0.8.x + Hardhat
- **Randomness**: Chainlink VRF v2
- **Payment Gateway**: **Stripe** (checkout + crypto conversion)
- **Events**: Medusa Event Bus + Blockchain Event Listener

#### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 (tema cyberpunk)
- **Web3**: Ethers.js 6.x (read-only para verificação)
- **State**: React Context API
- **Forms**: React Hook Form + Zod validation

#### Blockchain
- **Network**: Polygon (Matic)
  - **Testnet**: Mumbai (desenvolvimento)
  - **Mainnet**: Polygon PoS (produção)
- **RPC Provider**: **Alchemy**
  - API Key: Alchemy Dashboard
  - WebSocket support para events
  - Built-in analytics
- **Oracle**: Chainlink VRF v2
  - Coordinator: Polygon Mumbai/Mainnet
  - LINK Token para payment
- **Contract**: `NerdPremiadoRaffle.sol`
  - Registro de tickets
  - Sorteios VRF
  - Metadados customizáveis
  - Eventos auditáveis

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 14)                    │
├─────────────────────────────────────────────────────────────────┤
│  /nerd-premiado (Lista)  │  /nerd-premiado/[id] (Detalhes)      │
│  ├─ Rifas Ativas         │  ├─ Informações do Prêmio            │
│  ├─ Pacotes de Números   │  ├─ Comprar Números                  │
│  └─ Meus Números         │  └─ Verificação Blockchain           │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Medusa v2 + Modules)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  RAFFLE MODULE (src/modules/raffle/)                     │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Models:                                                  │   │
│  │  ├─ raffle.ts (sorteios)                                 │   │
│  │  ├─ raffle-ticket.ts (números comprados)                 │   │
│  │  ├─ raffle-draw.ts (resultados)                          │   │
│  │  └─ raffle-package.ts (pacotes) [NOVO]                   │   │
│  │                                                            │   │
│  │  Services:                                                │   │
│  │  ├─ raffle.service.ts                                    │   │
│  │  ├─ blockchain.service.ts [NOVO]                         │   │
│  │  ├─ stripe-payment.service.ts [NOVO]                     │   │
│  │  └─ notification.service.ts [NOVO]                       │   │
│  │                                                            │   │
│  │  Workflows:                                               │   │
│  │  ├─ purchase-tickets.workflow.ts                         │   │
│  │  ├─ auto-allocate-tickets.workflow.ts [NOVO]            │   │
│  │  ├─ execute-draw.workflow.ts                             │   │
│  │  └─ batch-blockchain-sync.workflow.ts [NOVO]            │   │
│  │                                                            │   │
│  │  Subscribers:                                             │   │
│  │  ├─ order-placed.subscriber.ts [NOVO]                   │   │
│  │  ├─ payment-confirmed.subscriber.ts                      │   │
│  │  └─ blockchain-events.subscriber.ts                      │   │
│  │                                                            │   │
│  │  Admin API:                                               │   │
│  │  ├─ /admin/raffle/* (CRUD)                              │   │
│  │  ├─ /admin/raffle/settings (config blockchain)          │   │
│  │  └─ /admin/raffle/packages (pacotes)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Existing Modules (NÃO ALTERAR):                                │
│  ├─ Product Module                                              │
│  ├─ Order Module                                                │
│  ├─ Customer Module                                             │
│  └─ Payment Module (integrado com Stripe)                       │
└───────────────────┬───────────────────────────────────────┬─────┘
                    │                                       │
                    ▼                                       ▼
┌───────────────────────────────────┐  ┌──────────────────────────┐
│       STRIPE PAYMENT API           │  │   ALCHEMY + POLYGON      │
├───────────────────────────────────┤  ├──────────────────────────┤
│ ├─ Checkout Sessions               │  │ ├─ RPC Provider (HTTP)   │
│ ├─ Payment Intents                 │  │ ├─ WebSocket (events)    │
│ ├─ PIX Integration (Brazil)        │  │ ├─ Enhanced APIs         │
│ ├─ Crypto Conversion               │  │ └─ Analytics Dashboard   │
│ └─ Webhooks (confirmação)          │  │                          │
└───────────────────────────────────┘  └──────────┬───────────────┘
                                                   │
                                                   ▼
                                    ┌──────────────────────────────┐
                                    │  SMART CONTRACT (Polygon)    │
                                    ├──────────────────────────────┤
                                    │  NerdPremiadoRaffle.sol      │
                                    │  ├─ registerPurchase()       │
                                    │  ├─ requestRandomWinner()    │
                                    │  ├─ fulfillRandomWords()     │
                                    │  └─ getTickets()             │
                                    └──────────┬───────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────────────────┐
                                    │  CHAINLINK VRF v2            │
                                    ├──────────────────────────────┤
                                    │  ├─ Request Randomness       │
                                    │  ├─ Callback fulfillRandomWords│
                                    │  └─ LINK Token Payment       │
                                    └──────────────────────────────┘
```

---

## 🔌 INTEGRAÇÕES EXTERNAS

### 1. Alchemy Integration

#### 1.1 Configuração

**Signup & API Key**:
1. Criar conta: https://www.alchemy.com/
2. Create App:
   - Chain: Polygon
   - Network: Mumbai (testnet) → Polygon Mainnet (produção)
   - Name: USE Nerd - Nerd Premiado
3. Copiar API Key e HTTP/WSS URLs

**Variáveis de Ambiente**:
```env
# Alchemy Configuration
ALCHEMY_API_KEY=your-alchemy-api-key-here
ALCHEMY_POLYGON_MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}
ALCHEMY_POLYGON_MAINNET_URL=https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}
ALCHEMY_POLYGON_WSS_URL=wss://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}

# Use Mumbai para desenvolvimento
POLYGON_RPC_URL=${ALCHEMY_POLYGON_MUMBAI_URL}
POLYGON_WSS_URL=${ALCHEMY_POLYGON_WSS_URL}
```

#### 1.2 SDK Integration (Backend)

**Instalação**:
```bash
npm install alchemy-sdk ethers@6
```

**Arquivo**: `src/modules/raffle/services/alchemy.service.ts`
```typescript
import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';

export class AlchemyService {
  private alchemy: Alchemy;
  private provider: ethers.AlchemyProvider;

  constructor() {
    const config = {
      apiKey: process.env.ALCHEMY_API_KEY,
      network: Network.MATIC_MUMBAI, // ou MATIC_MAINNET
    };

    this.alchemy = new Alchemy(config);
    this.provider = new ethers.AlchemyProvider(
      'matic-mumbai',
      process.env.ALCHEMY_API_KEY
    );
  }

  // Métodos de interação com blockchain
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async getTransactionReceipt(txHash: string) {
    return await this.provider.getTransactionReceipt(txHash);
  }

  async estimateGas(transaction: any) {
    return await this.provider.estimateGas(transaction);
  }

  // Alchemy Enhanced APIs
  async getAssetTransfers(address: string) {
    return await this.alchemy.core.getAssetTransfers({
      fromAddress: address,
      category: ['external', 'internal', 'erc20'],
    });
  }

  async getNFTsForOwner(owner: string) {
    return await this.alchemy.nft.getNftsForOwner(owner);
  }

  // Event Listener (WebSocket)
  listenToContractEvents(contractAddress: string, eventFilter: any, callback: Function) {
    const contract = new ethers.Contract(
      contractAddress,
      ABI, // ABI do contrato
      this.provider
    );

    contract.on(eventFilter, (...args) => {
      callback(...args);
    });
  }
}
```

#### 1.3 Alchemy Features Utilizadas

| Feature | Uso no Projeto | Benefício |
|---------|----------------|-----------|
| **Enhanced APIs** | Buscar histórico de tickets | Queries mais rápidas |
| **WebSocket** | Listen eventos do contrato | Real-time updates |
| **NFT API** | Futuro: Tickets como NFTs | Visualização de tickets |
| **Notify API** | Webhook de transações | Confirmações automáticas |
| **Simulation API** | Testar transações antes | Evitar erros de gas |
| **Debug API** | Troubleshooting | Análise de falhas |
| **Gas Manager** | Otimizar custos | Economia operacional |

#### 1.4 Alchemy Dashboard

**Monitoramento**:
- Requests per second
- Latência de chamadas
- Gas usage
- Erros e timeouts
- Webhook deliveries

**Alertas**:
- Configurar alertas de:
  - Rate limit warnings
  - Failed transactions
  - Unusual activity

---

### 2. Stripe Integration

#### 2.1 Configuração

**Setup**:
1. Conta Stripe: https://dashboard.stripe.com/
2. Ativar modo test
3. Configurar PIX (Brasil):
   - Settings → Payment Methods → PIX
   - Vincular conta bancária brasileira
4. Ativar Crypto Payments:
   - Settings → Crypto → Enable
   - Suporta: BTC, ETH, USDC, USDT, etc.

**API Keys**:
```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # ou sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_test_... # ou pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PIX Configuration (Brasil)
STRIPE_PIX_ENABLED=true

# Crypto Configuration
STRIPE_CRYPTO_ENABLED=true
STRIPE_CRYPTO_AUTO_CONVERT=true # Converter para BRL automaticamente
```

#### 2.2 SDK Integration

**Instalação**:
```bash
npm install stripe @stripe/stripe-js
```

**Backend Service**: `src/modules/raffle/services/stripe-payment.service.ts`
```typescript
import Stripe from 'stripe';

export class StripePaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    });
  }

  // Criar sessão de checkout para compra de números
  async createCheckoutSession(data: {
    raffleId: string;
    quantity: number;
    pricePerTicket: number;
    customerId: string;
    metadata?: any;
  }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'pix', 'crypto'], // PIX + Crypto habilitados
      line_items: [{
        price_data: {
          currency: 'brl',
          product_data: {
            name: `${data.quantity} números - Nerd Premiado`,
            description: `Rifa ID: ${data.raffleId}`,
            images: ['https://usenerd.com/raffle-image.png'],
          },
          unit_amount: data.pricePerTicket * 100, // centavos
          tax_behavior: 'inclusive',
        },
        quantity: data.quantity,
      }],
      mode: 'payment',
      customer: data.customerId,
      success_url: `${process.env.FRONTEND_URL}/nerd-premiado/${data.raffleId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/nerd-premiado/${data.raffleId}`,
      metadata: {
        raffleId: data.raffleId,
        quantity: data.quantity,
        ...data.metadata,
      },
      // Crypto auto-conversion para BRL
      payment_intent_data: {
        metadata: {
          auto_convert_crypto: 'true',
        },
      },
    });

    return session;
  }

  // Webhook handler (confirmação de pagamento)
  async handleWebhook(rawBody: Buffer, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handlePaymentSuccess(event.data.object as Stripe.Checkout.Session);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      // ... outros eventos
    }
  }

  private async handlePaymentSuccess(session: Stripe.Checkout.Session) {
    const { raffleId, quantity } = session.metadata!;

    // Emitir evento Medusa para processar compra
    eventBus.emit('raffle.payment.confirmed', {
      sessionId: session.id,
      raffleId,
      quantity: parseInt(quantity),
      customerId: session.customer as string,
      amountPaid: session.amount_total! / 100,
      paymentMethod: session.payment_method_types[0], // 'card', 'pix', 'crypto'
    });
  }
}
```

**Frontend Integration**: `storefront/lib/stripe-client.ts`
```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export async function redirectToCheckout(raffleId: string, quantity: number) {
  const stripe = await stripePromise;

  // Criar sessão no backend
  const response = await fetch('/api/raffle/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raffleId, quantity }),
  });

  const { sessionId } = await response.json();

  // Redirecionar para Stripe Checkout
  await stripe!.redirectToCheckout({ sessionId });
}
```

#### 2.3 Fluxo de Pagamento

```
1. Cliente clica "Comprar Números"
   ↓
2. Frontend chama API /api/raffle/create-checkout
   ↓
3. Backend cria Stripe Checkout Session
   ↓
4. Redirect para Stripe hosted page
   ↓
5. Cliente escolhe método:
   - Cartão de Crédito
   - PIX (QR Code gerado)
   - Crypto (wallet payment)
   ↓
6. Stripe processa pagamento
   ↓
7. Webhook /api/webhooks/stripe recebe confirmação
   ↓
8. Evento "raffle.payment.confirmed" emitido
   ↓
9. Workflow aloca números ao cliente
   ↓
10. Registra na blockchain via Alchemy
   ↓
11. Cliente recebe email com números
```

---

### 3. Chainlink VRF v2 Integration

#### 3.1 Configuração

**Subscription Setup**:
1. Acessar: https://vrf.chain.link/
2. Network: Polygon Mumbai (test) ou Polygon Mainnet
3. Criar subscription
4. Adicionar LINK tokens (~5 LINK para testes)
5. Add Consumer: Contract address (após deploy)

**Contract Configuration**:
```solidity
// Polygon Mumbai
VRF_COORDINATOR = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
KEY_HASH = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
SUBSCRIPTION_ID = <seu_subscription_id>;

// Polygon Mainnet
VRF_COORDINATOR = 0xAE975071Be8F8eE67addBC1A82488F1C24858067;
KEY_HASH = 0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd;
SUBSCRIPTION_ID = <seu_subscription_id>;
```

**Variáveis de Ambiente**:
```env
# Chainlink VRF Configuration
CHAINLINK_VRF_COORDINATOR=0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed
CHAINLINK_VRF_KEY_HASH=0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f
CHAINLINK_VRF_SUBSCRIPTION_ID=123
CHAINLINK_VRF_CALLBACK_GAS_LIMIT=200000
CHAINLINK_VRF_REQUEST_CONFIRMATIONS=3
```

#### 3.2 Smart Contract Implementation

**Arquivo**: `contracts/NerdPremiadoRaffle.sol`
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NerdPremiadoRaffle is VRFConsumerBaseV2, Ownable {
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_keyHash;
    uint64 private immutable i_subscriptionId;
    uint32 private constant CALLBACK_GAS_LIMIT = 200000;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    struct Ticket {
        string purchaseId;      // ID da compra no Medusa
        uint256[] numbers;      // Números comprados
        string userId;          // User ID do comprador
        string raffleId;        // ID do sorteio
        uint256 drawDate;       // Data do sorteio (timestamp)
        string orderId;         // Order ID do Medusa
        string customData;      // Campo customizável de observação
        uint256 timestamp;      // Timestamp do registro
    }

    struct Raffle {
        string raffleId;
        bool active;
        uint256 drawDate;
        uint256 totalTickets;
        uint256 soldTickets;
        uint256 winnerNumber;
        bool drawn;
        uint256 vrfRequestId;
    }

    // Mappings
    mapping(string => Raffle) public raffles;
    mapping(string => Ticket[]) public raffleTickets; // raffleId => tickets
    mapping(uint256 => string) public vrfRequests; // requestId => raffleId

    // Events
    event RaffleCreated(string indexed raffleId, uint256 drawDate, uint256 totalTickets);
    event TicketsPurchased(
        string indexed raffleId,
        string indexed orderId,
        string userId,
        uint256[] numbers,
        string customData
    );
    event DrawRequested(string indexed raffleId, uint256 requestId);
    event WinnerDrawn(string indexed raffleId, uint256 winnerNumber, uint256 requestId);

    constructor(
        address vrfCoordinator,
        bytes32 keyHash,
        uint64 subscriptionId
    ) VRFConsumerBaseV2(vrfCoordinator) Ownable(msg.sender) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_keyHash = keyHash;
        i_subscriptionId = subscriptionId;
    }

    // Criar nova rifa
    function createRaffle(
        string memory raffleId,
        uint256 drawDate,
        uint256 totalTickets
    ) external onlyOwner {
        require(!raffles[raffleId].active, "Raffle already exists");

        raffles[raffleId] = Raffle({
            raffleId: raffleId,
            active: true,
            drawDate: drawDate,
            totalTickets: totalTickets,
            soldTickets: 0,
            winnerNumber: 0,
            drawn: false,
            vrfRequestId: 0
        });

        emit RaffleCreated(raffleId, drawDate, totalTickets);
    }

    // Registrar compra de números
    function registerPurchase(
        string memory raffleId,
        string memory purchaseId,
        uint256[] memory numbers,
        string memory userId,
        string memory orderId,
        string memory customData
    ) external onlyOwner {
        require(raffles[raffleId].active, "Raffle not active");
        require(!raffles[raffleId].drawn, "Raffle already drawn");

        Ticket memory ticket = Ticket({
            purchaseId: purchaseId,
            numbers: numbers,
            userId: userId,
            raffleId: raffleId,
            drawDate: raffles[raffleId].drawDate,
            orderId: orderId,
            customData: customData,
            timestamp: block.timestamp
        });

        raffleTickets[raffleId].push(ticket);
        raffles[raffleId].soldTickets += numbers.length;

        emit TicketsPurchased(raffleId, orderId, userId, numbers, customData);
    }

    // Solicitar sorteio via Chainlink VRF
    function requestDrawWinner(string memory raffleId) external onlyOwner returns (uint256) {
        require(raffles[raffleId].active, "Raffle not active");
        require(!raffles[raffleId].drawn, "Already drawn");
        require(block.timestamp >= raffles[raffleId].drawDate, "Draw date not reached");

        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS
        );

        vrfRequests[requestId] = raffleId;
        raffles[raffleId].vrfRequestId = requestId;

        emit DrawRequested(raffleId, requestId);

        return requestId;
    }

    // Callback do Chainlink VRF (automático)
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        string memory raffleId = vrfRequests[requestId];
        require(raffles[raffleId].active, "Raffle not active");

        uint256 randomNumber = randomWords[0];
        uint256 winnerNumber = (randomNumber % raffles[raffleId].totalTickets) + 1;

        raffles[raffleId].winnerNumber = winnerNumber;
        raffles[raffleId].drawn = true;
        raffles[raffleId].active = false;

        emit WinnerDrawn(raffleId, winnerNumber, requestId);
    }

    // View functions
    function getTickets(string memory raffleId) external view returns (Ticket[] memory) {
        return raffleTickets[raffleId];
    }

    function getRaffle(string memory raffleId) external view returns (Raffle memory) {
        return raffles[raffleId];
    }

    function getTicketsByOrder(string memory orderId, string memory raffleId) external view returns (Ticket[] memory) {
        Ticket[] memory allTickets = raffleTickets[raffleId];
        uint256 count = 0;

        // Contar tickets deste order
        for (uint256 i = 0; i < allTickets.length; i++) {
            if (keccak256(bytes(allTickets[i].orderId)) == keccak256(bytes(orderId))) {
                count++;
            }
        }

        // Criar array filtrado
        Ticket[] memory orderTickets = new Ticket[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allTickets.length; i++) {
            if (keccak256(bytes(allTickets[i].orderId)) == keccak256(bytes(orderId))) {
                orderTickets[index] = allTickets[i];
                index++;
            }
        }

        return orderTickets;
    }
}
```

---

## 📋 ESPECIFICAÇÕES FUNCIONAIS

### 1. Sistema de Números Automáticos (Compras na Loja)

#### 1.1 Regra de Alocação

**Configuração Admin**:
- Definir **quantos números por R$ gasto**
  - Exemplo: A cada R$ 50,00 = 1 número
  - Exemplo: A cada R$ 100,00 = 3 números
- Definir **rifas elegíveis** (ativas, futuras, ou todas)
- Definir **produtos elegíveis** (todos, categorias específicas, produtos específicos)

**Database**: Nova tabela `raffle_allocation_rule`
```sql
CREATE TABLE raffle_allocation_rule (
  id TEXT PRIMARY KEY,
  raffle_id TEXT REFERENCES raffle(id),
  active BOOLEAN DEFAULT true,

  -- Regras de alocação
  amount_threshold DECIMAL(10,2), -- R$ 50.00
  tickets_per_threshold INT, -- 1 número

  -- Filtros
  eligible_product_ids TEXT[], -- null = todos
  eligible_collection_ids TEXT[], -- null = todos
  eligible_category_ids TEXT[], -- null = todos

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 1.2 Fluxo de Alocação

**Subscriber**: `src/modules/raffle/subscribers/order-placed.subscriber.ts`
```typescript
import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa';
import { RaffleService } from '../services/raffle.service';

export default async function handleOrderPlaced({ data, eventName, container }: SubscriberArgs<any>) {
  const raffleService: RaffleService = container.resolve('raffleService');

  const order = data;

  // Verificar se há rifas ativas com regras de alocação
  const activeRules = await raffleService.getActiveAllocationRules();

  for (const rule of activeRules) {
    // Calcular total elegível do pedido
    const eligibleAmount = calculateEligibleAmount(order, rule);

    // Calcular quantos números o cliente ganhou
    const ticketsEarned = Math.floor(eligibleAmount / rule.amount_threshold) * rule.tickets_per_threshold;

    if (ticketsEarned > 0) {
      // Alocar números automaticamente
      await raffleService.allocateAutoTickets({
        raffleId: rule.raffle_id,
        orderId: order.id,
        customerId: order.customer_id,
        quantity: ticketsEarned,
        source: 'auto_allocation',
        ruleId: rule.id,
      });
    }
  }
}

function calculateEligibleAmount(order: Order, rule: AllocationRule): number {
  let total = 0;

  for (const item of order.items) {
    // Verificar se produto é elegível
    const isEligible =
      (!rule.eligible_product_ids || rule.eligible_product_ids.includes(item.product_id)) &&
      (!rule.eligible_collection_ids || rule.eligible_collection_ids.includes(item.product.collection_id)) &&
      (!rule.eligible_category_ids || rule.eligible_category_ids.includes(item.product.category_id));

    if (isEligible) {
      total += item.total;
    }
  }

  return total;
}

export const config: SubscriberConfig = {
  event: 'order.placed',
  context: {
    subscriberId: 'order-placed-raffle-allocator',
  },
};
```

**Notificação ao Cliente**:
- Email após compra:
  ```
  Parabéns! Você ganhou X números na rifa [Nome da Rifa]!
  Seus números: 1234, 5678, 9012
  Sorteio em: DD/MM/YYYY
  Verificar na blockchain: [Link Polygonscan]
  ```

---

### 2. Sistema de Pacotes de Números

#### 2.1 Database Model

**Tabela**: `raffle_package`
```sql
CREATE TABLE raffle_package (
  id TEXT PRIMARY KEY,
  raffle_id TEXT REFERENCES raffle(id),
  name TEXT NOT NULL,
  description TEXT,

  -- Preço e quantidade
  quantity INT NOT NULL, -- Quantos números
  price DECIMAL(10,2) NOT NULL, -- Preço total
  original_price DECIMAL(10,2), -- Preço original (para mostrar desconto)

  -- Disponibilidade
  active BOOLEAN DEFAULT true,
  stock INT, -- null = ilimitado
  max_per_customer INT, -- limite por cliente

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Model**: `src/modules/raffle/models/raffle-package.ts`
```typescript
import { model } from '@medusajs/framework/utils';

export const RafflePackage = model.define('raffle_package', {
  id: model.id().primaryKey(),
  raffle_id: model.text(),
  name: model.text(),
  description: model.text().nullable(),
  quantity: model.number(),
  price: model.bigNumber(),
  original_price: model.bigNumber().nullable(),
  active: model.boolean().default(true),
  stock: model.number().nullable(),
  max_per_customer: model.number().nullable(),
  created_at: model.dateTime().default('now'),
  updated_at: model.dateTime().default('now'),
});
```

#### 2.2 Exemplos de Pacotes

| Nome | Quantidade | Preço | Desconto |
|------|------------|-------|----------|
| Pacote Iniciante | 10 números | R$ 45,00 | 10% off |
| Pacote Popular | 50 números | R$ 200,00 | 20% off |
| Pacote VIP | 100 números | R$ 350,00 | 30% off |
| Pacote Campeão | 500 números | R$ 1.500,00 | 40% off |

**Admin API**: `POST /admin/raffle/:id/packages`
```typescript
{
  "name": "Pacote Popular",
  "description": "50 números com 20% de desconto!",
  "quantity": 50,
  "price": 200.00,
  "original_price": 250.00,
  "stock": 100, // 100 pacotes disponíveis
  "max_per_customer": 5
}
```

#### 2.3 Frontend - Seleção de Pacotes

**Componente**: `storefront/components/RafflePackageSelector.tsx`
```tsx
export function RafflePackageSelector({ raffleId }: { raffleId: string }) {
  const packages = useFetch(`/api/raffle/${raffleId}/packages`);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {packages.map(pkg => (
        <div key={pkg.id} className="card-cyber-glow p-6">
          {/* Badge de desconto */}
          {pkg.original_price && (
            <div className="badge-neon-purple mb-2">
              {calculateDiscount(pkg.price, pkg.original_price)}% OFF
            </div>
          )}

          <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
          <p className="text-gray-400 mb-4">{pkg.description}</p>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-black text-neon-purple">
              R$ {pkg.price.toFixed(2)}
            </span>
            {pkg.original_price && (
              <span className="text-sm line-through text-gray-500">
                R$ {pkg.original_price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="text-center mb-4">
            <span className="text-5xl font-black">{pkg.quantity}</span>
            <span className="text-gray-400 ml-2">números</span>
          </div>

          {/* Stock indicator */}
          {pkg.stock && pkg.stock < 20 && (
            <p className="text-orange-400 text-sm mb-2">
              Apenas {pkg.stock} pacotes restantes!
            </p>
          )}

          <button
            onClick={() => handlePurchasePackage(pkg)}
            className="btn-neon-filled-purple w-full"
          >
            Comprar Pacote
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

### 3. Campo Customizável de Observação Blockchain

#### 3.1 Configuração Admin

**Interface**: Medusa Admin Panel
```
/admin/raffle/:id/settings

┌─────────────────────────────────────────────┐
│  Configurações de Blockchain                │
├─────────────────────────────────────────────┤
│                                             │
│  Dados Obrigatórios (sempre enviados):     │
│  ✓ Purchase ID                              │
│  ✓ Números comprados                        │
│  ✓ User ID                                  │
│  ✓ Raffle ID                                │
│  ✓ Data do sorteio                          │
│  ✓ Order ID                                 │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Dados Opcionais:                           │
│  [ ] Endereço de entrega                    │
│  [ ] Email do comprador                     │
│  [ ] Método de pagamento                    │
│  [ ] CPF/CNPJ                               │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Campo de Observação Customizado:           │
│  [x] Habilitar campo de observação          │
│                                             │
│  Label do campo:                            │
│  [Observações do Admin_____________]        │
│                                             │
│  Limite de caracteres:                      │
│  [200_____] caracteres                      │
│                                             │
│  Valor padrão (opcional):                   │
│  [Compra verificada na blockchain Polygon_] │
│  [________________________________________] │
│                                             │
│  [Salvar Configurações]                     │
└─────────────────────────────────────────────┘
```

**Database**: `raffle_blockchain_config`
```sql
CREATE TABLE raffle_blockchain_config (
  id TEXT PRIMARY KEY,
  raffle_id TEXT UNIQUE REFERENCES raffle(id),

  -- Dados opcionais
  include_shipping_address BOOLEAN DEFAULT false,
  include_email BOOLEAN DEFAULT false,
  include_payment_method BOOLEAN DEFAULT false,
  include_document BOOLEAN DEFAULT false,

  -- Campo customizável
  custom_field_enabled BOOLEAN DEFAULT false,
  custom_field_label TEXT,
  custom_field_max_length INT DEFAULT 200,
  custom_field_default_value TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3.2 Uso no Blockchain Service

```typescript
async registerTicketsOnChain(data: RegisterTicketsData) {
  const config = await this.getBlockchainConfig(data.raffleId);

  // Construir custom data baseado na configuração
  let customData = '';

  if (config.custom_field_enabled) {
    customData = data.customObservation || config.custom_field_default_value || '';
    // Limitar ao tamanho máximo
    customData = customData.substring(0, config.custom_field_max_length);
  }

  // Adicionar dados opcionais ao customData
  const optionalData: any = {};
  if (config.include_shipping_address) optionalData.shipping = data.shippingAddress;
  if (config.include_email) optionalData.email = data.email;
  if (config.include_payment_method) optionalData.payment = data.paymentMethod;
  if (config.include_document) optionalData.document = data.document;

  // Serializar dados opcionais
  const serializedOptionalData = JSON.stringify(optionalData);

  // Combinar observação custom + dados opcionais
  const finalCustomData = `${customData}${serializedOptionalData ? ' | ' + serializedOptionalData : ''}`;

  // Chamar smart contract
  const tx = await this.contract.registerPurchase(
    data.raffleId,
    data.purchaseId,
    data.numbers,
    data.userId,
    data.orderId,
    finalCustomData // ← Campo customizável
  );

  return tx;
}
```

---

### 4. Configuração de Batch vs Imediato

#### 4.1 Admin Settings

**Interface**: `/admin/raffle/settings/blockchain`
```
┌─────────────────────────────────────────────┐
│  Modo de Registro Blockchain                │
├─────────────────────────────────────────────┤
│                                             │
│  ( ) Imediato                               │
│      Registra cada compra instantaneamente  │
│      • Custo: ~$0.01 USD por transação      │
│      • Verificação: Imediata                │
│                                             │
│  (•) Batch (Lote)                           │
│      Agrupa múltiplas compras em uma tx     │
│      • Economia de até 80% em gas fees      │
│      • Delay: Conforme configuração abaixo  │
│                                             │
│  ─────────────────────────────────────────  │
│                                             │
│  Configurações de Batch:                    │
│                                             │
│  Agrupar a cada:                            │
│  ( ) 10 compras                             │
│  (•) 50 compras                             │
│  ( ) 100 compras                            │
│  ( ) Personalizado: [___] compras           │
│                                             │
│  OU                                         │
│                                             │
│  Intervalo de tempo:                        │
│  ( ) 5 minutos                              │
│  (•) 15 minutos                             │
│  ( ) 30 minutos                             │
│  ( ) 1 hora                                 │
│                                             │
│  Condição: Enviar quando atingir            │
│  quantidade OU tempo (o que ocorrer antes)  │
│                                             │
│  [Salvar Configurações]                     │
└─────────────────────────────────────────────┘
```

**Database**: `blockchain_batch_config`
```sql
CREATE TABLE blockchain_batch_config (
  id TEXT PRIMARY KEY,
  mode TEXT CHECK (mode IN ('immediate', 'batch')), -- 'immediate' ou 'batch'

  -- Batch settings
  batch_size INT DEFAULT 50,
  batch_interval_minutes INT DEFAULT 15,

  -- Metadata
  last_batch_at TIMESTAMPTZ,
  pending_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE blockchain_pending_queue (
  id TEXT PRIMARY KEY,
  raffle_id TEXT,
  purchase_id TEXT,
  ticket_data JSONB, -- Dados completos do ticket
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  retry_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
```

#### 4.2 Batch Processor (Cron Job)

**Arquivo**: `src/modules/raffle/jobs/blockchain-batch-processor.ts`
```typescript
import { MedusaContainer } from '@medusajs/framework';
import { BlockchainService } from '../services/blockchain.service';

export default async function processPendingBatchJob(container: MedusaContainer) {
  const blockchainService: BlockchainService = container.resolve('blockchainService');

  const config = await blockchainService.getBatchConfig();

  if (config.mode !== 'batch') {
    return; // Modo imediato, não processar batch
  }

  // Verificar se deve processar
  const shouldProcess =
    config.pending_count >= config.batch_size || // Atingiu quantidade
    (Date.now() - config.last_batch_at.getTime()) > (config.batch_interval_minutes * 60 * 1000); // Atingiu tempo

  if (!shouldProcess) {
    return;
  }

  // Buscar tickets pendentes
  const pendingTickets = await blockchainService.getPendingQueue(config.batch_size);

  if (pendingTickets.length === 0) {
    return;
  }

  try {
    // Enviar batch para blockchain
    const tx = await blockchainService.registerBatch(pendingTickets);

    // Marcar como processados
    await blockchainService.markAsProcessed(pendingTickets.map(t => t.id), tx.hash);

    // Atualizar config
    await blockchainService.updateBatchConfig({
      last_batch_at: new Date(),
      pending_count: 0,
    });

    console.log(`✅ Batch processado: ${pendingTickets.length} tickets - TX: ${tx.hash}`);
  } catch (error) {
    console.error('❌ Erro ao processar batch:', error);

    // Incrementar retry count
    await blockchainService.incrementRetryCount(pendingTickets.map(t => t.id));
  }
}

// Registrar job no Medusa
export const config = {
  name: 'blockchain-batch-processor',
  schedule: '*/5 * * * *', // A cada 5 minutos
};
```

**Registro no package.json**:
```json
{
  "scripts": {
    "job:blockchain-batch": "medusa exec ./src/modules/raffle/jobs/blockchain-batch-processor.ts"
  }
}
```

---

### 5. Sistema de Notificações Multichannel

#### 5.1 Canais Suportados

| Canal | Trigger | Conteúdo | Provider |
|-------|---------|----------|----------|
| **Email** | Compra, Sorteio | Números comprados, Vencedor | SendGrid / Resend |
| **SMS** | Vitória | "Você ganhou!" | Twilio |
| **Push Web** | Real-time | Updates de rifa | OneSignal |
| **WhatsApp** | Vitória (opcional) | Mensagem personalizada | Twilio WhatsApp API |

#### 5.2 Service Implementation

**Arquivo**: `src/modules/raffle/services/notification.service.ts`
```typescript
import { SendGridService } from '@sendgrid/mail';
import { Twilio } from 'twilio';
import OneSignal from 'onesignal-node';

export class NotificationService {
  private sendgrid: SendGridService;
  private twilio: Twilio;
  private onesignal: OneSignal.Client;

  constructor() {
    this.sendgrid = new SendGridService(process.env.SENDGRID_API_KEY!);
    this.twilio = new Twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );
    this.onesignal = new OneSignal.Client({
      userAuthKey: process.env.ONESIGNAL_USER_AUTH_KEY!,
      app: { appAuthKey: process.env.ONESIGNAL_APP_AUTH_KEY!, appId: process.env.ONESIGNAL_APP_ID! },
    });
  }

  // Notificar compra de números
  async notifyPurchase(data: {
    email: string;
    phone?: string;
    raffleId: string;
    raffleName: string;
    numbers: number[];
    drawDate: Date;
    transactionHash: string;
  }) {
    // Email
    await this.sendEmail({
      to: data.email,
      subject: `Seus números para ${data.raffleName}`,
      template: 'raffle-purchase',
      data: {
        raffleName: data.raffleName,
        numbers: data.numbers.join(', '),
        drawDate: data.drawDate.toLocaleDateString('pt-BR'),
        verifyUrl: `https://mumbai.polygonscan.com/tx/${data.transactionHash}`,
      },
    });

    // Push notification
    await this.sendPush({
      heading: 'Números comprados!',
      message: `Você tem ${data.numbers.length} números na rifa ${data.raffleName}`,
      url: `/nerd-premiado/${data.raffleId}`,
    });
  }

  // Notificar vencedor (TODOS OS CANAIS)
  async notifyWinner(data: {
    email: string;
    phone: string;
    name: string;
    raffleId: string;
    raffleName: string;
    prizeName: string;
    winnerNumber: number;
    transactionHash: string;
  }) {
    // 1. Email
    await this.sendEmail({
      to: data.email,
      subject: `🎉 VOCÊ GANHOU: ${data.prizeName}!`,
      template: 'raffle-winner',
      data: {
        name: data.name,
        raffleName: data.raffleName,
        prizeName: data.prizeName,
        winnerNumber: data.winnerNumber,
        verifyUrl: `https://mumbai.polygonscan.com/tx/${data.transactionHash}`,
        claimUrl: `https://usenerd.com/nerd-premiado/${data.raffleId}/claim`,
      },
    });

    // 2. SMS
    await this.sendSMS({
      to: data.phone,
      message: `🎉 PARABÉNS ${data.name}! Você ganhou ${data.prizeName} na rifa ${data.raffleName}! Número vencedor: ${data.winnerNumber}. Acesse: usenerd.com/nerd-premiado`,
    });

    // 3. Push Web
    await this.sendPush({
      heading: '🎉 VOCÊ GANHOU!',
      message: `Parabéns! Você é o vencedor de ${data.prizeName}`,
      url: `/nerd-premiado/${data.raffleId}/claim`,
    });

    // 4. WhatsApp
    await this.sendWhatsApp({
      to: data.phone,
      template: 'winner_notification',
      params: [data.name, data.prizeName, data.raffleName, data.winnerNumber.toString()],
    });
  }

  private async sendEmail(data: any) {
    await this.sendgrid.send({
      from: 'noreply@usenerd.com',
      to: data.to,
      subject: data.subject,
      templateId: process.env[`SENDGRID_TEMPLATE_${data.template.toUpperCase()}`],
      dynamicTemplateData: data.data,
    });
  }

  private async sendSMS(data: { to: string; message: string }) {
    await this.twilio.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: data.to,
      body: data.message,
    });
  }

  private async sendPush(data: { heading: string; message: string; url: string }) {
    await this.onesignal.createNotification({
      headings: { en: data.heading },
      contents: { en: data.message },
      url: data.url,
      included_segments: ['All'],
    });
  }

  private async sendWhatsApp(data: { to: string; template: string; params: string[] }) {
    await this.twilio.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${data.to}`,
      body: this.buildWhatsAppMessage(data.template, data.params),
    });
  }

  private buildWhatsAppMessage(template: string, params: string[]): string {
    const templates = {
      winner_notification: `🎉 *PARABÉNS ${params[0]}!*\n\nVocê é o grande vencedor de *${params[1]}* na rifa *${params[2]}*!\n\nNúmero vencedor: *${params[3]}*\n\nVerifique na blockchain: https://usenerd.com/nerd-premiado\n\n_Mensagem automática - USE Nerd_`,
    };

    return templates[template as keyof typeof templates] || '';
  }
}
```

**Variáveis de Ambiente**:
```env
# SendGrid (Email)
SENDGRID_API_KEY=SG.xxx
SENDGRID_TEMPLATE_RAFFLE_PURCHASE=d-xxx
SENDGRID_TEMPLATE_RAFFLE_WINNER=d-xxx

# Twilio (SMS + WhatsApp)
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+5511999999999
TWILIO_WHATSAPP_NUMBER=+14155238886

# OneSignal (Push)
ONESIGNAL_APP_ID=xxx
ONESIGNAL_USER_AUTH_KEY=xxx
ONESIGNAL_APP_AUTH_KEY=xxx
```

---

## 🗺️ ROADMAP DE DESENVOLVIMENTO

### SPRINT 1: Fundação Blockchain (Semana 1)
**Duração**: 5 dias úteis
**Agente Principal**: backend-developer

#### Dia 1-2: Smart Contract + Deploy
- [ ] Criar `NerdPremiadoRaffle.sol` com VRF
- [ ] Configurar Hardhat
- [ ] Escrever testes unitários
- [ ] Deploy no Polygon Mumbai
- [ ] Verificar no Polygonscan
- [ ] Configurar Chainlink VRF Subscription

**Entregas**:
- ✅ Contrato deployado
- ✅ Address no `.env`
- ✅ ABI exportada
- ✅ Testes passando (100% coverage)

#### Dia 3-4: Alchemy Integration
- [ ] Instalar Alchemy SDK
- [ ] Criar `AlchemyService`
- [ ] Configurar WebSocket listener
- [ ] Testar RPC calls
- [ ] Configurar enhanced APIs
- [ ] Setup dashboard monitoring

**Entregas**:
- ✅ AlchemyService funcional
- ✅ Event listener ativo
- ✅ Dashboard configurado

#### Dia 5: Blockchain Service
- [ ] Criar `BlockchainService`
- [ ] Método `registerPurchase()`
- [ ] Método `requestDraw()`
- [ ] Método `getTickets()`
- [ ] Testes de integração

**Entregas**:
- ✅ BlockchainService completo
- ✅ Integração com Alchemy
- ✅ Testes passando

---

### SPRINT 2: Backend Integration (Semana 2)
**Duração**: 5 dias úteis
**Agente Principal**: backend-developer + api-architect

#### Dia 6-7: Database Models
- [ ] Criar `RafflePackage` model
- [ ] Criar `RaffleAllocationRule` model
- [ ] Criar `RaffleBlockchainConfig` model
- [ ] Criar `BlockchainBatchConfig` model
- [ ] Criar `BlockchainPendingQueue` model
- [ ] Run migrations

**Entregas**:
- ✅ 5 novos models
- ✅ Migrations aplicadas

#### Dia 8-9: Workflows
- [ ] `purchase-tickets.workflow.ts` (atualizar)
- [ ] `auto-allocate-tickets.workflow.ts` (novo)
- [ ] `execute-draw.workflow.ts`
- [ ] `batch-blockchain-sync.workflow.ts` (novo)

**Entregas**:
- ✅ 4 workflows funcionais
- ✅ Integração com blockchain

#### Dia 10: Subscribers + Jobs
- [ ] `order-placed.subscriber.ts`
- [ ] `payment-confirmed.subscriber.ts`
- [ ] `blockchain-events.subscriber.ts`
- [ ] `blockchain-batch-processor.ts` (cron job)

**Entregas**:
- ✅ 3 subscribers ativos
- ✅ 1 cron job configurado

---

### SPRINT 3: Stripe Payment Integration (Semana 3)
**Duração**: 3 dias úteis
**Agente Principal**: backend-developer

#### Dia 11-12: Stripe Setup
- [ ] Instalar Stripe SDK
- [ ] Criar `StripePaymentService`
- [ ] Configurar PIX
- [ ] Configurar Crypto payments
- [ ] Webhook handler `/api/webhooks/stripe`
- [ ] Testes de pagamento

**Entregas**:
- ✅ Stripe funcionando
- ✅ PIX habilitado
- ✅ Crypto com auto-conversão
- ✅ Webhook validado

#### Dia 13: Integration Testing
- [ ] Testar fluxo completo: Compra → Stripe → Blockchain
- [ ] Testar refunds
- [ ] Testar edge cases

**Entregas**:
- ✅ Testes E2E passando

---

### SPRINT 4: Admin Panel (Semana 3-4)
**Duração**: 4 dias úteis
**Agentes**: backend-developer + react-nextjs-expert

#### Dia 14-15: Admin API Endpoints
- [ ] `POST /admin/raffle`
- [ ] `GET /admin/raffle/:id`
- [ ] `PATCH /admin/raffle/:id`
- [ ] `POST /admin/raffle/:id/publish`
- [ ] `POST /admin/raffle/:id/draw`
- [ ] `GET /admin/raffle/:id/tickets`
- [ ] `POST /admin/raffle/:id/packages`
- [ ] `GET /admin/raffle/settings/blockchain`
- [ ] `PATCH /admin/raffle/settings/blockchain`

**Entregas**:
- ✅ 9 endpoints funcionais
- ✅ Validação Zod
- ✅ Testes de API

#### Dia 16-17: Admin UI (Medusa Admin)
- [ ] Página de listagem de rifas
- [ ] Formulário criar/editar rifa
- [ ] Configurações blockchain
- [ ] Gerenciar pacotes
- [ ] Dashboard de estatísticas

**Entregas**:
- ✅ UI Admin completa
- ✅ Integração com API

---

### SPRINT 5: Frontend Nerd-Premiado (Semana 4-5)
**Duração**: 6 dias úteis
**Agentes**: react-nextjs-expert + tailwind-css-expert

#### Dia 18-19: Página Principal
- [ ] Atualizar `/app/nerd-premiado/page.tsx`
- [ ] Listar rifas ativas
- [ ] Exibir pacotes
- [ ] Badge "Verificado Blockchain"
- [ ] Filtros e busca

**Entregas**:
- ✅ Página lista funcional

#### Dia 20-21: Modal de Compra
- [ ] `RafflePurchaseModal.tsx`
- [ ] Seleção de quantidade ou pacote
- [ ] Preview de preço
- [ ] Integração Stripe Checkout
- [ ] Loading states

**Entregas**:
- ✅ Modal de compra completo

#### Dia 22: Página de Detalhes
- [ ] `/app/nerd-premiado/[id]/page.tsx`
- [ ] Informações do prêmio
- [ ] Meus números
- [ ] Link Polygonscan
- [ ] Countdown para sorteio

**Entregas**:
- ✅ Página detalhes funcional

#### Dia 23: Estilização Cyberpunk
- [ ] Aplicar tema em todos componentes
- [ ] Animações de blockchain
- [ ] Responsive design
- [ ] Loading skeletons

**Entregas**:
- ✅ UI 100% estilizada

---

### SPRINT 6: Notification System (Semana 5)
**Duração**: 3 dias úteis
**Agente Principal**: backend-developer

#### Dia 24-25: NotificationService
- [ ] Integrar SendGrid
- [ ] Integrar Twilio (SMS)
- [ ] Integrar OneSignal (Push)
- [ ] Integrar WhatsApp
- [ ] Templates de email
- [ ] Testes de envio

**Entregas**:
- ✅ 4 canais funcionais
- ✅ Templates prontos

#### Dia 26: Triggers
- [ ] Notificar após compra
- [ ] Notificar após sorteio
- [ ] Notificar vencedor (todos canais)

**Entregas**:
- ✅ Notificações automáticas

---

### SPRINT 7: Testing & QA (Semana 6)
**Duração**: 5 dias úteis
**Agente Principal**: testing-expert

#### Dia 27-28: Unit Tests
- [ ] Smart contract (Hardhat)
- [ ] Backend services
- [ ] Frontend components
- [ ] Coverage > 80%

**Entregas**:
- ✅ Testes unitários completos

#### Dia 29-30: Integration Tests
- [ ] Fluxo compra completo
- [ ] Fluxo sorteio completo
- [ ] Webhooks Stripe
- [ ] Events blockchain

**Entregas**:
- ✅ Testes integração completos

#### Dia 31: E2E Tests
- [ ] Playwright setup
- [ ] Comprar números
- [ ] Ver detalhes
- [ ] Verificar blockchain

**Entregas**:
- ✅ Testes E2E passando

---

### SPRINT 8: Security Audit (Semana 6-7)
**Duração**: 4 dias úteis
**Agente Principal**: security-expert

#### Dia 32-33: Smart Contract Audit
- [ ] Reentrancy check
- [ ] Access control
- [ ] Gas optimization
- [ ] VRF implementation
- [ ] Report de auditoria

**Entregas**:
- ✅ Contrato auditado
- ✅ Vulnerabilidades corrigidas

#### Dia 34-35: Backend Security
- [ ] Private key storage
- [ ] API authentication
- [ ] Webhook validation
- [ ] Rate limiting
- [ ] SQL injection prevention

**Entregas**:
- ✅ Backend seguro
- ✅ Report de segurança

---

### SPRINT 9: Documentation (Semana 7)
**Duração**: 3 dias úteis
**Agente Principal**: documentation-specialist

#### Dia 36-37: Technical Docs
- [ ] Architecture guide (EN/PT-BR)
- [ ] API documentation
- [ ] Smart contract docs
- [ ] Deployment guide
- [ ] Troubleshooting guide

**Entregas**:
- ✅ Docs técnicas completas

#### Dia 38: User Guides
- [ ] Como participar (PT-BR)
- [ ] Como verificar blockchain (PT-BR)
- [ ] FAQ
- [ ] Video tutorials

**Entregas**:
- ✅ Guias de usuário

---

### SPRINT 10: Deploy Production (Semana 8)
**Duração**: 3 dias úteis
**Agentes**: devops-cicd-expert + backend-developer

#### Dia 39: Polygon Mainnet Deploy
- [ ] Criar wallet produção
- [ ] Comprar MATIC
- [ ] Deploy contrato mainnet
- [ ] Verificar Polygonscan
- [ ] Configurar Chainlink VRF mainnet
- [ ] Atualizar `.env` produção

**Entregas**:
- ✅ Contrato em produção

#### Dia 40: Backend Deploy
- [ ] Atualizar variáveis de ambiente
- [ ] Deploy backend
- [ ] Testar integrações
- [ ] Monitorar logs

**Entregas**:
- ✅ Backend em produção

#### Dia 41: Final Testing & Launch
- [ ] Smoke tests produção
- [ ] Load testing
- [ ] Monitorar Alchemy dashboard
- [ ] Anunciar lançamento

**Entregas**:
- ✅ **SISTEMA EM PRODUÇÃO! 🚀**

---

## 📚 DOCUMENTAÇÃO DE APIS

### Admin API Endpoints

#### 1. Criar Rifa
```http
POST /admin/raffle
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Rifa iPhone 15 Pro Max",
  "description": "Concorra a um iPhone 15 Pro Max 256GB",
  "prize_name": "iPhone 15 Pro Max 256GB Titânio",
  "prize_description": "Smartphone Apple com tela de 6.7\", câmera de 48MP...",
  "prize_image_url": "https://...",
  "total_tickets": 10000,
  "price_per_ticket": 5.00,
  "draw_date": "2025-12-31T20:00:00Z",
  "active": true,
  "blockchain_config": {
    "custom_field_enabled": true,
    "custom_field_label": "Observações",
    "custom_field_max_length": 200,
    "include_email": true
  }
}

Response 201:
{
  "id": "raffle_01",
  "name": "Rifa iPhone 15 Pro Max",
  "status": "draft", // 'draft', 'published', 'active', 'drawn'
  "contract_address": null, // Preenche após publish
  "created_at": "2025-11-17T10:00:00Z"
}
```

#### 2. Publicar Rifa (Deploy Blockchain)
```http
POST /admin/raffle/:id/publish
Authorization: Bearer {admin_token}

Response 200:
{
  "id": "raffle_01",
  "status": "published",
  "contract_address": "0x...",
  "transaction_hash": "0x...",
  "published_at": "2025-11-17T11:00:00Z"
}
```

#### 3. Criar Pacote
```http
POST /admin/raffle/:id/packages
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "Pacote VIP",
  "quantity": 100,
  "price": 350.00,
  "original_price": 500.00,
  "stock": 50
}

Response 201:
{
  "id": "pkg_01",
  "discount_percentage": 30
}
```

#### 4. Configurar Blockchain Settings
```http
PATCH /admin/raffle/settings/blockchain
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "mode": "batch", // 'immediate' | 'batch'
  "batch_size": 50,
  "batch_interval_minutes": 15
}

Response 200:
{
  "mode": "batch",
  "batch_size": 50,
  "batch_interval_minutes": 15,
  "pending_count": 0
}
```

#### 5. Realizar Sorteio
```http
POST /admin/raffle/:id/draw
Authorization: Bearer {admin_token}

Response 200:
{
  "raffle_id": "raffle_01",
  "vrf_request_id": "0x...",
  "status": "drawing", // Aguardando VRF callback
  "estimated_completion": "2025-11-17T12:05:00Z" // ~3-5 minutos
}

// Webhook callback quando VRF completar:
POST /api/webhooks/chainlink-vrf
{
  "raffle_id": "raffle_01",
  "winner_number": 4567,
  "transaction_hash": "0x...",
  "winner_user_id": "cus_123",
  "winner_email": "vencedor@email.com"
}
```

---

### Store API Endpoints (Frontend)

#### 1. Listar Rifas Ativas
```http
GET /store/raffle?status=active&limit=10

Response 200:
{
  "raffles": [
    {
      "id": "raffle_01",
      "name": "Rifa iPhone 15 Pro Max",
      "prize_name": "iPhone 15 Pro Max 256GB",
      "prize_image_url": "https://...",
      "total_tickets": 10000,
      "sold_tickets": 4567,
      "price_per_ticket": 5.00,
      "draw_date": "2025-12-31T20:00:00Z",
      "contract_address": "0x...",
      "verified_blockchain": true,
      "packages": [
        {
          "id": "pkg_01",
          "name": "Pacote VIP",
          "quantity": 100,
          "price": 350.00,
          "discount": 30
        }
      ]
    }
  ],
  "count": 1,
  "limit": 10,
  "offset": 0
}
```

#### 2. Criar Checkout Session (Comprar Números)
```http
POST /store/raffle/:id/checkout
Content-Type: application/json

{
  "quantity": 10, // OU
  "package_id": "pkg_01", // Comprar pacote
  "customer_id": "cus_123"
}

Response 200:
{
  "checkout_session_id": "cs_...",
  "stripe_url": "https://checkout.stripe.com/c/pay/cs_..."
}

// Frontend:
window.location.href = response.stripe_url;
```

#### 3. Meus Números
```http
GET /store/raffle/:id/my-tickets?customer_id=cus_123

Response 200:
{
  "raffle_id": "raffle_01",
  "my_tickets": [
    {
      "id": "ticket_01",
      "numbers": [1, 42, 567, 8901, 9999],
      "purchased_at": "2025-11-17T10:30:00Z",
      "transaction_hash": "0x...",
      "verified_blockchain": true
    }
  ],
  "total_numbers": 5
}
```

#### 4. Verificar Ticket Blockchain
```http
GET /store/raffle/:id/verify/:ticket_id

Response 200:
{
  "ticket_id": "ticket_01",
  "blockchain_data": {
    "transaction_hash": "0x...",
    "block_number": 12345678,
    "timestamp": "2025-11-17T10:30:15Z",
    "gas_used": "0.000021 MATIC",
    "numbers": [1, 42, 567, 8901, 9999],
    "custom_data": "Compra verificada",
    "polygonscan_url": "https://mumbai.polygonscan.com/tx/0x..."
  },
  "verified": true
}
```

---

## ⚙️ CONFIGURAÇÕES E VARIÁVEIS

### `.env` Completo

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL=postgres://postgres:postgres@localhost:5432/use-nerd
REDIS_URL=redis://localhost:6379

# ============================================
# MEDUSA
# ============================================
MEDUSA_BACKEND_URL=http://localhost:9000
MEDUSA_ADMIN_URL=http://localhost:9000/app
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret

# ============================================
# FRONTEND
# ============================================
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# ============================================
# BLOCKCHAIN - ALCHEMY
# ============================================
ALCHEMY_API_KEY=your-alchemy-api-key
ALCHEMY_POLYGON_MUMBAI_URL=https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}
ALCHEMY_POLYGON_MAINNET_URL=https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}
ALCHEMY_POLYGON_WSS_URL=wss://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}

# Use Mumbai para desenvolvimento, Mainnet para produção
POLYGON_RPC_URL=${ALCHEMY_POLYGON_MUMBAI_URL}
POLYGON_WSS_URL=${ALCHEMY_POLYGON_WSS_URL}
POLYGON_NETWORK=mumbai # ou 'mainnet'

# Wallet (NUNCA COMMITAR!)
POLYGON_PRIVATE_KEY=0x... # Wallet privada para assinar transações

# ============================================
# SMART CONTRACT
# ============================================
RAFFLE_CONTRACT_ADDRESS=0x... # Preencher após deploy

# ============================================
# CHAINLINK VRF
# ============================================
CHAINLINK_VRF_COORDINATOR=0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed # Mumbai
CHAINLINK_VRF_KEY_HASH=0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f
CHAINLINK_VRF_SUBSCRIPTION_ID=123 # Criar no vrf.chain.link
CHAINLINK_VRF_CALLBACK_GAS_LIMIT=200000
CHAINLINK_VRF_REQUEST_CONFIRMATIONS=3

# ============================================
# STRIPE PAYMENT
# ============================================
STRIPE_SECRET_KEY=sk_test_... # ou sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_test_... # ou pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PIX_ENABLED=true
STRIPE_CRYPTO_ENABLED=true
STRIPE_CRYPTO_AUTO_CONVERT=true

# ============================================
# NOTIFICATIONS - SENDGRID (Email)
# ============================================
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@usenerd.com
SENDGRID_FROM_NAME=USE Nerd
SENDGRID_TEMPLATE_RAFFLE_PURCHASE=d-xxx
SENDGRID_TEMPLATE_RAFFLE_WINNER=d-xxx

# ============================================
# NOTIFICATIONS - TWILIO (SMS + WhatsApp)
# ============================================
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+5511999999999
TWILIO_WHATSAPP_NUMBER=+14155238886

# ============================================
# NOTIFICATIONS - ONESIGNAL (Push Web)
# ============================================
ONESIGNAL_APP_ID=xxx
ONESIGNAL_USER_AUTH_KEY=xxx
ONESIGNAL_APP_AUTH_KEY=xxx

# ============================================
# BATCH PROCESSING
# ============================================
BLOCKCHAIN_BATCH_ENABLED=true # false = imediato
BLOCKCHAIN_BATCH_SIZE=50
BLOCKCHAIN_BATCH_INTERVAL_MINUTES=15

# ============================================
# MONITORING & LOGS
# ============================================
LOG_LEVEL=info # debug, info, warn, error
SENTRY_DSN=https://... # Opcional
```

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### Para o Cliente (Você):

1. **✅ Criar conta Alchemy**
   - Acessar: https://www.alchemy.com/
   - Criar app Polygon Mumbai
   - Copiar API Key

2. **✅ Criar wallet Polygon**
   - Instalar Metamask
   - Criar nova wallet
   - Guardar seed phrase (seguro!)
   - Exportar private key (para POLYGON_PRIVATE_KEY)

3. **✅ Conseguir test MATIC**
   - Faucet: https://faucet.polygon.technology/
   - Enviar para sua wallet

4. **✅ Configurar Stripe**
   - Conta: https://dashboard.stripe.com/
   - Ativar PIX (Brasil)
   - Ativar Crypto payments
   - Copiar API keys

5. **✅ Criar Chainlink VRF Subscription**
   - https://vrf.chain.link/mumbai
   - Adicionar 5 LINK (faucet: https://faucets.chain.link/mumbai)

6. **✅ Aprovar este plano**
   - Revisar roadmap
   - Confirmar tecnologias
   - Autorizar início

---

### Para o Time de Desenvolvimento:

**Aguardando**:
- [ ] Aprovação do plano pelo cliente
- [ ] Alchemy API Key
- [ ] Wallet private key
- [ ] Stripe API keys
- [ ] Chainlink VRF Subscription ID

**Após receber configurações**:
- [ ] **Começar Sprint 1 - Dia 1**: Criar smart contract
- [ ] Deploy testnet em 2 dias
- [ ] Integração Alchemy em 4 dias
- [ ] **Meta**: Sistema funcional em testnet em 2 semanas

---

## 📊 ESTIMATIVAS FINAIS

| Item | Estimativa | Status |
|------|-----------|--------|
| **Desenvolvimento Total** | 41 dias úteis | ⏳ Aguardando aprovação |
| **Sprint 1-3** (Core) | 13 dias | 🔴 Crítico |
| **Sprint 4-7** (Features) | 18 dias | 🟡 Importante |
| **Sprint 8-10** (QA + Deploy) | 10 dias | 🟢 Finalização |
| **Testnet → Mainnet** | 3 dias | 🔵 Produção |

**Data de Lançamento Estimada**: ~8 semanas após aprovação

---

## ✅ CHECKLIST DE APROVAÇÃO

Antes de começar, confirme:

- [ ] Li e entendi todo o plano
- [ ] Concordo com as tecnologias escolhidas (Alchemy, Stripe, Chainlink VRF)
- [ ] Tenho budget para:
  - [ ] Alchemy (gratuito até 300M requests/mês)
  - [ ] Stripe (2.9% + R$ 0.30 por transação)
  - [ ] Chainlink VRF (~$0.25 por sorteio)
  - [ ] Gas fees Polygon (~$0.01 por registro)
  - [ ] MATIC para wallet backend (~$50 inicial)
  - [ ] LINK tokens (~$50 inicial)
- [ ] Aprovar roadmap de 8 semanas
- [ ] Fornecer credenciais necessárias
- [ ] **AUTORIZO INÍCIO DO DESENVOLVIMENTO**

---

**Plano criado por**: Claude Code AI Development Team
**Data**: 17 de Novembro de 2025
**Versão**: 2.0 (Final)
**Status**: ✅ COMPLETO - AGUARDANDO APROVAÇÃO

---

**🚀 PRONTO PARA COMEÇAR ASSIM QUE VOCÊ APROVAR! 🚀**
