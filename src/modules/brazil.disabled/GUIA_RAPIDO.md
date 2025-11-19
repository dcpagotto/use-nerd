# Guia Rápido - Brazil Module

## Instalação e Configuração

### 1. Variáveis de Ambiente

Copie e configure no `.env`:

```env
# PIX (Mercado Pago)
MERCADO_PAGO_ACCESS_TOKEN=seu_token_aqui
MERCADO_PAGO_PUBLIC_KEY=sua_chave_publica
MERCADO_PAGO_SANDBOX=true

# Frete (Melhor Envio)
MELHOR_ENVIO_TOKEN=seu_token_aqui
MELHOR_ENVIO_SANDBOX=true

# NFe (eNotas ou Focus NFe)
NFE_API_URL=https://api.enotas.com.br
NFE_API_TOKEN=seu_token_aqui
NFE_ENVIRONMENT=sandbox

# Dados da Empresa
COMPANY_CNPJ=12345678000190
COMPANY_NAME=Sua Empresa LTDA
COMPANY_EMAIL=fiscal@suaempresa.com.br
```

### 2. Rodar Migrations

```bash
npm run medusa migrations run
```

### 3. Testar o Módulo

```bash
# Iniciar servidor
npm run dev

# Testar endpoints (em outro terminal)
curl http://localhost:9000/store/brazil/pix/create
```

---

## Uso Básico

### PIX - Criar Pagamento

```typescript
import { BRAZIL_MODULE } from "@modules/brazil";
import type PixPaymentService from "@modules/brazil/services/pix-payment";

// Resolver service
const pixService: PixPaymentService = container.resolve(
  `${BRAZIL_MODULE}.pix-payment`
);

// Criar pagamento
const payment = await pixService.createPixPayment({
  order_id: "order_123",
  amount: 10000, // R$ 100,00 (em centavos)
  payer_name: "João Silva",
  payer_email: "joao@example.com",
  payer_cpf_cnpj: "12345678901",
  expires_in_minutes: 30,
});

// Mostrar QR Code para o cliente
console.log(payment.qr_code); // base64 da imagem
console.log(payment.qr_code_text); // Copia e Cola
```

**Via API (Store)**:

```bash
curl -X POST http://localhost:9000/store/brazil/pix/create \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "order_123",
    "amount": 10000,
    "payer_name": "João Silva",
    "payer_email": "joao@example.com",
    "payer_cpf_cnpj": "12345678901"
  }'
```

### Frete - Calcular

```typescript
import { BRAZIL_MODULE } from "@modules/brazil";
import type MelhorEnvioService from "@modules/brazil/services/melhor-envio";

const freteService: MelhorEnvioService = container.resolve(
  `${BRAZIL_MODULE}.melhor-envio`
);

// Calcular frete
const resultado = await freteService.calculateShipping({
  from_postal_code: "01310-100", // CEP origem
  to_postal_code: "80010-000", // CEP destino
  packages: [
    {
      height: 10, // cm
      width: 20, // cm
      length: 30, // cm
      weight: 1.5, // kg
    },
  ],
});

// Mostrar opções
resultado.quotes.forEach((quote) => {
  console.log(`${quote.company} - ${quote.service_name}`);
  console.log(`Preço: R$ ${quote.price / 100}`);
  console.log(`Prazo: ${quote.delivery_min}-${quote.delivery_max} dias`);
});
```

**Via API (Store)**:

```bash
curl -X POST http://localhost:9000/store/brazil/shipping/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "from_postal_code": "01310-100",
    "to_postal_code": "80010-000",
    "packages": [
      {
        "height": 10,
        "width": 20,
        "length": 30,
        "weight": 1.5
      }
    ]
  }'
```

### NFe - Gerar Nota Fiscal

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
    complement: "Apto 45",
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
      unit_price: 10000, // R$ 100,00
      total_price: 10000,
      ncm: "61091000", // Código NCM obrigatório
      cfop: "5102", // Código CFOP obrigatório
    },
  ],
  total_amount: 12500, // R$ 125,00 (produto + frete)
  shipping_amount: 2500, // R$ 25,00
});

console.log(`NFe gerada: ${nfe.nfe_number}`);
console.log(`Chave de acesso: ${nfe.access_key}`);
console.log(`PDF: ${nfe.pdf_url}`);
```

**Via API (Admin)**:

```bash
curl -X POST http://localhost:9000/admin/brazil/nfe/order_123/generate \
  -H "Authorization: Bearer SEU_TOKEN_ADMIN"
```

---

## Workflows

### Usar Workflows (Recomendado)

Workflows são a forma recomendada de usar o módulo, pois incluem compensação automática em caso de erro.

```typescript
import {
  createPixPaymentWorkflow,
  calculateShippingWorkflow,
  generateNFeWorkflow,
} from "@modules/brazil/workflows";

// PIX
const { result: pixResult } = await createPixPaymentWorkflow(container).run({
  input: {
    order_id: "order_123",
    amount: 10000,
    payer_name: "João Silva",
    payer_email: "joao@example.com",
    payer_cpf_cnpj: "12345678901",
  },
});

// Frete
const { result: freteResult } = await calculateShippingWorkflow(container).run({
  input: {
    from_postal_code: "01310-100",
    to_postal_code: "80010-000",
    packages: [{ height: 10, width: 20, length: 30, weight: 1.5 }],
  },
});

// NFe
const { result: nfeResult } = await generateNFeWorkflow(container).run({
  input: {
    order_id: "order_123",
  },
});
```

---

## Validadores

### CPF/CNPJ

```typescript
import { validateCpfCnpj } from "@modules/brazil/utils";

