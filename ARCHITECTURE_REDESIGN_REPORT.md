# 🏗️ Relatório de Redesign Arquitetural - USE Nerd Platform

**Data**: 11/11/2025
**Autor**: Tech Lead Orchestrator
**Status**: ✅ Análise Completa

---

## SUMÁRIO EXECUTIVO

### Mudança Principal Solicitada

**ANTES (Planejado - NÃO implementado):**
```
Usuário → Conecta MetaMask → Paga com carteira Web3 própria
```

**DEPOIS (Novo Modelo):**
```
Usuário → Escolhe "Pagar com Cripto" → Gateway (Coinbase/BitPay)
Usuário → NÃO conecta carteira → Paga como PIX/Cartão
```

**Blockchain:**
- ✅ Registra rifas (auditoria pública)
- ✅ Registra tickets + order_id + customer_id
- ✅ Sorteia com Chainlink VRF (provably fair)
- ❌ NÃO gerencia pagamentos

---

## 📋 ANÁLISE DA ARQUITETURA ATUAL

### ✅ Pontos Fortes (Pode Reaproveitar)

1. **Módulo Raffle (90% pronto)**
   - Modelos bem definidos
   - CRUD funcionando
   - API endpoints completos
   - Testes: 75% cobertura

2. **Módulo Brazil (70% pronto)**
   - PIX payments estruturado
   - NFe e shipping prontos
   - Validações BR completas

3. **Frontend (80% pronto)**
   - Checkout multi-step
   - Integração Medusa OK
   - UI cyberpunk
   - Páginas de rifas prontas

4. **Infraestrutura**
   - Docker funcionando
   - PostgreSQL + Redis OK
   - Hardhat configurado

### ❌ Pontos Fracos (Precisa Mudar)

1. **Web3 Wallet Dependency** ⚠️ CRÍTICO
   ```typescript
   // ❌ WalletConnect.tsx força usuário a conectar MetaMask
   // ❌ Todo código assume carteira Web3 do usuário
   ```

2. **Raffle Model - Campos Faltando**
   - Sem `product_type` (car, computer, electronics)
   - Sem `product_specifications` (JSON flexível)
   - Sem campos para fornecedores/patrocinadores

3. **Pagamentos Cripto NÃO Implementados**
   - Nenhum gateway configurado
   - Sem Coinbase Commerce
   - Sem BitPay

4. **Smart Contracts NÃO Existem**
   - Diretório `contracts/` vazio
   - Nenhum contrato Solidity

5. **Chainlink VRF NÃO Integrado**
   - Dependência instalada
   - Código não usa VRF

---

## 🏗️ NOVA ARQUITETURA PROPOSTA

