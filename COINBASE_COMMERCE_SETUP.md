# 🔐 Coinbase Commerce Setup Guide

**Phase 1: Cryptocurrency Payment Gateway Integration**

Este guia mostra como configurar o Coinbase Commerce para aceitar pagamentos em criptomoedas na plataforma USE Nerd.

---

## 📋 O que é Coinbase Commerce?

Coinbase Commerce é um gateway de pagamento que permite que seus clientes paguem com criptomoedas **sem que você precise gerenciar carteiras ou chaves privadas**.

### Vantagens:
- ✅ **Fácil para usuários**: Não precisam conectar carteiras, processo similar a PIX/cartão
- ✅ **Múltiplas cryptos**: Bitcoin, Ethereum, USDT, USDC, DAI, Litecoin, Bitcoin Cash, Polygon (MATIC), Dogecoin
- ✅ **Seguro**: Coinbase gerencia toda segurança
- ✅ **Gratuito para começar**: Sem taxa mensal, apenas taxa de transação
- ✅ **Conversão automática**: Pode converter crypto para fiat automaticamente
- ✅ **Webhooks**: Notificações em tempo real de pagamentos confirmados

### Custos:
- **Taxa de transação**: ~1% por transação
- **Sem taxa mensal**
- **Sem setup fee**

---

## 🚀 Passo 1: Criar Conta no Coinbase Commerce

### 1.1 Acessar o Site

Ir para: https://commerce.coinbase.com/

### 1.2 Criar Conta

1. Clicar em **"Get Started"** ou **"Sign Up"**
2. Preencher:
   - Nome
   - Email
   - Senha forte
3. Verificar email

### 1.3 Completar Verificação

1. Login no dashboard
2. Completar perfil da empresa:
   - Nome da empresa: **USE Nerd**
   - Tipo de negócio: **E-commerce / Raffles**
   - País: **Brasil**
   - Website: Seu domínio
3. Verificar identidade (pode requerer documentos)

---

## 🔑 Passo 2: Obter API Keys

### 2.1 Acessar Settings

No dashboard do Coinbase Commerce:

1. Clicar em **Settings** (engrenagem no canto superior direito)
2. Ir para **API Keys**

### 2.2 Criar API Key

1. Clicar em **"Create an API Key"**
2. Dar um nome: **"USE Nerd Backend"**
3. **COPIAR A API KEY IMEDIATAMENTE**
   - ⚠️ **IMPORTANTE**: A key só é mostrada uma vez!
   - Salvar em local seguro (1Password, etc.)

Exemplo de API key:
```
00000000-0000-0000-0000-000000000000
```

### 2.3 Obter Webhook Secret

Na mesma página (Settings → API Keys):

1. Rolar até **"Webhook subscriptions"**
2. Ver o **"Webhook shared secret"**
3. **COPIAR O SECRET**

Exemplo de webhook secret:
```
whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🔧 Passo 3: Configurar Backend (Medusa)

### 3.1 Adicionar ao `.env`

Editar arquivo `.env` na raiz do projeto:

```bash
# Coinbase Commerce Configuration (Phase 1)
COINBASE_COMMERCE_API_KEY=00000000-0000-0000-0000-000000000000
COINBASE_COMMERCE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **NUNCA** commitar o arquivo `.env` no git!

### 3.2 Verificar Módulo Registrado

O módulo `crypto-payment` já está configurado no código. Verificar que o arquivo existe:

```
src/modules/crypto-payment/index.ts
```

### 3.3 Reiniciar Backend

```bash
docker-compose restart medusa-backend
```

Ou se estiver rodando localmente:

```bash
npm run dev
```

### 3.4 Verificar Logs

Procurar no log do backend:

```
✅ Coinbase Commerce client initialized
```

Se ver:
```
⚠️  Coinbase Commerce credentials not configured
```

Significa que as variáveis de ambiente não foram carregadas. Verificar `.env` e reiniciar.

---

## 🌐 Passo 4: Configurar Webhook URL

### 4.1 Determinar URL do Webhook

Sua URL de webhook será:

**Desenvolvimento (local + ngrok)**:
```
https://your-ngrok-url.ngrok.io/crypto-payments/webhooks/coinbase
```

**Produção**:
```
https://api.usenerd.com.br/crypto-payments/webhooks/coinbase
```

### 4.2 Configurar no Coinbase Commerce

1. Ir para **Settings → Webhook subscriptions**
2. Clicar em **"Add an endpoint"**
3. Preencher:
   - **Endpoint URL**: Sua URL de webhook
   - **Description**: "USE Nerd Production Webhook" (ou "Dev Webhook")
