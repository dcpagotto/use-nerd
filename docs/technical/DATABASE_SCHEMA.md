# Database Schema - USE Nerd

> Documentacao completa do schema do banco de dados PostgreSQL

**Database**: use-nerd
**DBMS**: PostgreSQL 15
**ORM**: MikroORM (Medusa v2)
**Atualizado**: 2025-11-18

---

## Indice

1. [Visao Geral](#visao-geral)
2. [Configuracao](#configuracao)
3. [Tabelas Medusa Core](#tabelas-medusa-core)
4. [Modulos Customizados](#modulos-customizados)
   - [Raffle Module](#raffle-module)
   - [Brazil Module](#brazil-module)
   - [Crypto Payment Module](#crypto-payment-module)
5. [Relacionamentos ERD](#relacionamentos-erd)
6. [Indices](#indices)
7. [Migrations](#migrations)
8. [Backup & Restore](#backup--restore)

---

## Visao Geral

O banco de dados `use-nerd` utiliza **PostgreSQL 15** e e gerenciado via **MikroORM** (biblioteca ORM do Medusa v2). O schema e composto por:

- **~100+ tabelas** do Medusa Core (produtos, pedidos, pagamentos, clientes, etc.)
- **Tabelas customizadas** para modulos especificos (raffle, brazil, crypto-payment)

### Estatisticas

- **Total de Tabelas**: ~105
- **Schemas**: `public` (default), `strapi` (CMS)
- **Encoding**: UTF-8
- **Collation**: pt_BR.utf8

---

## Configuracao

### Connection String

```env
# Docker (service name)
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/use-nerd?sslmode=disable

# Local (localhost)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/use-nerd?sslmode=disable
```

### Container Docker

```yaml
# docker-compose.yml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: use-nerd
  ports:
    - "5432:5432"
```

### Acesso Manual

```bash
# Via Docker
docker exec -it use-nerd-postgres psql -U postgres -d use-nerd

# Via psql local
psql -h localhost -U postgres -d use-nerd
```

---

## Tabelas Medusa Core

O Medusa v2 cria automaticamente ~100 tabelas para funcionalidades core. Principais grupos:

### Produtos

- `product`: Produtos
- `product_variant`: Variantes (tamanho, cor)
- `product_option`: Opcoes (ex: "Size", "Color")
- `product_option_value`: Valores das opcoes (ex: "M", "L", "Red")
- `product_category`: Categorias
- `product_collection`: Colecoes
- `product_tag`: Tags
- `product_type`: Tipos de produto
- `image`: Imagens de produtos

### Precos

- `price`: Precos (com moeda e variante)
- `price_set`: Conjunto de precos
- `price_list`: Listas de precos (promos, B2B)
- `price_rule`: Regras de aplicacao de precos

### Pedidos

- `order`: Pedidos
- `order_line_item`: Itens do pedido
- `order_shipping`: Envio do pedido
- `order_transaction`: Transacoes financeiras
- `order_summary`: Resumo do pedido (totais)
- `order_change`: Historico de mudancas
- `order_claim`: Reclamacoes
- `order_exchange`: Trocas

### Carrinho

- `cart`: Carrinhos
- `cart_line_item`: Itens no carrinho
- `cart_address`: Enderecos de envio/cobranca
- `cart_shipping_method`: Metodos de envio selecionados

### Clientes

- `customer`: Clientes
- `customer_address`: Enderecos do cliente
- `customer_group`: Grupos de clientes (VIP, Atacado)

### Pagamentos

- `payment`: Pagamentos
- `payment_collection`: Colecao de pagamentos (um pedido pode ter multiplos)
- `payment_session`: Sessoes de pagamento (gateway)
- `payment_provider`: Provedores de pagamento
- `capture`: Capturas de pagamento
- `refund`: Reembolsos

### Fulfillment (Atendimento)

- `fulfillment`: Atendimentos de pedido
- `fulfillment_item`: Itens atendidos
- `fulfillment_provider`: Provedores de fulfillment
- `fulfillment_set`: Conjuntos de fulfillment

### Autenticacao

- `auth_identity`: Identidades de autenticacao
- `invite`: Convites de usuarios
- `api_key`: Chaves de API

### Regioes & Envio

- `region`: Regioes de venda
- `region_country`: Paises por regiao
- `shipping_option`: Opcoes de envio
- `shipping_profile`: Perfis de envio

### Promocoes

- `promotion`: Promocoes
- `promotion_rule`: Regras de promocao
- `promotion_campaign`: Campanhas de promocao

### Inventory

- `inventory_item`: Itens de inventario
- `inventory_level`: Niveis de estoque
- `reservation_item`: Reservas de estoque

---

## Modulos Customizados

### Raffle Module

Gerencia rifas com verificacao blockchain via Chainlink VRF.

#### Tabela: `raffle`

Representa uma rifa.

```sql
CREATE TABLE raffle (
  id TEXT PRIMARY KEY,

  -- Informacoes basicas
  title TEXT NOT NULL,
  description TEXT,
  prize_description TEXT NOT NULL,

  -- Configuracao
  total_tickets INTEGER NOT NULL,
  ticket_price INTEGER NOT NULL,  -- Em centavos (ex: 1000 = R$ 10,00)
  max_tickets_per_customer INTEGER DEFAULT 0,  -- 0 = sem limite

  -- Datas
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  draw_date TIMESTAMPTZ NOT NULL,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft',  -- 'draft', 'active', 'completed', 'cancelled'

  -- Blockchain
  contract_address TEXT,
  transaction_hash TEXT,
  chainlink_request_id TEXT,

  -- Vencedor
  winner_ticket_number INTEGER,
  winner_customer_id TEXT,
  winner_wallet_address TEXT,
  winner_drawn_at TIMESTAMPTZ,

  -- Metadata
  image_url TEXT,
  terms_and_conditions TEXT,
  metadata JSONB,

  -- Product Type (Phase 4 - POD Integration)
  product_type TEXT DEFAULT 'other',  -- 'physical', 'digital', 'pod', 'service', 'other'
  product_specifications JSONB,
  supplier_name TEXT,
  supplier_contact TEXT,
  delivery_type TEXT,  -- 'pickup', 'shipping', 'digital', 'transfer'
  delivery_estimate_days INTEGER,

  -- Relacao com produto
  product_id TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Enums**:

- `status`: `draft`, `active`, `completed`, `cancelled`
- `product_type`: `physical`, `digital`, `pod`, `service`, `other`

---

#### Tabela: `raffle_ticket`

Representa um ticket de rifa comprado por um cliente.

```sql
CREATE TABLE raffle_ticket (
  id TEXT PRIMARY KEY,

  -- Relacao com rifa
  raffle_id TEXT NOT NULL REFERENCES raffle(id) ON DELETE CASCADE,

  -- Identificacao
  ticket_number INTEGER NOT NULL,
  ticket_code TEXT UNIQUE NOT NULL,  -- Codigo unico (ex: "RAF-001-0042")

  -- Comprador
  customer_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  line_item_id TEXT NOT NULL,

  -- NFT
  nft_token_id TEXT,
  nft_transaction_hash TEXT,
  nft_metadata_uri TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'reserved',  -- 'reserved', 'paid', 'cancelled'
  is_winner BOOLEAN DEFAULT FALSE,

  -- Pagamento
  paid_at TIMESTAMPTZ,
  price_paid INTEGER NOT NULL,  -- Em centavos

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraint: ticket_number unico por rifa
  UNIQUE(raffle_id, ticket_number)
);
```

**Enums**:

- `status`: `reserved`, `paid`, `cancelled`

---

#### Tabela: `raffle_draw`

Representa um sorteio de rifa usando Chainlink VRF.

```sql
CREATE TABLE raffle_draw (
  id TEXT PRIMARY KEY,

  -- Relacao com rifa
  raffle_id TEXT NOT NULL REFERENCES raffle(id) ON DELETE CASCADE,

  -- Chainlink VRF
  vrf_request_id TEXT UNIQUE NOT NULL,
  vrf_random_words JSONB,  -- Array de numeros aleatorios
  vrf_transaction_hash TEXT NOT NULL,

  -- Resultado
  winner_ticket_number INTEGER,
  winner_ticket_id TEXT,
  winner_customer_id TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'requested',  -- 'requested', 'fulfilled', 'failed'

  -- Metadata
  drawn_at TIMESTAMPTZ DEFAULT NOW(),
  executed_by TEXT NOT NULL,  -- User ID do admin
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Enums**:

- `status`: `requested`, `fulfilled`, `failed`

---

### Brazil Module

Integracao com servicos brasileiros: PIX, Melhor Envio, NFe.

#### Tabela: `pix_payment`

Representa um pagamento PIX via Mercado Pago.

```sql
CREATE TABLE pix_payment (
  id TEXT PRIMARY KEY,

  -- Referencia ao pedido
  order_id TEXT NOT NULL,

  -- Valor
  amount INTEGER NOT NULL,  -- Em centavos

  -- Dados PIX
  qr_code TEXT NOT NULL,  -- QR Code em base64
  qr_code_text TEXT NOT NULL,  -- Copia e Cola
  txid TEXT UNIQUE NOT NULL,  -- ID da transacao PIX (Mercado Pago payment ID)

  -- Status
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'paid', 'expired', 'cancelled'

  -- Datas
  expires_at TIMESTAMPTZ NOT NULL,
  paid_at TIMESTAMPTZ,

  -- Dados do pagador
  payer_name TEXT,
  payer_email TEXT,
  payer_cpf_cnpj TEXT,

  -- Metadata
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Enums**:

- `status`: `pending`, `paid`, `expired`, `cancelled`

---

#### Tabela: `nfe`

Representa uma Nota Fiscal Eletronica (NFe).

```sql
CREATE TABLE nfe (
  id TEXT PRIMARY KEY,

  -- Referencia ao pedido
  order_id TEXT NOT NULL,

  -- Dados da NFe
  nfe_number TEXT,  -- Numero da nota
  access_key TEXT,  -- Chave de acesso (44 digitos)

  -- URLs
  xml_url TEXT,
  pdf_url TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'issued', 'rejected', 'cancelled'

  -- Data de emissao
  issued_at TIMESTAMPTZ,

  -- Erro (caso rejeicao)
  error_message TEXT,

  -- Dados do cliente
  customer_cpf_cnpj TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,

  -- Endereco do cliente
  customer_address JSONB NOT NULL,  -- BrazilianAddress

  -- Itens da NFe
  items JSONB NOT NULL,  -- Array de NFeItem

  -- Valores
  total_amount INTEGER NOT NULL,  -- Em centavos
  shipping_amount INTEGER,  -- Em centavos

  -- Metadata (dados do provider)
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Enums**:

- `status`: `pending`, `issued`, `rejected`, `cancelled`

**JSONB Structure**:

- `customer_address`:

```json
{
  "street": "Rua Exemplo",
  "number": "123",
  "complement": "Apto 45",
  "neighborhood": "Bairro",
  "city": "Sao Paulo",
  "state": "SP",
  "zip_code": "01234-567",
  "country": "BR"
}
```

- `items`:

```json
[
  {
    "name": "Produto A",
    "quantity": 2,
    "unit_price": 5000,  // R$ 50,00
    "total_price": 10000,
    "ncm": "12345678",  // Codigo NCM
    "cfop": "5102"  // Codigo Fiscal de Operacoes
  }
]
```

---

#### Tabela: `shipping_quote`

Armazena cotacoes de frete (Melhor Envio).

```sql
CREATE TABLE shipping_quote (
  id TEXT PRIMARY KEY,

  -- Referencia
  cart_id TEXT,
  order_id TEXT,

  -- Origem
  from_zip_code TEXT NOT NULL,

  -- Destino
  to_zip_code TEXT NOT NULL,
  to_address JSONB NOT NULL,

  -- Dimensoes e peso
  weight_kg NUMERIC NOT NULL,
  height_cm INTEGER NOT NULL,
  width_cm INTEGER NOT NULL,
  length_cm INTEGER NOT NULL,

  -- Cotacoes
  quotes JSONB NOT NULL,  -- Array de ShippingOption
  selected_service TEXT,  -- Ex: "SEDEX", "PAC"

  -- Valores
  selected_price INTEGER,  -- Em centavos
  selected_delivery_days INTEGER,

  -- Metadata
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);
```

**JSONB Structure** (`quotes`):

```json
[
  {
    "service": "SEDEX",
    "carrier": "Correios",
    "price": 2500,  // R$ 25,00
    "delivery_days": 3,
    "company": {
      "id": 1,
      "name": "Correios"
    }
  },
  {
    "service": "PAC",
    "carrier": "Correios",
    "price": 1500,
    "delivery_days": 7,
    "company": {
      "id": 1,
      "name": "Correios"
    }
  }
]
```

---

### Crypto Payment Module

Pagamento com criptomoedas via Coinbase Commerce.

#### Tabela: `crypto_payment`

```sql
CREATE TABLE crypto_payment (
  id TEXT PRIMARY KEY,

  -- Relations
  order_id TEXT NOT NULL,
  customer_id TEXT,

  -- Provider information
  provider TEXT NOT NULL DEFAULT 'coinbase_commerce',  -- 'coinbase_commerce', 'coinbase_wallet', 'binance_pay'
  provider_charge_id TEXT NOT NULL UNIQUE,  -- Coinbase Commerce charge ID
  provider_checkout_url TEXT NOT NULL,  -- URL para pagamento

  -- Payment amounts
  amount_cents INTEGER NOT NULL,  -- Valor em centavos (BRL ou USD)
  amount_crypto TEXT,  -- Valor em crypto (ex: "0.0012 BTC")
  currency_crypto TEXT,  -- 'BTC', 'ETH', 'USDC', 'MATIC'

  -- Status
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending', 'confirmed', 'failed', 'expired'

  -- Blockchain information
  blockchain_network TEXT,  -- 'ethereum', 'bitcoin', 'polygon'
  blockchain_tx_hash TEXT,  -- Transaction hash
  blockchain_confirmations INTEGER,  -- Numero de confirmacoes

  -- Timestamps
  expires_at TIMESTAMPTZ NOT NULL,
  confirmed_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Enums**:

- `provider`: `coinbase_commerce`, `coinbase_wallet`, `binance_pay`
- `status`: `pending`, `confirmed`, `failed`, `expired`
- `currency_crypto`: `BTC`, `ETH`, `USDC`, `MATIC`, `LTC`

---

## Relacionamentos ERD

### Raffle Module

```
┌────────────┐
│   raffle   │
└─────┬──────┘
      │
      │ 1:N
      │
┌─────▼──────────┐
│ raffle_ticket  │
└────────────────┘

┌────────────┐
│   raffle   │
└─────┬──────┘
      │
      │ 1:1
      │
┌─────▼──────────┐
│  raffle_draw   │
└────────────────┘

┌────────────┐           ┌───────────────┐
│  customer  │───────────│ raffle_ticket │
└────────────┘    1:N    └───────────────┘

┌────────────┐           ┌───────────────┐
│   order    │───────────│ raffle_ticket │
└────────────┘    1:N    └───────────────┘
```

### Brazil Module

```
┌────────────┐           ┌──────────────┐
│   order    │───────────│ pix_payment  │
└────────────┘    1:1    └──────────────┘

┌────────────┐           ┌──────┐
│   order    │───────────│ nfe  │
└────────────┘    1:1    └──────┘

┌────────────┐           ┌────────────────┐
│    cart    │───────────│ shipping_quote │
└────────────┘    1:N    └────────────────┘
```

### Crypto Payment Module

```
┌────────────┐           ┌────────────────┐
│   order    │───────────│ crypto_payment │
└────────────┘    1:1    └────────────────┘

┌────────────┐           ┌────────────────┐
│  customer  │───────────│ crypto_payment │
└────────────┘    1:N    └────────────────┘
```

---

## Indices

### Raffle Module

```sql
-- raffle
CREATE INDEX IDX_raffle_status ON raffle(status);
CREATE INDEX IDX_raffle_product ON raffle(product_id);
CREATE INDEX IDX_raffle_dates ON raffle(start_date, end_date);
CREATE INDEX IDX_raffle_product_type ON raffle(product_type);

-- raffle_ticket
CREATE INDEX IDX_ticket_raffle ON raffle_ticket(raffle_id);
CREATE INDEX IDX_ticket_customer ON raffle_ticket(customer_id);
CREATE INDEX IDX_ticket_order ON raffle_ticket(order_id);
CREATE INDEX IDX_ticket_status ON raffle_ticket(status);
CREATE INDEX IDX_ticket_winner ON raffle_ticket(is_winner);
CREATE UNIQUE INDEX IDX_ticket_number_raffle ON raffle_ticket(raffle_id, ticket_number);
CREATE UNIQUE INDEX IDX_ticket_code ON raffle_ticket(ticket_code);

-- raffle_draw
CREATE INDEX IDX_draw_raffle ON raffle_draw(raffle_id);
CREATE INDEX IDX_draw_status ON raffle_draw(status);
CREATE UNIQUE INDEX IDX_draw_vrf_request ON raffle_draw(vrf_request_id);
```

### Brazil Module

```sql
-- pix_payment
CREATE INDEX IDX_pix_payment_order ON pix_payment(order_id);
CREATE INDEX IDX_pix_payment_status ON pix_payment(status);
CREATE INDEX IDX_pix_payment_expires ON pix_payment(expires_at);
CREATE UNIQUE INDEX IDX_pix_payment_txid ON pix_payment(txid);

-- nfe
CREATE INDEX IDX_nfe_order ON nfe(order_id);
CREATE INDEX IDX_nfe_status ON nfe(status);
CREATE INDEX IDX_nfe_number ON nfe(nfe_number);
CREATE INDEX IDX_nfe_access_key ON nfe(access_key);
CREATE INDEX IDX_nfe_customer ON nfe(customer_cpf_cnpj);

-- shipping_quote
CREATE INDEX IDX_shipping_quote_cart ON shipping_quote(cart_id);
CREATE INDEX IDX_shipping_quote_order ON shipping_quote(order_id);
CREATE INDEX IDX_shipping_quote_expires ON shipping_quote(expires_at);
```

### Crypto Payment Module

```sql
-- crypto_payment
CREATE INDEX IDX_crypto_payment_order ON crypto_payment(order_id);
CREATE INDEX IDX_crypto_payment_customer ON crypto_payment(customer_id);
CREATE INDEX IDX_crypto_payment_status ON crypto_payment(status);
CREATE INDEX IDX_crypto_payment_tx_hash ON crypto_payment(blockchain_tx_hash);
CREATE UNIQUE INDEX IDX_crypto_payment_provider_charge ON crypto_payment(provider_charge_id);
```

---

## Migrations

### Estrutura

Migrations sao gerenciadas pelo MikroORM e ficam em:

```
src/.medusa/migrations/
└── <timestamp>-<nome>.ts
```

Exemplo:

```
src/.medusa/migrations/
├── 20251118120000-create-raffle-module.ts
├── 20251118120100-create-brazil-module.ts
└── 20251118120200-create-crypto-payment-module.ts
```

### Comandos

#### Gerar Migration

```bash
npx medusa db:create-migration <nome>
```

Exemplo:

```bash
npx medusa db:create-migration add-raffle-product-type
```

#### Executar Migrations

```bash
# Local
npx medusa db:migrate

# Docker
docker exec use-nerd-backend npx medusa db:migrate
```

#### Reverter Migration (Rollback)

**Atencao**: MikroORM nao suporta rollback automatico. Voce deve:

1. Criar migration manual de rollback
2. Restaurar backup do banco

### Exemplo de Migration

```typescript
// src/.medusa/migrations/20251118120000-create-raffle-module.ts
import { Migration } from "@mikro-orm/migrations";

export class CreateRaffleModule20251118120000 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE raffle (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        total_tickets INTEGER NOT NULL,
        ticket_price INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    this.addSql(`
      CREATE INDEX IDX_raffle_status ON raffle(status);
    `);
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS raffle CASCADE;`);
  }
}
```

---

## Backup & Restore

### Backup Manual

#### Full Database Dump

```bash
# Via Docker
docker exec use-nerd-postgres pg_dump -U postgres use-nerd > backup_$(date +%Y%m%d_%H%M%S).sql

# Via psql local
pg_dump -h localhost -U postgres -d use-nerd -F c -f backup.dump
```

#### Backup com Compressao

```bash
docker exec use-nerd-postgres pg_dump -U postgres use-nerd | gzip > backup.sql.gz
```

#### Backup de Schema Apenas (sem dados)

```bash
docker exec use-nerd-postgres pg_dump -U postgres -s use-nerd > schema.sql
```

#### Backup de Tabelas Especificas

```bash
docker exec use-nerd-postgres pg_dump -U postgres -d use-nerd -t raffle -t raffle_ticket > raffle_backup.sql
```

---

### Restore

#### Restore Full Database

```bash
# Via Docker
docker exec -i use-nerd-postgres psql -U postgres -d use-nerd < backup.sql

# Via psql local
psql -h localhost -U postgres -d use-nerd -f backup.sql
```

#### Restore com Compressao

```bash
gunzip < backup.sql.gz | docker exec -i use-nerd-postgres psql -U postgres -d use-nerd
```

#### Restore de Dump Customizado

```bash
pg_restore -h localhost -U postgres -d use-nerd -F c backup.dump
```

---

### Backup Automatizado (Cron Job)

#### Script de Backup

Crie `scripts/backup-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="use-nerd_backup_${TIMESTAMP}.sql.gz"

docker exec use-nerd-postgres pg_dump -U postgres use-nerd | gzip > "${BACKUP_DIR}/${FILENAME}"

# Manter apenas ultimos 7 dias
find ${BACKUP_DIR} -name "use-nerd_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completo: ${FILENAME}"
```

#### Cron Job (Linux/Mac)

```bash
# Executar todo dia as 2h da manha
0 2 * * * /path/to/scripts/backup-db.sh
```

---

## Queries Uteis

### Verificar Tamanho das Tabelas

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC
LIMIT 20;
```

### Contar Registros por Tabela

```sql
SELECT
  schemaname,
  tablename,
  n_live_tup AS row_count
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;
```

### Ver Indices de uma Tabela

```sql
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'raffle'
ORDER BY indexname;
```

### Verificar Bloat (Espaco Desperdicado)

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname || '.' || tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename) - pg_relation_size(schemaname || '.' || tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC
LIMIT 10;
```

### Vacuum & Analyze (Manutencao)

```sql
-- Limpar espaco desperdicado
VACUUM ANALYZE raffle;

-- Vacuum completo (requer LOCK)
VACUUM FULL raffle;

-- Reindexar
REINDEX TABLE raffle;
```

---

## Performance Tips

1. **Indices**: Sempre indexe colunas usadas em `WHERE`, `JOIN`, `ORDER BY`
2. **VACUUM**: Execute periodicamente para reclamar espaco
3. **ANALYZE**: Atualize estatisticas para melhor query planning
4. **Connection Pooling**: Use PgBouncer em producao
5. **Monitoring**: Configure `pg_stat_statements` para query profiling

---

## Recursos Adicionais

- [PostgreSQL 15 Documentation](https://www.postgresql.org/docs/15/)
- [MikroORM Migrations](https://mikro-orm.io/docs/migrations)
- [Medusa Database Schema](https://docs.medusajs.com/v2/resources/database-schema)

---

**Mantenedores**: USE Nerd Dev Team
**Contato**: dev@use-nerd.com.br