### Diagrama Simplificado

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│                                                               │
│  Usuário escolhe: PIX | Cartão | Criptomoeda                │
│                        │                                      │
└────────────────────────┼──────────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────────┐
│                  MEDUSA BACKEND                               │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │   Orders     │  │   Payments   │  │    Raffle       │    │
│  │              │  │   - PIX      │  │                 │    │
│  │              │  │   - Cartão   │  │                 │    │
│  │              │  │   - Crypto   │  │                 │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘    │
│         │                 │                    │              │
│         └─────────────────┴────────────────────┘              │
│                           │                                   │
│                  ┌────────▼─────────┐                        │
│                  │  Blockchain      │                        │
│                  │  Registry        │                        │
│                  │  Service         │                        │
│                  └────────┬─────────┘                        │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│              POLYGON BLOCKCHAIN                               │
│                                                                │
│  RaffleRegistry.sol:                                          │
│  - Registra rifas                                             │
│  - Registra tickets (com order_id + customer_id)             │
│  - Sorteia com Chainlink VRF                                 │
│  - Auditoria pública                                          │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│            CRYPTO PAYMENT GATEWAYS                            │
│                                                                │
│   Coinbase Commerce | BitPay | CoinPayments                  │
│   BTC, ETH, USDC → Webhook → Medusa                          │
└───────────────────────────────────────────────────────────────┘
```

### Fluxo Completo: Compra com Cripto

```
1. Usuário seleciona rifa → Adiciona tickets ao carrinho
2. Vai para checkout → Preenche dados (nome, email, CPF)
3. Escolhe "Pagar com Criptomoeda" → Seleciona moeda (BTC/ETH/USDC)
4. Medusa cria charge no Coinbase Commerce
5. Frontend redireciona para Coinbase → Usuário paga com carteira externa
6. Coinbase detecta pagamento → Envia webhook para Medusa
7. Medusa marca order como "paid" → Emite evento "order.placed"
8. BlockchainRegistryService registra tickets on-chain
9. Smart contract emite evento "TicketsRegistered"
10. Frontend mostra confirmação + link PolygonScan
```

### Fluxo de Sorteio

```
1. Admin clica "Iniciar Sorteio" no Medusa Admin
2. RaffleService valida (rifa ativa, tem tickets, data OK)
3. BlockchainRegistryService chama smart contract
4. Smart contract solicita Chainlink VRF
5. Chainlink retorna número aleatório on-chain
6. Smart contract calcula ticket vencedor
7. Smart contract emite evento "WinnerDrawn"
8. BlockchainRegistryService escuta evento → Atualiza banco
9. RaffleService completa sorteio → Notifica vencedor
10. Frontend atualiza rifa com vencedor + TX blockchain
```

---

## 📅 PLANO DE IMPLEMENTAÇÃO (6 FASES)

### Fase 1: Crypto Payment Gateway ⚠️ ALTA
**Tempo**: 3-5 dias
**O que fazer**:
- Instalar SDK Coinbase Commerce
- Criar `CryptoPaymentModule`
- Modelo `CryptoPayment`
- Service `CoinbaseCommerceService`
- API `/store/crypto/create` e `/webhooks/coinbase`
- Subscriber `handle-crypto-paid`

**Resultado**: Usuário pode pagar com Bitcoin, Ethereum, USDC

---

### Fase 2: Blockchain Registry Service ⚠️ ALTA
**Tempo**: 4-6 dias
**O que fazer**:
- Criar `BlockchainModule`
- Service `BlockchainRegistryService` (ethers.js)
- Subscribers para eventos Medusa
- Integração com smart contract

**Resultado**: Backend registra rifas e tickets on-chain

---

### Fase 3: Smart Contracts ⚠️ ALTA
**Tempo**: 5-7 dias
**O que fazer**:
- Desenvolver `RaffleRegistry.sol`
- Integrar Chainlink VRF
- Testes com Hardhat
- Deploy em Mumbai testnet
- Deploy em Polygon mainnet

**Resultado**: Smart contract funcionando com VRF

---

### Fase 4: Modelo de Produtos 📦 MÉDIA
**Tempo**: 2-3 dias
**O que fazer**:
- Adicionar campos ao `Raffle` model:
  - `product_type` (car, computer, electronics)
  - `product_specifications` (JSON)
  - `supplier_name`, `delivery_type`
- DTOs para cada tipo de produto
- Validações específicas

**Resultado**: Suporte a carros, computadores, eletrônicos

---

### Fase 5: Frontend - Remove Wallet 🎨 MÉDIA
**Tempo**: 1-2 dias
**O que fazer**:
- Deletar `WalletConnect.tsx`
- Simplificar `web3-client.ts` (apenas leitura)
- Adicionar opção "Criptomoeda" no checkout
- Criar página de auditoria blockchain

**Resultado**: Frontend sem MetaMask, apenas auditoria

---

### Fase 6: Testes e QA ✅ ALTA
**Tempo**: 3-4 dias
**O que fazer**:
- Testes unitários (90% cobertura)
- Testes de integração
- Testes E2E (Playwright)
- QA manual completo

**Resultado**: Sistema testado e pronto para produção

---

## ⏱️ ESTIMATIVAS

| Fase | Tempo | Prioridade |
|------|-------|-----------|
| Fase 1: Crypto Gateway | 3-5 dias | ⚠️ Alta |
| Fase 2: Blockchain Service | 4-6 dias | ⚠️ Alta |
| Fase 3: Smart Contracts | 5-7 dias | ⚠️ Alta |
| Fase 4: Modelo Produtos | 2-3 dias | 📦 Média |
| Fase 5: Remove Wallet | 1-2 dias | 🎨 Média |
| Fase 6: Testes e QA | 3-4 dias | ✅ Alta |
| **TOTAL** | **18-27 dias** | |

**Estimativa Realista**: 4-5 semanas (1 dev full-time)

---

## 📦 PRODUTOS SUPORTADOS

### Tipos de Produtos nas Rifas

**1. Computadores** 🖥️
```typescript
{
  type: 'computer',
  specifications: {
    brand: 'Apple',
    model: 'MacBook Pro 16"',
    processor: 'M3 Pro',
    ram: '18GB',
    storage: '512GB SSD',
    gpu: '18-core GPU'
  }
}
```

**2. Carros** 🚗
```typescript
{
  type: 'car',
  specifications: {
    brand: 'Volkswagen',
    model: 'Gol 1.0',
    year: 2024,
    color: 'Branco',
    fuelType: 'Flex',
    mileage: 0,
    transmission: 'Manual',
    hasDocumentation: true
  }
}
```

**3. Eletrônicos** 📱
```typescript
{
  type: 'electronics',
  specifications: {
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    storage: '256GB',
    color: 'Titânio Natural'
  }
}
```

**4. Prêmio em Dinheiro** 💰
```typescript
{
  type: 'cash',
  specifications: {
    amount: 5000000, // R$ 50.000,00
    currency: 'BRL',
    paymentMethod: 'PIX'
  }
}
```

**5. Viagens** ✈️
```typescript
{
  type: 'travel',
  specifications: {
    destination: 'Orlando, EUA',
    duration_days: 7,
    includes: ['Passagens', 'Hotel 5*', 'Ingressos Disney'],
    people_count: 4
  }
}
```

---

## 🔑 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

### Backend (.env)
```bash
# Crypto Payment
COINBASE_API_KEY=your_api_key
COINBASE_WEBHOOK_SECRET=your_secret