4. Selecionar eventos:
   - ☑️ `charge:created`
   - ☑️ `charge:pending`
   - ☑️ `charge:confirmed` (MAIS IMPORTANTE)
   - ☑️ `charge:failed`
   - ☑️ `charge:delayed`
5. Clicar em **"Add endpoint"**

### 4.3 Testar Webhook (Opcional)

Coinbase Commerce permite enviar webhooks de teste:

1. Na lista de endpoints, clicar no seu endpoint
2. Clicar em **"Send test webhook"**
3. Verificar logs do backend para confirmar recebimento

---

## 🧪 Passo 5: Testar em Desenvolvimento Local

### 5.1 Instalar ngrok (se ainda não tem)

ngrok permite expor seu localhost para internet (necessário para webhooks).

**Instalar**:
```bash
# Windows (via Chocolatey)
choco install ngrok

# Mac (via Homebrew)
brew install ngrok

# Linux (via snap)
snap install ngrok
```

**Ou baixar**: https://ngrok.com/download

### 5.2 Autenticar ngrok

1. Criar conta gratuita em https://ngrok.com/
2. Pegar authtoken no dashboard
3. Autenticar:

```bash
ngrok authtoken YOUR_AUTH_TOKEN
```

### 5.3 Iniciar ngrok

Expor a porta do backend (default 9000):

```bash
ngrok http 9000
```

Output exemplo:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:9000
```

Copiar a URL do ngrok (ex: `https://abc123.ngrok.io`)

### 5.4 Configurar Webhook no Coinbase

Seguir **Passo 4.2** usando a URL do ngrok:

```
https://abc123.ngrok.io/crypto-payments/webhooks/coinbase
```

### 5.5 Criar Pagamento de Teste

Via Postman ou curl:

```bash
POST http://localhost:9000/admin/crypto-payments

{
  "order_id": "test_order_123",
  "amount_cents": 1000,
  "description": "Teste de pagamento cripto",
  "customer_email": "teste@email.com",
  "customer_name": "João Teste"
}
```

**Resposta esperada**:
```json
{
  "payment": {
    "id": "crypto_payment_...",
    "order_id": "test_order_123",
    "provider_checkout_url": "https://commerce.coinbase.com/charges/ABC123",
    "status": "pending",
    ...
  }
}
```

### 5.6 Testar Pagamento

1. Copiar `provider_checkout_url` da resposta
2. Abrir no navegador
3. Selecionar uma crypto (ex: **Bitcoin** ou **USDT**)
4. **NÃO PRECISA PAGAR DE VERDADE**
5. No dashboard do Coinbase Commerce, você pode simular pagamentos:
   - Settings → Sandbox mode (se disponível)
   - Ou usar testnet do Coinbase

### 5.7 Verificar Webhook

Quando "pagar" no Coinbase (ou simular):

1. Coinbase envia webhook para seu endpoint
2. Verificar logs do backend:

```
📨 Webhook received: charge:confirmed for charge ABC123
✅ Webhook signature verified
✅ Payment confirmed: crypto_payment_...
✅ Order completion notified: test_order_123
```

3. Verificar status do pagamento:

```bash
GET http://localhost:9000/admin/crypto-payments/{id}
```

Deve estar `status: "completed"` com `blockchain_tx_hash` preenchido.

---

## 📱 Passo 6: Integrar com Frontend

O frontend já está configurado na **Phase 5**:

1. Opção "Criptomoeda" no checkout ✅
2. Usuário seleciona crypto no checkout
3. Frontend chama API:

```typescript
// storefront/lib/crypto-payment-api.ts
const response = await fetch('/api/crypto-payments', {
  method: 'POST',
  body: JSON.stringify({
    order_id: orderId,
    amount_cents: totalCents,
    description: `Pedido #${orderId}`,
  }),
});

const { payment } = await response.json();

