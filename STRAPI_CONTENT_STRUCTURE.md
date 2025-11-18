# Strapi Content Structure - Visual Overview

## Content Hierarchy

```
USE Nerd CMS Content
│
├─── 🌐 Global Configuration (1)
│    └── Site Settings
│        ├── Site Name: "USE Nerd"
│        ├── Description: "A loja geek mais nerd do Brasil..."
│        └── Contact: contato@usenerd.com.br
│
├─── 🎯 Homepage (1)
│    └── Hero Section
│        ├── Title: "Bem-vindo ao Futuro Geek"
│        ├── Subtitle: "Descubra produtos exclusivos..."
│        └── CTA: "Explorar Produtos" → /produtos
│
├─── 🎪 Promotional Banners (5)
│    ├── [1] Black Friday Nerd → /promocoes/black-friday
│    ├── [2] Frete Grátis → /produtos
│    ├── [3] Nova Coleção Gamer → /produtos/camisetas
│    ├── [4] Cupom Primeira Compra → /cadastro
│    └── [5] Programa de Afiliados → /afiliados
│
├─── 📄 Dynamic Pages (4)
│    ├── Sobre Nós (sobre)
│    │   └── ~450 words
│    ├── Como Funciona (como-funciona)
│    │   └── ~1,200 words
│    ├── Blog: Coleção Cyberpunk (lancamento-colecao-cyberpunk-2024)
│    │   └── ~1,800 words
│    └── Termos e Condições (termos)
│        └── ~2,200 words
│
└─── 🏆 Winners Gallery (5)
     ├── ⭐ João Silva - PlayStation 5 (Aug 15, 2025)
     ├── ⭐ Mariana Costa - Kit Star Wars (Sep 20, 2025)
     ├── ⭐ Pedro Henrique - Notebook Gamer (Oct 25, 2025)
     ├── Ana Carolina - Kit Mangás (Jul 10, 2025)
     └── Lucas Martins - HQs Raras (Jun 05, 2025)
```

---

## Database Structure

```
PostgreSQL Database: use-nerd
└── Schema: strapi
    │
    ├── site_settings (1 record)
    │   ├── id: 1
    │   ├── site_name: "USE Nerd"
    │   ├── site_description: text
    │   ├── contact_email: "contato@usenerd.com.br"
    │   └── timestamps + user refs
    │
    ├── hero_sections (1 record)
    │   ├── id: 1
    │   ├── title: "Bem-vindo ao Futuro Geek"
    │   ├── subtitle: text
    │   ├── cta_text: "Explorar Produtos"
    │   ├── cta_link: "/produtos"
    │   └── timestamps + user refs
    │
    ├── banners (5 records)
    │   ├── id: 1-5
    │   ├── title: varchar
    │   ├── description: text
    │   ├── link: varchar
    │   ├── active: boolean
    │   ├── position: integer (1-5)
    │   └── timestamps + user refs
    │
    ├── pages (4 records)
    │   ├── id: 1-4
    │   ├── title: varchar
    │   ├── slug: varchar (unique)
    │   ├── content: text (markdown)
    │   ├── published: boolean
    │   └── timestamps + user refs
    │
    └── nerd_premiados (5 records)
        ├── id: 1-5
        ├── winner_name: varchar
        ├── raffle_name: varchar
        ├── prize_description: text
        ├── draw_date: date
        ├── featured: boolean
        └── timestamps + user refs
```

---

## API Endpoints Map

```
Strapi API (http://localhost:1337/api/)
│
├── /banners
│   ├── GET / (list all banners)
│   └── GET /:id (single banner)
│
├── /pages
│   ├── GET / (list all pages)
│   ├── GET /:id (single page)
│   └── GET ?filters[slug][$eq]=sobre (by slug)
│
├── /hero-sections
│   ├── GET / (list hero sections)
│   └── GET /:id (single hero)
│
├── /site-settings
│   ├── GET / (get settings)
│   └── GET /:id (single setting)
│
└── /nerd-premiados
    ├── GET / (list all winners)
    ├── GET /:id (single winner)
    └── GET ?filters[featured][$eq]=true (featured only)
```

---

## Content Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Strapi Admin Panel                     │
│                   http://localhost:1337/admin               │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ Manages Content
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 PostgreSQL Database (use-nerd)              │
│                      Schema: strapi                         │
│  ┌─────────────┬─────────────┬─────────────┬──────────────┐│
│  │site_settings│hero_sections│   banners   │    pages     ││
│  └─────────────┴─────────────┴─────────────┴──────────────┘│
│  ┌──────────────────────────────────────────────────────────│
│  │             nerd_premiados (winners)                    ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ Exposes via API
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Strapi REST API                        │
│                   http://localhost:1337/api                 │
│                                                             │
│  /banners  /pages  /hero-sections  /site-settings          │
│                  /nerd-premiados                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          │ Consumed by Frontend
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Frontend (Storefront)                  │
│                   http://localhost:3000                     │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐     │
│  │  Hero   │  │ Banners │  │  Pages  │  │ Winners  │     │
│  └─────────┘  └─────────┘  └─────────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Content by Type

