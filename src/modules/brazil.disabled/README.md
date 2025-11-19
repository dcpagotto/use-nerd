# Brazil Module - Integrações Brasileiras

## Visão Geral

O **Brazil Module** fornece integrações específicas para o mercado brasileiro:

- **PIX Payment**: Pagamento instantâneo via Mercado Pago
- **Melhor Envio**: Cálculo e compra de frete
- **NFe**: Emissão de Nota Fiscal Eletrônica

## Estrutura do Módulo

```
src/modules/brazil/
├── models/
│   ├── pix-payment.ts          # Pagamentos PIX
│   ├── shipping-quote.ts       # Cotações de frete
│   └── nfe.ts                  # Notas fiscais
├── services/
│   ├── pix-payment.ts          # Service PIX
│   ├── melhor-envio.ts         # Service frete
│   └── nfe.ts                  # Service NFe
├── workflows/
│   ├── create-pix-payment.ts   # Workflow criação PIX
│   ├── calculate-shipping.ts   # Workflow cálculo frete
│   └── generate-nfe.ts         # Workflow geração NFe
├── subscribers/
│   ├── handle-pix-webhook.ts   # Webhook Mercado Pago
│   ├── handle-pix-paid.ts      # PIX pago
│   ├── handle-order-shipped.ts # Pedido enviado
│   └── handle-order-completed.ts # Pedido completo
├── api/
│   ├── store/                  # Rotas públicas
│   ├── admin/                  # Rotas admin
│   └── webhooks/               # Webhooks externos
├── types/
│   └── index.ts                # Tipos e DTOs
├── utils/
│   └── validators.ts           # Validadores CPF/CNPJ/CEP
└── index.ts                    # Exportações do módulo
```

## 1. PIX Payment (Mercado Pago)

### Configuração

```env
MERCADO_PAGO_ACCESS_TOKEN=your_access_token
MERCADO_PAGO_PUBLIC_KEY=your_public_key
MERCADO_PAGO_SANDBOX=true
```

### API Endpoints

#### Criar Pagamento PIX

```http
POST /store/brazil/pix/create
Content-Type: application/json

{
  "order_id": "order_123",
  "amount": 10000,
  "payer_name": "João Silva",
  "payer_email": "joao@example.com",
  "payer_cpf_cnpj": "12345678901",
  "description": "Pedido #123",
  "expires_in_minutes": 30
}
```

**Response:**

```json
{
  "payment": {
    "id": "pixpay_123",
    "order_id": "order_123",
    "status": "pending",
    "expires_at": "2024-01-01T12:30:00Z"
  },
  "qr_code": "base64_image_here",
  "qr_code_text": "00020126580014br.gov.bcb.pix..."
}
```

#### Verificar Status

```http
GET /store/brazil/pix/:id/status
```

**Response:**

```json
{
  "payment_id": "pixpay_123",
  "status": "paid",
  "paid_at": "2024-01-01T12:15:00Z",
  "expires_at": "2024-01-01T12:30:00Z"
}
```

### Webhook

Configure no Mercado Pago:

```
https://seu-dominio.com/webhooks/brazil/pix
```

### Uso Programático

```typescript
import { BRAZIL_MODULE } from "@modules/brazil";
import type PixPaymentService from "@modules/brazil/services/pix-payment";

// Criar pagamento
const pixPaymentService: PixPaymentService = container.resolve(
  `${BRAZIL_MODULE}.pix-payment`
);

const payment = await pixPaymentService.createPixPayment({
  order_id: "order_123",
  amount: 10000, // R$ 100,00 em centavos
  payer_name: "João Silva",
  payer_email: "joao@example.com",
  payer_cpf_cnpj: "12345678901",
});

console.log(payment.qr_code_text); // Copia e Cola
```

## 2. Melhor Envio (Frete)

### Configuração

```env
MELHOR_ENVIO_TOKEN=your_token
MELHOR_ENVIO_SANDBOX=true
```

### API Endpoints

#### Calcular Frete