// Redirecionar usuário para Coinbase Commerce
window.location.href = payment.provider_checkout_url;
```

4. Usuário paga no Coinbase Commerce
5. Coinbase redireciona de volta para site
6. Webhook atualiza status automaticamente

---

## 🔒 Passo 7: Segurança e Produção

### 7.1 Usar HTTPS

⚠️ **OBRIGATÓRIO** em produção!

- Coinbase Commerce **REQUER** HTTPS para webhooks
- Configurar SSL no servidor (Let's Encrypt gratuito)

### 7.2 Validar Assinaturas

✅ **JÁ IMPLEMENTADO** no código!

O módulo crypto-payment verifica automaticamente assinaturas HMAC SHA-256 em todos os webhooks. Webhooks com assinatura inválida são rejeitados.

### 7.3 Proteger Variáveis de Ambiente

- ✅ Adicionar `.env` no `.gitignore`
- ✅ Usar variáveis de ambiente em produção (não hardcode)
- ✅ Rotacionar secrets periodicamente
- ✅ Usar secrets manager (AWS Secrets Manager, etc.) se possível

### 7.4 Monitorar Webhooks

Coinbase Commerce dashboard mostra:
- Webhooks enviados
- Status de entrega
- Tentativas de retry
- Erros

Verificar periodicamente para garantir que webhooks estão sendo entregues.

### 7.5 Configurar Notificações

Em produção, adicionar:
- Email notifications quando pagamento confirmado
- Slack/Discord notifications para equipe
- Logging centralizado (Datadog, Sentry, etc.)

---

## 📊 Passo 8: Dashboard e Relatórios

### 8.1 Acessar Dashboard do Coinbase

https://commerce.coinbase.com/dashboard

Ver:
- Pagamentos recentes
- Valor total recebido
- Cryptos mais usadas
- Taxas pagas
- Webhooks

### 8.2 Exportar Relatórios

Coinbase permite exportar:
- Transações (CSV)
- Relatórios fiscais
- Reconciliação

### 8.3 Conversão para Fiat

Configurar conversão automática para BRL:

1. Settings → Payout settings
2. Escolher:
   - **Keep in crypto**: Manter em crypto wallet
   - **Convert to fiat**: Converter para BRL e depositar em conta

---

## 🐛 Troubleshooting

### Problema: "Coinbase Commerce not configured"

**Solução**:
1. Verificar `.env` tem as variáveis corretas
2. Reiniciar backend
3. Verificar logs para confirmar inicialização

### Problema: Webhook não está chegando

**Soluções**:
1. Verificar URL está correta no Coinbase dashboard
2. Verificar ngrok está rodando (dev)
3. Verificar HTTPS configurado (prod)
4. Ver logs de webhook no dashboard do Coinbase
5. Testar com "Send test webhook"

### Problema: "Invalid webhook signature"

**Solução**:
1. Verificar `COINBASE_COMMERCE_WEBHOOK_SECRET` está correto
2. Copiar novamente do dashboard
3. Reiniciar backend

### Problema: Pagamento fica "pending" para sempre

**Causas comuns**:
1. Usuário não completou pagamento
2. Pagamento com insuficientes confirmações blockchain
3. Webhook não chegou

**Solução**:
1. Verificar status no dashboard Coinbase
2. Checar logs de webhook
3. Chamar endpoint para forçar refresh:
   ```bash
   GET /admin/crypto-payments/{id}/refresh
   ```

---

## 🎯 Checklist de Configuração

Antes de ir para produção, verificar:

- [ ] Conta Coinbase Commerce criada e verificada
- [ ] API key obtida e salva em `.env`
- [ ] Webhook secret obtido e salvo em `.env`
- [ ] Backend inicializa sem erros
- [ ] Webhook URL configurada no Coinbase
- [ ] Teste de pagamento realizado com sucesso
- [ ] Webhook recebido e processado
- [ ] HTTPS configurado em produção
- [ ] Secrets protegidos
- [ ] Monitoring configurado
- [ ] Documentação atualizada
- [ ] Equipe treinada

---

## 📚 Recursos Adicionais

### Documentação Oficial

- **Coinbase Commerce Docs**: https://docs.cloud.coinbase.com/commerce/docs
- **API Reference**: https://docs.cloud.coinbase.com/commerce/reference
- **Webhook Reference**: https://docs.cloud.coinbase.com/commerce/docs/webhooks

### Suporte

- **Coinbase Support**: https://help.coinbase.com/
- **Status Page**: https://status.coinbase.com/
- **Community**: https://community.coinbase.com/

### Integração com USE Nerd

- **Phase 5 Report**: `PHASE_5_REMOVE_WEB3_WALLET_COMPLETE.md`
- **Architecture**: `ARCHITECTURE_REDESIGN_REPORT.md`
- **Module Code**: `src/modules/crypto-payment/`

---

## ✅ Próximos Passos

Depois de configurar Coinbase Commerce:

1. **Phase 2**: Blockchain Registry Service
   - Registrar pagamentos on-chain para auditoria
   - Conectar com smart contracts

2. **Phase 3**: Smart Contracts + Chainlink VRF
   - Deploy RaffleRegistry.sol
   - Integrar sorteios verificáveis

3. **Phase 6**: Tests & QA
   - Testes E2E completos
   - Validação de fluxo de pagamento

---

**Configurado por**: USE Nerd Team
**Data**: 11/11/2025
**Versão**: 1.0
**Status**: ✅ PRONTO PARA CONFIGURAÇÃO
