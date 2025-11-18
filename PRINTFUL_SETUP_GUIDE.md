# Printful Print-on-Demand Integration Guide

## Overview

USE Nerd integra com Printful para fulfillment de produtos Print-on-Demand usando o plugin `@vymalo/medusa-printful` para Medusa v2.

**Versão do Plugin:** 1.0.10
**Data:** Novembro 2025
**Status:** ✅ Instalado e Configurado

---

## 📦 O que é Printful?

Printful é um serviço de Print-on-Demand que permite:
- Criar produtos personalizados (camisetas, canecas, pôsteres, etc.)
- Processamento automático de pedidos
- Fulfillment e envio direto ao cliente
- Sem necessidade de estoque físico
- Integração direta com e-commerce

---

## 🎯 Funcionalidades do Plugin

### Features Principais

1. **Synchronização de Produtos**
   - Importa produtos do Printful para Medusa
   - Mantém preços e variantes sincronizados
   - Upload automático de designs

2. **Fulfillment Provider**
   - Cria pedidos automaticamente no Printful
   - Rastreamento de envio
   - Atualização automática de status

3. **Webhooks**
   - Notificações de status de pedidos
   - Atualizações de estoque
   - Sincronização em tempo real

4. **Admin UI**
   - Gerenciamento de produtos no Medusa Admin
   - Visualização de pedidos Printful
   - Configuração de shipping

---

## 🚀 Configuração Inicial

### Passo 1: Criar Conta Printful

1. Acesse: https://www.printful.com
2. Crie uma conta gratuita
3. Configure sua loja no dashboard

### Passo 2: Obter Credenciais

No dashboard do Printful:

1. Vá em **Settings → Stores**
2. Selecione sua loja
3. Copie o **Store ID**
4. Vá em **Settings → API**
5. Gere um **Access Token**

### Passo 3: Configurar Variáveis de Ambiente

Edite seu arquivo `.env` (NÃO `.env.example`):

```bash
# Printful Configuration
PRINTFUL_ACCESS_TOKEN=seu-token-aqui
PRINTFUL_STORE_ID=seu-store-id-aqui
PRINTFUL_LOGO_URL=https://seu-dominio.com/logo.png
PRINTFUL_BACKEND_URL=http://localhost:9000
PRINTFUL_CONFIRM_ORDER=false
PRINTFUL_ENABLE_WEBHOOKS=true
```

**Explicação das Variáveis:**

- `PRINTFUL_ACCESS_TOKEN`: Token de API do Printful (obrigatório)
- `PRINTFUL_STORE_ID`: ID da sua loja no Printful (obrigatório)
- `PRINTFUL_LOGO_URL`: URL do logo para packing slips
- `PRINTFUL_BACKEND_URL`: URL do backend Medusa
- `PRINTFUL_CONFIRM_ORDER`: Auto-confirmar pedidos (false = manual)
- `PRINTFUL_ENABLE_WEBHOOKS`: Habilitar webhooks do Printful

---

## 📁 Estrutura de Arquivos

O plugin foi instalado com a seguinte estrutura:

```
use-nerd/
├── node_modules/
│   └── @vymalo/medusa-printful/     # Plugin instalado
│
├── plugins/
│   └── printful-hack/                # Workaround para Medusa v2
│       ├── package.json
│       └── src/                      # Cópia do dist do plugin
│
├── medusa-config.ts                  # Configuração dos módulos
└── .env                              # Suas credenciais (não commitado)
```

---

## ⚙️ Configuração no medusa-config.ts

O plugin foi configurado com dois módulos:

### 1. Fulfillment Provider

```typescript
{
  resolve: "@medusajs/medusa/fulfillment",
  options: {
    providers: [
      {
        resolve: "@vymalo/medusa-printful/printful-fulfillment",
        id: "printful-fulfillment",
        options: {
          enableWebhooks: process.env.PRINTFUL_ENABLE_WEBHOOKS === "true",
          printfulAccessToken: process.env.PRINTFUL_ACCESS_TOKEN,
          storeId: process.env.PRINTFUL_STORE_ID,
          logo_url: process.env.PRINTFUL_LOGO_URL,
          backendUrl: process.env.PRINTFUL_BACKEND_URL,
          confirmOrder: process.env.PRINTFUL_CONFIRM_ORDER === "true"
        }
      }
    ]
  }
}
```