```http
POST /store/brazil/shipping/calculate
Content-Type: application/json

{
  "from_postal_code": "01310-100",
  "to_postal_code": "80010-000",
  "packages": [
    {
      "height": 10,
      "width": 20,
      "length": 30,
      "weight": 1.5,
      "insurance_value": 10000
    }
  ]
}
```

**Response:**

```json
{
  "quotes": [
    {
      "company": "correios",
      "service_name": "PAC",
      "price": 2500,
      "delivery_min": 8,
      "delivery_max": 12
    },
    {
      "company": "correios",
      "service_name": "SEDEX",
      "price": 4500,
      "delivery_min": 3,
      "delivery_max": 5
    }
  ]
}
```

### Uso Programático

```typescript
import { BRAZIL_MODULE } from "@modules/brazil";
import type MelhorEnvioService from "@modules/brazil/services/melhor-envio";

const melhorEnvioService: MelhorEnvioService = container.resolve(
  `${BRAZIL_MODULE}.melhor-envio`
);

// Calcular frete
const quotes = await melhorEnvioService.calculateShipping({
  from_postal_code: "01310-100",
  to_postal_code: "80010-000",
  packages: [
    {
      height: 10,
      width: 20,
      length: 30,
      weight: 1.5,
    },
  ],
});

// Comprar etiqueta (após pedido confirmado)
const { tracking_code } = await melhorEnvioService.purchaseShipping(
  "order_123",
  {
    company: "correios",
    service_name: "PAC",
    price: 2500,
  }
);

// Rastrear envio
const tracking = await melhorEnvioService.trackShipment(tracking_code);
console.log(tracking.events);
```

## 3. NFe (Nota Fiscal Eletrônica)

### Configuração

```env
NFE_API_URL=https://api.enotas.com.br
NFE_API_TOKEN=your_token
NFE_ENVIRONMENT=sandbox

# Dados da Empresa
COMPANY_CNPJ=12345678000190
COMPANY_NAME=USE Nerd LTDA
COMPANY_EMAIL=fiscal@use-nerd.com.br
```

### API Endpoints

#### Gerar NFe (Admin)

```http
POST /admin/brazil/nfe/:orderId/generate
```

**Response:**

```json
{
  "nfe": {
    "id": "nfe_123",
    "order_id": "order_123",
    "nfe_number": "123456",
    "access_key": "35240112345678000190550010001234561234567890",
    "status": "authorized",
    "issued_at": "2024-01-01T12:00:00Z"
  },
  "pdf_url": "https://example.com/nfe/123456.pdf",
  "xml_url": "https://example.com/nfe/123456.xml"
}
```

#### Download NFe

```http
GET /admin/brazil/nfe/:orderId/download?format=pdf
```

**Response:**

```json
{
  "nfe_id": "nfe_123",
  "nfe_number": "123456",
  "pdf_url": "https://example.com/nfe/123456.pdf"
}
```

### Uso Programático

```typescript
import { BRAZIL_MODULE } from "@modules/brazil";
import type NFeService from "@modules/brazil/services/nfe";

const nfeService: NFeService = container.resolve(`${BRAZIL_MODULE}.nfe`);

// Gerar NFe
const nfe = await nfeService.generateNFe({
  order_id: "order_123",
  customer_cpf_cnpj: "12345678901",
  customer_name: "João Silva",
  customer_email: "joao@example.com",
  customer_address: {
    street: "Rua Exemplo",
    number: "123",
    district: "Centro",
    city: "São Paulo",
    state: "SP",
    postal_code: "01310-100",
  },
  items: [
    {
      product_code: "PROD001",
      description: "Camiseta USE Nerd",
      quantity: 1,
      unit_price: 10000,
      total_price: 10000,
      ncm: "00000000",
      cfop: "5102",
    },
  ],
  total_amount: 12500,
  shipping_amount: 2500,
});

// Baixar PDF
const pdfUrl = await nfeService.downloadPDF(nfe.id);

// Cancelar NFe
await nfeService.cancelNFe(nfe.id, "Pedido cancelado pelo cliente");
```