### 1. Site Settings (Singleton)
```yaml
Type: Global Configuration
Count: 1 record
Purpose: Site-wide settings
Access: Single entity
Fields:
  - site_name
  - site_description
  - contact_email
```

### 2. Hero Section (Singleton)
```yaml
Type: Homepage Feature
Count: 1 record
Purpose: Main hero banner
Access: Single entity
Fields:
  - title
  - subtitle
  - cta_text
  - cta_link
```

### 3. Banners (Collection)
```yaml
Type: Promotional Content
Count: 5 records
Purpose: Marketing messages
Access: Collection (can be filtered/sorted)
Fields:
  - title
  - description
  - link
  - active (boolean)
  - position (order)
Features:
  - Active/Inactive toggle
  - Position-based ordering
  - All currently active
```

### 4. Pages (Collection)
```yaml
Type: Dynamic Content
Count: 4 records
Purpose: Static pages with markdown
Access: Collection (filterable by slug)
Fields:
  - title
  - slug (unique)
  - content (markdown)
  - published (boolean)
Pages:
  - sobre (About Us)
  - como-funciona (How It Works)
  - lancamento-colecao-cyberpunk-2024 (Blog Post)
  - termos (Terms & Conditions)
```

### 5. Nerd Premiados (Collection)
```yaml
Type: Social Proof
Count: 5 records
Purpose: Winner testimonials
Access: Collection (filterable by featured)
Fields:
  - winner_name
  - raffle_name
  - prize_description
  - draw_date
  - featured (boolean)
Featured: 3 out of 5
```

---

## Frontend Integration Points

### Homepage
```tsx
Components that need CMS data:
├── HeroSection
│   └── Fetches: /api/hero-sections
├── BannersCarousel
│   └── Fetches: /api/banners?filters[active][$eq]=true&sort=position:asc
└── FeaturedWinners
    └── Fetches: /api/nerd-premiados?filters[featured][$eq]=true
```

### Dynamic Pages
```tsx
Component: DynamicPage
Route: /[slug]
Fetches: /api/pages?filters[slug][$eq]={slug}

Pages:
- /sobre → slug: sobre
- /como-funciona → slug: como-funciona
- /blog/lancamento-colecao-cyberpunk-2024 → slug: lancamento-colecao-cyberpunk-2024
- /termos → slug: termos
```

### Global Layout
```tsx
Components:
├── Header/Footer
│   └── Fetches: /api/site-settings
└── Navigation
    └── Can use page slugs from /api/pages
```

---

## Content Relationships

```
Site Settings (Global)
└─── No relations

Hero Section (Global)
└─── No relations

Banners
├─── Ordered by: position
└─── Filtered by: active

Pages
├─── Unique by: slug
├─── Filtered by: published
└─── May have: components (SEO, etc.)

Nerd Premiados
├─── Ordered by: draw_date DESC
├─── Filtered by: featured
└─── May have: media (photos)
```

---

## Query Examples

### Get Active Banners in Order
```
GET /api/banners?filters[active][$eq]=true&sort=position:asc
```

### Get Page by Slug
```
GET /api/pages?filters[slug][$eq]=sobre
```

### Get Featured Winners
```
GET /api/nerd-premiados?filters[featured][$eq]=true&sort=draw_date:desc
```

### Get Hero Section
```
GET /api/hero-sections
```

### Get Site Settings
```
GET /api/site-settings
```

---

## Permission Requirements

### Public Role Must Have:
```
✓ Banner.find
✓ Banner.findOne
✓ Page.find
✓ Page.findOne
✓ Hero-section.find
✓ Hero-section.findOne
✓ Site-setting.find
✓ Site-setting.findOne
✓ Nerd-premiado.find
✓ Nerd-premiado.findOne
```

---

## Statistics

```
┌─────────────────────────────────────┐
│      Content Statistics             │
├─────────────────────────────────────┤
│ Total Content Types:  5             │
│ Total Records:        16            │
│ Total Words:          ~5,850        │
│ Language:             PT-BR         │
│ Markdown Pages:       4             │
│ Active Banners:       5             │
│ Featured Winners:     3             │
│ Database Size:        ~50KB         │
└─────────────────────────────────────┘
```

---

**Created**: 2025-11-17
**Status**: ✅ Production Ready (pending API permissions)