# Blockchain
POLYGON_RPC_URL=https://polygon-rpc.com
BACKEND_PRIVATE_KEY=0x...  # ⚠️ NUNCA COMMITAR
RAFFLE_REGISTRY_ADDRESS=0x...

# Chainlink VRF
CHAINLINK_VRF_COORDINATOR=0xAE975071Be8F8eE67addBC1A82488F1C24858067
CHAINLINK_KEY_HASH=0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd
CHAINLINK_SUBSCRIPTION_ID=1
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_RAFFLE_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
```

---

## 🚨 RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Chainlink VRF falhar | Baixa | Alto | Fallback com backup oracle |
| Gateway crypto instável | Média | Médio | Suportar múltiplos (Coinbase + BitPay) |
| Smart contract bug | Média | Muito Alto | Auditoria + testes + deploy gradual |
| Webhook não recebido | Média | Alto | Retry + polling manual |

---

## 💰 CUSTOS ESTIMADOS

### Blockchain
- Deploy contratos: ~$5-10 USD em MATIC
- Chainlink VRF: ~2 LINK por sorteio (~$20 USD)
- Transações on-chain: ~$0.01 cada

### Payment Gateways
- **Coinbase Commerce**: 1% por transação
- **BitPay**: 0.5% por transação
- **CoinPayments**: 0.5% + taxa de rede

**Recomendação**: Começar com Coinbase Commerce (mais fácil)

---

## 📂 ARQUIVOS A CRIAR

### Backend (14 arquivos)
```
src/modules/crypto-payment/
├── models/crypto-payment.ts
├── services/coinbase-commerce.ts
├── api/store/crypto/create/route.ts
├── api/webhooks/coinbase/route.ts
└── subscribers/handle-crypto-paid.ts

src/modules/blockchain/
├── services/blockchain-registry.ts
├── services/polygon-provider.ts
├── subscribers/handle-raffle-created.ts
├── subscribers/handle-ticket-purchased.ts
├── subscribers/handle-draw-winner.ts
└── contracts/
    ├── abis/RaffleRegistry.json
    └── addresses.ts
```

### Smart Contracts (4 arquivos)
```
contracts/
├── RaffleRegistry.sol
└── mocks/MockVRFCoordinator.sol

scripts/
└── deploy-raffle-registry.ts