## Workflows

### Create PIX Payment Workflow

```typescript
import { createPixPaymentWorkflow } from "@modules/brazil/workflows";

const { result } = await createPixPaymentWorkflow(container).run({
  input: {
    order_id: "order_123",
    amount: 10000,
    payer_name: "João Silva",
    payer_email: "joao@example.com",
    payer_cpf_cnpj: "12345678901",
  },
});

console.log(result.qr_code_text);
```

### Calculate Shipping Workflow

```typescript
import { calculateShippingWorkflow } from "@modules/brazil/workflows";

const { result } = await calculateShippingWorkflow(container).run({
  input: {
    from_postal_code: "01310-100",
    to_postal_code: "80010-000",
    packages: [{ height: 10, width: 20, length: 30, weight: 1.5 }],
  },
});

console.log(result.quotes);
```

### Generate NFe Workflow

```typescript
import { generateNFeWorkflow } from "@modules/brazil/workflows";

const { result } = await generateNFeWorkflow(container).run({
  input: {
    order_id: "order_123",
  },
});

console.log(result.nfe.access_key);
```

## Eventos (Event Bus)

### PIX Events

- `brazil.pix_created` - PIX criado
- `brazil.pix_paid` - PIX pago
- `brazil.pix_webhook` - Webhook recebido

### Shipping Events

- `brazil.shipping_purchased` - Etiqueta comprada

### NFe Events

- `brazil.nfe_created` - NFe criada
- `brazil.nfe_authorized` - NFe autorizada

## Utilidades

### Validadores

```typescript
import {
  validateCpfCnpj,
  validateCep,
  validateEmail,
  formatBrazilianPhone,
} from "@modules/brazil/utils";

// Validar CPF/CNPJ
const cpfResult = validateCpfCnpj("123.456.789-01");
console.log(cpfResult.isValid); // true/false
console.log(cpfResult.type); // "CPF" | "CNPJ"
console.log(cpfResult.formatted); // "123.456.789-01"

// Validar CEP
const cepResult = validateCep("01310100");
console.log(cepResult.isValid); // true/false
console.log(cepResult.formatted); // "01310-100"

// Formatar telefone
const phone = formatBrazilianPhone("11987654321");
console.log(phone); // "(11) 98765-4321"
```

## Status dos Models

### PixPayment Status

- `pending` - Aguardando pagamento
- `paid` - Pago
- `expired` - Expirado
- `cancelled` - Cancelado

### ShippingQuote Status

- `quoted` - Cotado
- `purchased` - Etiqueta comprada
- `in_transit` - Em trânsito
- `delivered` - Entregue
- `cancelled` - Cancelado

### NFe Status

- `pending` - Pendente
- `processing` - Processando
- `authorized` - Autorizada
- `rejected` - Rejeitada
- `cancelled` - Cancelada

## Próximos Passos

### Implementar Integrações Reais

Atualmente, os services estão com mocks. Para implementar:

1. **Mercado Pago PIX**:
   - Instalar SDK: `npm install mercadopago`
   - Descomentar código em `services/pix-payment.ts`
   - Configurar webhook no painel do Mercado Pago

2. **Melhor Envio**:
   - Obter token na API: https://sandbox.melhorenvio.com.br
   - Descomentar código em `services/melhor-envio.ts`
   - Implementar autenticação OAuth2

3. **NFe Provider (eNotas)**:
   - Criar conta: https://enotas.com.br
   - Descomentar código em `services/nfe.ts`
   - Configurar certificado digital (se necessário)

### Testes

Criar testes unitários e de integração:

```bash
npm run test:unit -- src/modules/brazil
npm run test:integration:modules -- src/modules/brazil
```

### Documentação Adicional

- [Mercado Pago PIX Docs](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-with-pix)
- [Melhor Envio API Docs](https://docs.melhorenvio.com.br/)
- [eNotas API Docs](https://docs.enotas.com.br/)

---

**Desenvolvido para USE Nerd E-commerce Platform**