### 2. Printful Module

```typescript
{
  resolve: "@vymalo/medusa-printful",
  options: {
    printfulAccessToken: process.env.PRINTFUL_ACCESS_TOKEN,
    storeId: process.env.PRINTFUL_STORE_ID,
    logo_url: process.env.PRINTFUL_LOGO_URL,
    backendUrl: process.env.PRINTFUL_BACKEND_URL,
    confirmOrder: process.env.PRINTFUL_CONFIRM_ORDER === "true",
    enableWebhooks: process.env.PRINTFUL_ENABLE_WEBHOOKS === "true"
  }
}
```

---

## 🧪 Testando a Integração

### 1. Reiniciar o Backend

```bash
# Parar o backend (Ctrl+C)
# Iniciar novamente
npm run dev
```

### 2. Verificar Logs

Procure por mensagens como:

```
✓ Printful plugin loaded
✓ Printful fulfillment provider registered
✓ Connected to Printful API
```

### 3. Testar no Medusa Admin

1. Acesse http://localhost:9000/app
2. Vá em **Settings → Fulfillment Providers**
3. Verifique se "printful-fulfillment" aparece listado
4. Vá em **Products** → Create New Product
5. Selecione "Printful" como fulfillment provider

---

## 🔄 Sincronizando Produtos

### Importar Produtos do Printful

```bash
# Via API
POST http://localhost:9000/admin/printful/sync-products

# Ou no Medusa Admin
Settings → Printful → Sync Products
```

### Criar Produto com Printful

1. No Medusa Admin: Products → Create Product
2. Preencha os dados básicos
3. Em "Fulfillment Provider", selecione "printful-fulfillment"
4. Configure variantes (tamanhos, cores)
5. Faça upload do design
6. Salve o produto

O plugin automaticamente:
- Criará o produto no Printful
- Fará upload dos designs
- Configurará variantes e preços

---

## 📦 Fluxo de Pedidos

### Quando um Cliente Faz um Pedido:

1. **Cliente compra** no storefront
2. **Medusa cria** o order
3. **Plugin detecta** produtos Printful
4. **Automaticamente cria** order no Printful
5. **Printful processa** e envia
6. **Webhook atualiza** tracking no Medusa
7. **Cliente recebe** notificação de envio

### Modos de Confirmação

**Manual (confirmOrder: false)**
- Pedidos ficam em draft no Printful
- Você deve confirmar manualmente no dashboard
- Útil para revisar antes de produzir

**Automático (confirmOrder: true)**
- Pedidos são confirmados automaticamente
- Produção inicia imediatamente
- Recomendado para operação em escala

---

## 🔔 Webhooks do Printful

O plugin suporta os seguintes webhooks:

| Evento | Descrição |
|--------|-----------|
| `package_shipped` | Pedido enviado, atualiza tracking |
| `package_returned` | Pedido retornado |
| `order_failed` | Falha na produção |
| `order_canceled` | Pedido cancelado |
| `order_put_hold` | Pedido em espera |
| `order_remove_hold` | Pedido liberado |

### Configurar Webhooks no Printful

1. Printful Dashboard → **Settings → Webhooks**
2. **Adicione novo webhook:**
   - URL: `https://seu-dominio.com/hooks/printful`
   - Eventos: Selecione todos
3. Salve o webhook

**Nota:** Webhooks só funcionam em HTTPS (produção).

---

## 💰 Precificação

### Como Definir Preços

O plugin sincroniza preços do Printful, mas você pode adicionar margem:

```typescript
// Exemplo: adicionar 50% de margem
const printfulPrice = 19.99
const yourPrice = printfulPrice * 1.5 // $29.99
```

### Custos Típicos (USD)