tests/contracts/
└── RaffleRegistry.spec.ts
```

### Frontend (3 arquivos)
```
storefront/
├── lib/web3-client.ts  (simplificar)
├── app/raffle/[id]/audit/page.tsx
└── components/CryptoPaymentOption.tsx
```

### Arquivos a DELETAR
```
❌ storefront/components/WalletConnect.tsx
```

---

## ✅ CHECKLIST DE MIGRAÇÃO

### Preparação
- [ ] Criar conta Coinbase Commerce
- [ ] Criar Chainlink VRF Subscription
- [ ] Obter MATIC para deploy (~$10 USD)
- [ ] Configurar .env com API keys

### Backend
- [ ] Instalar SDK: `npm install coinbase-commerce-node`
- [ ] Criar CryptoPaymentModule
- [ ] Criar BlockchainModule
- [ ] Atualizar Raffle model com novos campos
- [ ] Escrever testes unitários

### Smart Contracts
- [ ] Desenvolver RaffleRegistry.sol
- [ ] Testes Hardhat (>90% cobertura)
- [ ] Deploy em Mumbai testnet
- [ ] Testar no testnet
- [ ] Deploy em Polygon mainnet

### Frontend
- [ ] Remover WalletConnect.tsx
- [ ] Simplificar web3-client.ts
- [ ] Adicionar opção Crypto no checkout
- [ ] Criar página de auditoria
- [ ] Testes E2E

### QA
- [ ] Testar compra com Bitcoin
- [ ] Testar compra com USDC
- [ ] Testar sorteio VRF
- [ ] Testar auditoria blockchain
- [ ] Testar em mobile

---

## 🎯 ORDEM DE EXECUÇÃO RECOMENDADA

### Sprint 1 (Semana 1-2)
1. ✅ Fase 1: Crypto Payment Gateway
2. ✅ Fase 4: Modelo de Produtos
3. ✅ Fase 5: Remove Wallet

**Resultado**: Pagamentos cripto funcionando, sem MetaMask

### Sprint 2 (Semana 2-3)
4. ✅ Fase 3: Smart Contracts
5. ✅ Deploy testnet
6. ✅ Testes no testnet

**Resultado**: Smart contract funcionando no testnet

### Sprint 3 (Semana 3-4)
7. ✅ Fase 2: Blockchain Registry Service
8. ✅ Integração Backend ↔ Blockchain
9. ✅ Testes unitários

**Resultado**: Backend registrando on-chain

### Sprint 4 (Semana 4-5)
10. ✅ Deploy mainnet
11. ✅ Fase 6: Testes E2E + QA
12. ✅ Documentação

**Resultado**: Sistema completo em produção

---

## 📚 DOCUMENTAÇÃO TÉCNICA COMPLETA

### Smart Contract Specification

**RaffleRegistry.sol**
```solidity
// Principais funções:
createRaffle(raffleId, productName, totalTickets, ticketPrice, drawDate)
registerTickets(raffleId, ticketNumbers[], userId, orderId)
drawWinner(raffleId) → Chainlink VRF
getRaffleInfo(raffleId) → Raffle data
getTicketInfo(raffleId, ticketNumber) → Ticket owner
```

**Eventos**:
- `RaffleCreated(raffleId, productName, totalTickets)`
- `TicketsRegistered(raffleId, ticketNumbers, userId, orderId)`
- `RandomnessRequested(raffleId, requestId)`
- `WinnerDrawn(raffleId, winnerTicketNumber, timestamp)`

### API Endpoints

**Crypto Payment**
```
POST /store/crypto/create
Body: { order_id, amount }
Response: { payment_url, payment_id, expires_at }

POST /webhooks/coinbase
Body: Coinbase webhook event
Response: 200 OK
```

**Blockchain Audit**
```
GET /store/raffle/:id/blockchain-info
Response: { verified, onChainData, transactionHash }

GET /store/raffle/:id/ticket/:number/verify
Response: { verified, owner, orderId }
```

---

## 🎉 RESULTADO FINAL

Após implementar todas as fases, você terá:

✅ **Pagamentos em Cripto SEM Wallet**
- Usuário paga como PIX/Cartão
- Suporta Bitcoin, Ethereum, USDC, USDT
- Processo simples e amigável

✅ **Blockchain para Auditoria**
- Rifas registradas on-chain
- Tickets com order_id + customer_id
- Sorteio provably fair (Chainlink VRF)
- Auditoria pública 100% transparente

✅ **Produtos de Alto Valor**
- Carros, computadores, eletrônicos
- Especificações detalhadas
- Fornecedores/patrocinadores
- Prêmios em dinheiro

✅ **Sistema Profissional**
- Testes automatizados (>90%)
- Documentação completa
- Código modular
- Escalável e mantenível

---

**Criado em**: 11/11/2025
**Autor**: Tech Lead Orchestrator
**Status**: ✅ Plano Aprovado
**Próximo Passo**: Escolher qual fase começar