const result = validateCpfCnpj("123.456.789-01");

console.log(result.isValid); // true ou false
console.log(result.type); // "CPF" ou "CNPJ"
console.log(result.formatted); // "123.456.789-01"
```

### CEP

```typescript
import { validateCep } from "@modules/brazil/utils";

const result = validateCep("01310100");

console.log(result.isValid); // true
console.log(result.formatted); // "01310-100"
```

### Email e Telefone

```typescript
import {
  validateEmail,
  validateBrazilianPhone,
  formatBrazilianPhone,
} from "@modules/brazil/utils";

// Email
console.log(validateEmail("joao@example.com")); // true

// Telefone
console.log(validateBrazilianPhone("11987654321")); // true
console.log(formatBrazilianPhone("11987654321")); // "(11) 98765-4321"
```

---

## Eventos

### Escutar Eventos

```typescript
import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework/types";

export default async function handlePixPaid({
  event: { data },
  container,
}: SubscriberArgs<{ payment_id: string; order_id: string }>) {
  console.log(`PIX pago: ${data.payment_id}`);
  console.log(`Pedido: ${data.order_id}`);

  // Fazer algo quando PIX for pago
}

export const config: SubscriberConfig = {
  event: "brazil.pix_paid",
};
```

### Eventos Disponíveis

**PIX**:
- `brazil.pix_created` - PIX criado
- `brazil.pix_paid` - PIX pago
- `brazil.pix_webhook` - Webhook recebido

**Frete**:
- `brazil.shipping_purchased` - Etiqueta comprada

**NFe**:
- `brazil.nfe_created` - NFe criada
- `brazil.nfe_authorized` - NFe autorizada

---

## Status dos Modelos

### PixPayment

- `pending` - Aguardando pagamento
- `paid` - Pago ✅
- `expired` - Expirado ⏱️
- `cancelled` - Cancelado ❌

### ShippingQuote

- `quoted` - Cotado 💰
- `purchased` - Etiqueta comprada 📦
- `in_transit` - Em trânsito 🚚
- `delivered` - Entregue ✅
- `cancelled` - Cancelado ❌

### NFe

- `pending` - Pendente ⏳
- `processing` - Processando 🔄
- `authorized` - Autorizada ✅
- `rejected` - Rejeitada ❌
- `cancelled` - Cancelada 🚫

---

## Troubleshooting

### PIX não está funcionando

1. Verifique se `MERCADO_PAGO_ACCESS_TOKEN` está configurado
2. Verifique se está no modo sandbox: `MERCADO_PAGO_SANDBOX=true`
3. Configure o webhook no painel do Mercado Pago: `https://seu-dominio.com/webhooks/brazil/pix`
4. Verifique os logs: procure por `[Brazil]` nos logs

### Cálculo de frete falhando

1. Verifique se `MELHOR_ENVIO_TOKEN` está configurado
2. Verifique se os CEPs são válidos (8 dígitos)
3. Verifique se as dimensões estão dentro dos limites das transportadoras
4. Confira se está no modo sandbox: `MELHOR_ENVIO_SANDBOX=true`

### NFe não está sendo gerada

1. Verifique se `NFE_API_TOKEN` está configurado
2. Verifique se o cliente tem CPF/CNPJ válido
3. Verifique se todos os produtos têm código NCM e CFOP
4. Verifique se `COMPANY_CNPJ` está configurado
5. Confira se está no modo sandbox: `NFE_ENVIRONMENT=sandbox`

### Como ver os logs

```bash
# Logs em tempo real
npm run dev

# Procurar por erros específicos
grep "Brazil" logs/medusa.log
grep "ERROR" logs/medusa.log | grep "Brazil"
```

---

## Próximos Passos

### 1. Ativar Integrações Reais

**Atualmente o módulo está com MOCKS**. Para ativar as integrações reais:

#### Mercado Pago PIX

1. Criar conta: https://www.mercadopago.com.br/developers
2. Obter Access Token (sandbox)
3. Configurar variáveis de ambiente
4. Descomentar código em `services/pix-payment.ts`
5. Configurar webhook no painel

#### Melhor Envio

1. Criar conta: https://sandbox.melhorenvio.com.br
2. Obter token OAuth2
3. Configurar variáveis de ambiente
4. Descomentar código em `services/melhor-envio.ts`

#### NFe (eNotas)

1. Criar conta: https://enotas.com.br
2. Obter API token
3. Configurar variáveis de ambiente
4. Descomentar código em `services/nfe.ts`

### 2. Criar Testes

```bash
# Criar testes unitários
src/modules/brazil/__tests__/services/pix-payment.spec.ts
src/modules/brazil/__tests__/services/melhor-envio.spec.ts
src/modules/brazil/__tests__/services/nfe.spec.ts

# Rodar testes
npm run test:unit -- src/modules/brazil
```

### 3. Integrar com Frontend

Criar páginas Next.js:
- `/checkout/pix` - Exibir QR Code
- `/checkout/shipping` - Selecionar frete
- `/account/invoices` - Listar NFes

---

## Suporte

**Documentação completa**: `src/modules/brazil/README.md`

**Relatório de implementação**: `BRAZIL_MODULE_IMPLEMENTATION.md`

**Dúvidas sobre integrações**:
- Mercado Pago: https://www.mercadopago.com.br/developers/pt/support
- Melhor Envio: https://docs.melhorenvio.com.br/
- eNotas: https://docs.enotas.com.br/

---

**Desenvolvido para USE Nerd E-commerce Platform**
