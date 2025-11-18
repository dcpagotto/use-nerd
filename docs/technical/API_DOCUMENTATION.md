# USE Nerd - API Documentation

**Version:** 1.0
**Last Updated:** 2025-11-18
**Base URL (Local):** `http://localhost:9000`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URLs](#base-urls)
4. [Common Headers](#common-headers)
5. [Store API Endpoints](#store-api-endpoints)
6. [Admin API Endpoints](#admin-api-endpoints)
7. [Custom Raffle API](#custom-raffle-api)
8. [Strapi CMS API](#strapi-cms-api)
9. [Webhooks](#webhooks)
10. [Error Handling](#error-handling)
11. [Rate Limiting](#rate-limiting)

---

## 1. Overview

USE Nerd exposes two primary REST APIs:

1. **Store API** (`/store/*`): Public-facing endpoints for customers
2. **Admin API** (`/admin/*`): Protected endpoints for administrators

Additionally, custom endpoints exist for:
- **Raffle Module**: Raffle management and ticket sales
- **Strapi CMS**: Content delivery (pages, banners, etc.)

All APIs follow REST conventions and return JSON responses.

---

## 2. Authentication

### Admin API Authentication

**Method:** JWT (JSON Web Token)

**Login:**

```http
POST /admin/auth
Content-Type: application/json

{
  "email": "admin@use-nerd.com.br",
  "password": "your-secure-password"
}
```

**Response:**

```json
{
  "user": {
    "id": "user_01...",
    "email": "admin@use-nerd.com.br",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Using the Token:**

Include the `Authorization` header in all admin requests:

```http
GET /admin/products
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Store API Authentication

**Method:** Publishable API Key

**Header:**

```http
x-publishable-api-key: pk_c9f247ebb15729b47c19f524b7830283750808c68d7d653d587935fef8224e55
```

**Note:** The publishable key is safe to expose in frontend code.

---

### Customer Authentication

**Login:**

```http
POST /store/auth
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "customer-password"
}
```

**Response:**

```json
{
  "customer": {
    "id": "cus_01...",
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "has_account": true
  }
}
```

**Session Management:**

Customer sessions are managed via HTTP-only cookies automatically.

---

## 3. Base URLs

| Environment | Store API | Admin API | Strapi CMS |
|------------|-----------|-----------|------------|
| **Local** | `http://localhost:9000/store` | `http://localhost:9000/admin` | `http://localhost:1337/api` |
| **Production** | `https://api.use-nerd.com.br/store` | `https://api.use-nerd.com.br/admin` | `https://cms.use-nerd.com.br/api` |

---

## 4. Common Headers

### Required Headers

#### Store API

```http
Content-Type: application/json
x-publishable-api-key: pk_c9f247ebb15729b47c19f524b7830283...
```

#### Admin API

```http
Content-Type: application/json
Authorization: Bearer {access_token}
```

### Optional Headers

```http
Accept-Language: pt-BR, en-US
x-cart-id: cart_01...            # For cart operations
```

---

## 5. Store API Endpoints

### Products

#### List Products

```http
GET /store/products
x-publishable-api-key: pk_xxx...
```

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `limit` | number | Number of products to return | `?limit=20` |
| `offset` | number | Pagination offset | `?offset=0` |
| `q` | string | Search query | `?q=cyberpunk` |
| `collection_id` | string | Filter by collection | `?collection_id=pcol_01...` |
| `type_id` | string | Filter by type | `?type_id=ptyp_01...` |

**Response:**

```json
{
  "products": [
    {
      "id": "prod_bonecyber",
      "title": "Boné Snapback Cyberpunk",
      "subtitle": null,
      "description": "Boné estilo snapback com tema cyberpunk",
      "handle": "bone-snapback-cyberpunk",
      "is_giftcard": false,
      "discountable": true,
      "thumbnail": "https://example.com/images/bone.jpg",
      "weight": null,
      "length": null,
      "height": null,
      "width": null,
      "material": "Algodão",
      "collection_id": "pcol_01...",
      "collection": {
        "id": "pcol_01...",
        "title": "Acessórios Cyberpunk",
        "handle": "acessorios-cyberpunk"
      },
      "images": [
        {
          "id": "img_01...",
          "url": "https://example.com/images/bone-front.jpg"
        }
      ],
      "options": [
        {
          "id": "opt_01...",
          "title": "Cor",
          "values": [
            { "id": "optval_01...", "value": "Preto" },
            { "id": "optval_02...", "value": "Roxo" }
          ]
        }
      ],
      "variants": [
        {
          "id": "variant_01...",
          "title": "Preto",
          "sku": "BONE-CYBER-BLK",
          "barcode": null,
          "inventory_quantity": 100,
          "allow_backorder": false,
          "manage_inventory": true,
          "options": [
            {
              "id": "optval_01...",
              "value": "Preto",
              "option_id": "opt_01..."
            }
          ]
        }
      ]
    }
  ],
  "count": 15,
  "offset": 0,
  "limit": 20
}
```

---

#### Get Product by ID

```http
GET /store/products/:id
x-publishable-api-key: pk_xxx...
```

**Example:**

```http
GET /store/products/prod_bonecyber
x-publishable-api-key: pk_xxx...
```

**Response:**

```json
{
  "product": {
    "id": "prod_bonecyber",
    "title": "Boné Snapback Cyberpunk",
    "description": "Boné estilo snapback com tema cyberpunk...",
    "handle": "bone-snapback-cyberpunk",
    "variants": [...],
    "images": [...],
    "options": [...]
  }
}
```

---

#### Get Product by Handle (Custom Endpoint)

```http
GET /store/products/by-handle/:handle
x-publishable-api-key: pk_xxx...
```

**Example:**

```http
GET /store/products/by-handle/bone-snapback-cyberpunk
x-publishable-api-key: pk_xxx...
```

**Response:** Same as "Get Product by ID"

---

#### Get All Products (Custom - Includes Products Without Prices)

```http
GET /store/products/all
x-publishable-api-key: pk_xxx...
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | number | Max products (default: 100) |
| `offset` | number | Pagination offset |

**Response:** Same structure as "List Products"

**Use Case:** Admin dashboard, debugging, or products in draft state.

---

#### Get Featured Products (Custom)

```http
GET /store/products/featured
x-publishable-api-key: pk_xxx...
```

**Response:**

```json
{
  "products": [
    {
      "id": "prod_01...",
      "title": "Produto Destaque 1",
      "thumbnail": "...",
      "variants": [...]
    }
  ],
  "count": 5
}
```

**Note:** Returns products tagged with `"featured": true` in metadata.

---

### Cart

#### Create Cart

```http
POST /store/cart
Content-Type: application/json
x-publishable-api-key: pk_xxx...

{
  "region_id": "reg_01KA9D5XQWERTYBRASIL001"
}
```

**Response:**

```json
{
  "cart": {
    "id": "cart_01...",
    "region_id": "reg_01...",
    "customer_id": null,
    "items": [],
    "subtotal": 0,
    "total": 0,
    "created_at": "2025-11-18T12:00:00Z"
  }
}
```

---

#### Get Cart

```http
GET /store/cart/:id
x-publishable-api-key: pk_xxx...
```

**Response:**

```json
{
  "cart": {
    "id": "cart_01...",
    "items": [
      {
        "id": "item_01...",
        "title": "Boné Snapback Cyberpunk",
        "variant_id": "variant_01...",
        "quantity": 2,
        "unit_price": 4500,
        "subtotal": 9000,
        "total": 9000
      }
    ],
    "subtotal": 9000,
    "shipping_total": 1500,
    "tax_total": 0,
    "total": 10500
  }
}
```

---

#### Add Line Item to Cart

```http
POST /store/cart/:id/line-items
Content-Type: application/json
x-publishable-api-key: pk_xxx...

{
  "variant_id": "variant_01...",
  "quantity": 1
}
```

**Response:**

```json
{
  "cart": {
    "id": "cart_01...",
    "items": [
      {
        "id": "item_01...",
        "title": "Boné Snapback Cyberpunk",
        "variant_id": "variant_01...",
        "quantity": 1,
        "unit_price": 4500,
        "total": 4500
      }
    ],
    "total": 4500
  }
}
```

---

#### Update Line Item

```http
POST /store/cart/:id/line-items/:item_id
Content-Type: application/json
x-publishable-api-key: pk_xxx...

{
  "quantity": 3
}
```

---

#### Remove Line Item

```http
DELETE /store/cart/:id/line-items/:item_id
x-publishable-api-key: pk_xxx...
```

---

### Checkout

#### Complete Cart (Create Order)

```http
POST /store/checkout
Content-Type: application/json
x-publishable-api-key: pk_xxx...

{
  "cart_id": "cart_01...",
  "email": "customer@example.com",
  "shipping_address": {
    "first_name": "João",
    "last_name": "Silva",
    "address_1": "Rua Exemplo, 123",
    "city": "São Paulo",
    "province": "SP",
    "postal_code": "01310-100",
    "country_code": "br",
    "phone": "+5511999999999"
  },
  "billing_address": {
    // Same structure as shipping_address
  }
}
```

**Response:**

```json
{
  "order": {
    "id": "order_01...",
    "status": "pending",
    "email": "customer@example.com",
    "items": [...],
    "subtotal": 9000,
    "shipping_total": 1500,
    "total": 10500,
    "payment_status": "awaiting",
    "fulfillment_status": "not_fulfilled"
  }
}
```

---

### Regions

#### List Regions

```http
GET /store/regions
x-publishable-api-key: pk_xxx...
```

**Response:**

```json
{
  "regions": [
    {
      "id": "reg_01...",
      "name": "Brazil",
      "currency_code": "brl",
      "tax_rate": 0,
      "countries": [
        {
          "id": "br",
          "name": "Brazil",
          "iso_2": "br"
        }
      ]
    }
  ]
}
```

---

## 6. Admin API Endpoints

**Note:** All Admin API endpoints require `Authorization: Bearer {token}` header.

### Products

#### List Products (Admin)

```http
GET /admin/products?limit=20&offset=0
Authorization: Bearer {token}
```

**Response:**

```json
{
  "products": [
    {
      "id": "prod_01...",
      "title": "Product Name",
      "status": "published",
      "variants": [...],
      "images": [...]
    }
  ],
  "count": 15,
  "offset": 0,
  "limit": 20
}
```

---

#### Create Product

```http
POST /admin/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Novo Produto",
  "description": "Descrição do produto",
  "handle": "novo-produto",
  "status": "draft",
  "is_giftcard": false,
  "discountable": true,
  "material": "Cotton",
  "weight": 200,
  "variants": [
    {
      "title": "Default",
      "sku": "PROD-001",
      "manage_inventory": true,
      "inventory_quantity": 100,
      "prices": [
        {
          "amount": 5000,
          "currency_code": "brl"
        }
      ]
    }
  ],
  "options": [
    {
      "title": "Tamanho",
      "values": ["P", "M", "G"]
    }
  ],
  "images": [
    {
      "url": "https://example.com/image.jpg"
    }
  ]
}
```

**Response:**

```json
{
  "product": {
    "id": "prod_01...",
    "title": "Novo Produto",
    "status": "draft",
    "variants": [...]
  }
}
```

---

#### Update Product

```http
POST /admin/products/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Product Name",
  "status": "published"
}
```

---

#### Delete Product

```http
DELETE /admin/products/:id
Authorization: Bearer {token}
```

---

### Orders

#### List Orders

```http
GET /admin/orders?limit=20&offset=0
Authorization: Bearer {token}
```

**Response:**

```json
{
  "orders": [
    {
      "id": "order_01...",
      "display_id": 1001,
      "status": "pending",
      "payment_status": "awaiting",
      "fulfillment_status": "not_fulfilled",
      "email": "customer@example.com",
      "customer": {
        "id": "cus_01...",
        "first_name": "João",
        "last_name": "Silva"
      },
      "items": [
        {
          "id": "item_01...",
          "title": "Boné Snapback Cyberpunk",
          "quantity": 2,
          "unit_price": 4500,
          "total": 9000
        }
      ],
      "subtotal": 9000,
      "shipping_total": 1500,
      "total": 10500,
      "created_at": "2025-11-18T12:00:00Z"
    }
  ],
  "count": 42,
  "offset": 0,
  "limit": 20
}
```

---

#### Get Order

```http
GET /admin/orders/:id
Authorization: Bearer {token}
```

---

#### Update Order

```http
POST /admin/orders/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "completed"
}
```

---

### Customers

#### List Customers

```http
GET /admin/customers?limit=20
Authorization: Bearer {token}
```

**Response:**

```json
{
  "customers": [
    {
      "id": "cus_01...",
      "email": "customer@example.com",
      "first_name": "João",
      "last_name": "Silva",
      "has_account": true,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "count": 150,
  "offset": 0,
  "limit": 20
}
```

---

## 7. Custom Raffle API

### Store API (Public)

#### List Active Raffles

```http
GET /store/raffles?status=active
x-publishable-api-key: pk_xxx...
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `active`, `completed`, `draft` |
| `limit` | number | Results per page |
| `offset` | number | Pagination offset |

**Response:**

```json
{
  "raffles": [
    {
      "id": "raffle_01...",
      "title": "Rifa iPhone 15 Pro",
      "description": "Concorra a um iPhone 15 Pro novo na caixa!",
      "prize_description": "iPhone 15 Pro 256GB - Titânio Natural",
      "total_tickets": 10000,
      "tickets_sold": 2547,
      "tickets_available": 7453,
      "ticket_price": 500,
      "max_tickets_per_customer": 100,
      "start_date": "2025-11-01T00:00:00Z",
      "end_date": "2025-12-31T23:59:59Z",
      "draw_date": "2026-01-01T20:00:00Z",
      "status": "active",
      "image_url": "https://example.com/images/iphone-raffle.jpg",
      "product_type": "electronics",
      "product_specifications": {
        "category": "smartphone",
        "brand": "Apple",
        "model": "iPhone 15 Pro",
        "specifications": {
          "storage": "256GB",
          "color": "Titânio Natural"
        },
        "warranty_months": 12,
        "condition": "new"
      },
      "delivery_type": "shipping",
      "delivery_estimate_days": 7,
      "created_at": "2025-10-15T10:00:00Z"
    }
  ],
  "count": 3,
  "offset": 0,
  "limit": 10
}
```

---

#### Get Raffle Details

```http
GET /store/raffles/:id
x-publishable-api-key: pk_xxx...
```

**Example:**

```http
GET /store/raffles/raffle_01...
x-publishable-api-key: pk_xxx...
```

**Response:**

```json
{
  "raffle": {
    "id": "raffle_01...",
    "title": "Rifa iPhone 15 Pro",
    "description": "...",
    "total_tickets": 10000,
    "tickets_sold": 2547,
    "ticket_price": 500,
    "draw_date": "2026-01-01T20:00:00Z",
    "status": "active",
    "product_specifications": {...},
    "terms_and_conditions": "Regulamento completo da rifa..."
  },
  "stats": {
    "total_revenue": 1273500,
    "unique_customers": 456,
    "average_tickets_per_customer": 5.6
  }
}
```

---

#### Get Raffle Stats (Public)

```http
GET /store/raffles/:id/stats
x-publishable-api-key: pk_xxx...
```

**Response:**

```json
{
  "total_tickets": 10000,
  "tickets_sold": 2547,
  "tickets_available": 7453,
  "total_revenue": 1273500,
  "unique_customers": 456,
  "average_tickets_per_customer": 5.6,
  "progress_percentage": 25.47
}
```

---

### Admin API (Protected)

#### Create Raffle

```http
POST /admin/raffles
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Rifa MacBook Pro M3",
  "description": "Concorra a um MacBook Pro M3 novo na caixa!",
  "prize_description": "MacBook Pro 14\" M3 Pro - 36GB RAM - 1TB SSD",
  "total_tickets": 5000,
  "ticket_price": 1000,
  "max_tickets_per_customer": 50,
  "start_date": "2025-12-01T00:00:00Z",
  "end_date": "2026-01-31T23:59:59Z",
  "draw_date": "2026-02-01T20:00:00Z",
  "status": "draft",
  "image_url": "https://example.com/images/macbook.jpg",
  "product_type": "computer",
  "product_specifications": {
    "brand": "Apple",
    "model": "MacBook Pro 14\"",
    "processor": "Apple M3 Pro",
    "ram": "36GB Unified Memory",
    "storage": "1TB SSD",
    "screen_size": "14.2 polegadas",
    "operating_system": "macOS Sonoma",
    "warranty_months": 12,
    "condition": "new"
  },
  "supplier_name": "Apple Store Brasil",
  "supplier_contact": "sac@apple.com.br",
  "delivery_type": "shipping",
  "delivery_estimate_days": 5,
  "terms_and_conditions": "Regulamento..."
}
```

**Response:**

```json
{
  "raffle": {
    "id": "raffle_02...",
    "title": "Rifa MacBook Pro M3",
    "status": "draft",
    "total_tickets": 5000,
    "ticket_price": 1000,
    "created_at": "2025-11-18T14:30:00Z"
  }
}
```

---

#### Update Raffle

```http
POST /admin/raffles/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Updated description",
  "image_url": "https://new-image.jpg"
}
```

**Note:** Only certain fields can be updated after raffle is published:
- `description`
- `image_url`
- `terms_and_conditions`
- `metadata`

---

#### Publish Raffle (Change Status to Active)

```http
POST /admin/raffles/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "active"
}
```

---

#### Execute Raffle Draw (Test Endpoint)

```http
POST /admin/raffles/:id/test-draw
Authorization: Bearer {token}
Content-Type: application/json

{}
```

**Response:**

```json
{
  "success": true,
  "raffle_id": "raffle_01...",
  "winner": {
    "ticket_id": "ticket_1234...",
    "ticket_number": 7823,
    "customer_id": "cus_01...",
    "customer_email": "winner@example.com"
  },
  "draw": {
    "id": "draw_01...",
    "raffle_id": "raffle_01...",
    "executed_at": "2025-11-18T15:00:00Z",
    "status": "completed"
  }
}
```

**Note:** This is a test endpoint for development. Production draws will use Chainlink VRF.

---

#### List Raffle Tickets (Admin)

```http
GET /admin/raffles/:id/tickets?limit=50
Authorization: Bearer {token}
```

**Response:**

```json
{
  "tickets": [
    {
      "id": "ticket_01...",
      "raffle_id": "raffle_01...",
      "ticket_number": 1,
      "ticket_code": "RAFFLE-001-0001",
      "customer_id": "cus_01...",
      "order_id": "order_01...",
      "price_paid": 500,
      "status": "paid",
      "is_winner": false,
      "created_at": "2025-11-10T12:00:00Z"
    }
  ],
  "count": 2547,
  "offset": 0,
  "limit": 50
}
```

---

## 8. Strapi CMS API

**Base URL:** `http://localhost:1337/api`

### Get All Pages

```http
GET /api/pages?populate=*
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Sobre Nós",
        "slug": "sobre",
        "content": [
          {
            "type": "paragraph",
            "children": [
              {
                "type": "text",
                "text": "Bem-vindo à USE Nerd..."
              }
            ]
          }
        ],
        "seo": {
          "metaTitle": "Sobre Nós - USE Nerd",
          "metaDescription": "...",
          "keywords": "..."
        },
        "publishedAt": "2025-11-01T10:00:00Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 5
    }
  }
}
```

---

### Get Page by Slug

```http
GET /api/pages?filters[slug][$eq]=sobre&populate=*
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Sobre Nós",
        "slug": "sobre",
        "content": [...],
        "seo": {...}
      }
    }
  ]
}
```

---

### Get Banners

```http
GET /api/banners?populate=*
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Black Friday 2025",
        "description": "Até 50% de desconto!",
        "image": {
          "data": {
            "attributes": {
              "url": "/uploads/banner_bf_2025.jpg"
            }
          }
        },
        "link": "/produtos",
        "active": true,
        "order": 1
      }
    }
  ]
}
```

---

### Get Hero Section

```http
GET /api/hero-section?populate=*
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Bem-vindo à USE Nerd",
      "subtitle": "Produtos exclusivos e rifas transparentes",
      "ctaText": "Ver Rifas",
      "ctaLink": "/rifas",
      "backgroundImage": {
        "data": {
          "attributes": {
            "url": "/uploads/hero_bg.jpg"
          }
        }
      }
    }
  }
}
```

---

### Get Winners (Nerd Premiado)

```http
GET /api/nerd-premiados?populate=*&sort=winDate:desc
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "João Silva",
        "prize": "iPhone 15 Pro",
        "winDate": "2025-10-15",
        "photo": {
          "data": {
            "attributes": {
              "url": "/uploads/winner_joao.jpg"
            }
          }
        },
        "testimonial": "Não acreditei quando recebi a ligação!"
      }
    }
  ]
}
```

---

## 9. Webhooks

### Stripe Webhook

**Endpoint:** `POST /webhooks/stripe`

**Events Handled:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

**Security:** HMAC signature verification required

**Example Event:**

```json
{
  "id": "evt_...",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_...",
      "amount": 10500,
      "currency": "brl",
      "status": "succeeded",
      "metadata": {
        "order_id": "order_01..."
      }
    }
  }
}
```

---

### Coinbase Commerce Webhook

**Endpoint:** `POST /api/webhooks/coinbase`

**Events Handled:**
- `charge:created`
- `charge:confirmed`
- `charge:failed`
- `charge:delayed`
- `charge:pending`
- `charge:resolved`

**Security:** HMAC-SHA256 signature verification required

**Example Event:**

```json
{
  "id": "...",
  "scheduled_for": "2025-11-18T12:00:00Z",
  "event": {
    "id": "...",
    "type": "charge:confirmed",
    "data": {
      "id": "charge_id",
      "code": "ABC123",
      "name": "Order #12345",
      "description": "Products",
      "pricing": {
        "local": {
          "amount": "100.00",
          "currency": "BRL"
        }
      },
      "payments": [
        {
          "network": "ethereum",
          "transaction_id": "0x...",
          "status": "CONFIRMED",
          "value": {
            "crypto": {
              "amount": "0.035",
              "currency": "ETH"
            }
          }
        }
      ]
    }
  }
}
```

---

### Chainlink VRF Webhook (Planned)

**Endpoint:** `POST /api/webhooks/chainlink`

**Purpose:** Receive random number from Chainlink VRF oracle for raffle draws

**Security:** Signature verification + contract address validation

---

## 10. Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "type": "invalid_request_error",
  "message": "Product not found",
  "code": "product_not_found"
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| **200** | OK | Request successful |
| **201** | Created | Resource created successfully |
| **400** | Bad Request | Invalid request parameters |
| **401** | Unauthorized | Missing or invalid authentication |
| **403** | Forbidden | Insufficient permissions |
| **404** | Not Found | Resource not found |
| **409** | Conflict | Resource conflict (e.g., duplicate) |
| **422** | Unprocessable Entity | Validation errors |
| **500** | Internal Server Error | Server-side error |

### Common Error Types

#### Invalid Request

```json
{
  "type": "invalid_request_error",
  "message": "Missing required field: variant_id",
  "code": "missing_field"
}
```

#### Validation Error

```json
{
  "type": "validation_error",
  "message": "Invalid email format",
  "code": "invalid_email",
  "field": "email"
}
```

#### Authentication Error

```json
{
  "type": "authentication_error",
  "message": "Invalid or expired token",
  "code": "invalid_token"
}
```

#### Resource Not Found

```json
{
  "type": "not_found_error",
  "message": "Product with id 'prod_xxx' not found",
  "code": "product_not_found"
}
```

---

## 11. Rate Limiting

**Status:** Not yet implemented

**Planned Limits:**
- Store API: 100 requests per minute per IP
- Admin API: 500 requests per minute per user
- Webhook endpoints: No rate limit (authenticated via signature)

**Response Headers (Planned):**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1700000000
```

**Rate Limit Exceeded Response:**
```json
{
  "type": "rate_limit_error",
  "message": "Too many requests. Please try again in 60 seconds.",
  "code": "rate_limit_exceeded"
}
```

---

## Appendix

### Pagination

All list endpoints support pagination:

**Query Parameters:**
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Number of results to skip

**Example:**
```http
GET /store/products?limit=50&offset=100
```

**Response Metadata:**
```json
{
  "products": [...],
  "count": 500,
  "offset": 100,
  "limit": 50
}
```

---

### Filtering

Many endpoints support filtering:

**Example:**
```http
GET /store/products?collection_id=pcol_01...&is_giftcard=false
```

---

### Sorting

Use `order` parameter for sorting (Admin API):

**Example:**
```http
GET /admin/orders?order=-created_at
```

- `-created_at`: Descending (newest first)
- `created_at`: Ascending (oldest first)

---

### Expanding Relations

Use `expand` parameter to include related resources:

**Example:**
```http
GET /store/products?expand=variants,images,collection
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-18 | Initial API documentation |

---

**Document Maintained By:** USE Nerd Development Team
**Contact:** dhiego@pagotto.eu
**Support:** https://github.com/use-nerd/api-docs/issues