| Produto | Printful Cost | Preço Sugerido |
|---------|---------------|----------------|
| T-Shirt | $10-15 | $25-35 |
| Hoodie | $25-35 | $50-70 |
| Mug | $8-12 | $20-28 |
| Poster | $5-10 | $15-25 |

**Shipping:** Varia por país e método.

---

## 🌍 Shipping para Brasil

### Configurações Recomendadas

1. **Enable Brazilian Shipping**
   - Printful suporta envio para BR
   - Tempo: 10-20 dias úteis
   - Trackagem disponível

2. **Impostos e Taxas**
   - Cliente pode pagar impostos na entrega
   - Configure aviso no checkout
   - Considere DDP (Delivered Duty Paid)

3. **Moeda**
   - Printful cobra em USD
   - Converta para BRL no frontend
   - Use cotação do dia

---

## 🛠️ Troubleshooting

### Erro: "Printful API Key Invalid"

**Solução:**
1. Verifique se o token está correto
2. Teste manualmente: `curl -H "Authorization: Bearer YOUR_TOKEN" https://api.printful.com/stores`
3. Regenere o token se necessário

### Erro: "Store ID not found"

**Solução:**
1. Confirme o Store ID no dashboard Printful
2. Deve ser um número (ex: 12345678)
3. Verifique se a loja está ativa

### Produtos não aparecem

**Solução:**
1. Rode sync manual: POST `/admin/printful/sync-products`
2. Verifique logs do backend
3. Confirme que os produtos existem no Printful

### Webhooks não funcionam

**Solução:**
1. Webhooks só funcionam em HTTPS
2. Use ngrok para testar localmente
3. Verifique logs do Printful dashboard

---

## 📚 Recursos Adicionais

### Documentação Oficial

- **Printful API:** https://developers.printful.com
- **Plugin GitHub:** https://github.com/vymalo/medusajs
- **Medusa Docs:** https://docs.medusajs.com

### Printful Dashboard

- **Login:** https://www.printful.com/dashboard
- **API Settings:** https://www.printful.com/dashboard/store/api
- **Mockup Generator:** https://www.printful.com/mockup-generator

### Suporte

- **Printful Support:** support@printful.com
- **Plugin Issues:** https://github.com/vymalo/medusajs/issues

---

## 🔐 Segurança

### Boas Práticas

1. **Nunca committa** credenciais no Git
2. Use `.env` para secrets
3. Rotate API tokens a cada 90 dias
4. Monitore uso de API (rate limits)
5. Use HTTPS em produção

### Webhooks Security

O Printful assina webhooks com HMAC. Configure:

```typescript
import crypto from 'crypto'

function verifyWebhook(body, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret)
  const hash = hmac.update(body).digest('hex')
  return hash === signature
}
```

---

## 📊 Métricas e Monitoramento

### KPIs para Acompanhar

- **Order Success Rate:** >95%
- **Average Production Time:** 2-5 dias
- **Shipping Time:** 7-15 dias
- **Return Rate:** <5%
- **API Response Time:** <500ms

### Monitoring Tools

- Printful Dashboard Analytics
- Medusa Admin Orders
- Custom analytics (Google Analytics)

---

## 🚀 Próximos Passos

### 1. Criar Produtos

- Defina seu catálogo
- Crie mockups no Printful
- Configure preços com margem

### 2. Testar Pedidos

- Faça pedidos de teste
- Verifique fulfillment
- Teste webhooks

### 3. Go Live

- Configure webhooks de produção
- Ative confirmação automática
- Monitore primeiros pedidos

---

## ✅ Checklist de Setup

- [ ] Conta Printful criada
- [ ] Store ID obtido
- [ ] Access Token gerado
- [ ] Variáveis de ambiente configuradas
- [ ] Backend reiniciado
- [ ] Plugin carregado corretamente
- [ ] Produtos sincronizados
- [ ] Pedido de teste realizado
- [ ] Webhooks configurados (produção)
- [ ] Monitoramento ativo

---

**Última Atualização:** Novembro 2025
**Autor:** Claude Code
**Versão:** 1.0
