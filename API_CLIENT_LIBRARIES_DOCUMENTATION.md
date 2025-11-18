# API Client Libraries - Complete Documentation

## Overview

This documentation covers the comprehensive, type-safe API client libraries for consuming both **Strapi CMS** and **Medusa Backend** APIs from the Next.js 14 storefront.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 14 Storefront                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────┐  ┌──────────────────────────┐ │
│  │   data-fetcher.ts       │  │  Component/Page Layer    │ │
│  │  (Unified Facade)       │◄─┤  - Homepage              │ │
│  └───────┬─────────────────┘  │  - Raffle Detail         │ │
│          │                    │  - Nerd Premiado         │ │
│          ▼                    └──────────────────────────┘ │
│  ┌─────────────┐  ┌─────────────────┐                     │
│  │ strapi-     │  │ medusa-         │                     │
│  │ client.ts   │  │ enhanced.ts     │                     │
│  └──────┬──────┘  └────────┬────────┘                     │
│         │                  │                              │
│         │                  │                              │
│  ┌──────▼──────┐  ┌────────▼────────┐                     │
│  │ strapi-     │  │ medusa-api.ts   │                     │
│  │ utils.ts    │  │ medusa-client.ts│                     │
│  └─────────────┘  └─────────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
         │                            │
         ▼                            ▼
┌─────────────────┐          ┌─────────────────┐
│  Strapi CMS     │          │  Medusa Backend │
│  localhost:1337 │          │  localhost:9000 │
└─────────────────┘          └─────────────────┘
```

## File Structure

```
storefront/
├── lib/
│   ├── types/
│   │   ├── strapi.ts           # Strapi TypeScript types
│   │   └── medusa.ts           # Medusa enhanced types
│   ├── strapi-client.ts        # Strapi API client
│   ├── strapi-utils.ts         # Strapi utility functions
│   ├── medusa-enhanced.ts      # Enhanced Medusa client (raffles)
│   ├── medusa-api.ts           # Base Medusa API (existing)
│   ├── medusa-client.ts        # Medusa SDK client (existing)
│   └── data-fetcher.ts         # Unified data fetcher
├── __tests__/
│   └── api-clients.test.ts     # Comprehensive test suite
└── .env.example                # Environment variables template
```

---

## 1. Type Definitions

### Strapi Types (`lib/types/strapi.ts`)

Complete TypeScript interfaces for all 7 Strapi content types:

1. **Hero Section** - Homepage hero banner
2. **Banner** - Promotional banners
3. **Page** - Static pages (About, Terms, etc.)
4. **Nerd Premiado** - Winners showcase page
5. **Featured Product** - Homepage featured products
6. **Site Settings** - Global site configuration
7. **Blog Post** - News and updates

**Key Types:**
- `StrapiResponse<T>` - Generic response wrapper
- `StrapiMedia` - Image/media handling
- `StrapiQueryParams` - Query parameters (populate, filters, sort, pagination)
- `StrapiError` - Error handling

### Medusa Types (`lib/types/medusa.ts`)

Extended types for the raffle module:

**Enums:**
- `RaffleStatus` - draft, active, sold_out, drawing, completed, cancelled
- `TicketStatus` - reserved, paid, minted, winner
- `DrawStatus` - requested, pending, completed, failed
- `ProductType` - computer, car, motorcycle, electronics, appliance, cash, travel, other

**Product Specifications:**
- `ComputerSpecs` - Full computer specifications
- `CarSpecs` - Vehicle specifications
- `MotorcycleSpecs` - Motorcycle specifications
- `ElectronicsSpecs` - Electronics details
- `ApplianceSpecs` - Appliance specifications
- `CashSpecs` - Cash prize details
- `TravelSpecs` - Travel package details

**Models:**
- `Raffle` - Complete raffle information
- `RaffleTicket` - Ticket details
- `RaffleDraw` - Draw information
- `RaffleStats` - Statistics and metrics
- `WinnerInfo` - Winner information
- `BlockchainVerification` - Blockchain verification data

---

## 2. Strapi Client (`lib/strapi-client.ts`)

### Features

- Full TypeScript typing for all responses
- Error handling with custom `StrapiAPIError`
- Next.js 14 ISR caching support
- Portuguese (pt-BR) locale by default
- Strapi query parameter support (via `qs` library)
- Optional API token authentication

### API Methods

#### Hero Section

```typescript
import { getHeroSection } from '@/lib/strapi-client';

const hero = await getHeroSection('pt-BR', 60); // revalidate every 60s
console.log(hero.data.attributes.title);
```

#### Banners

```typescript
import { getBanners, getBanner } from '@/lib/strapi-client';

// Get all homepage banners
const banners = await getBanners('homepage', true);

// Get single banner
const banner = await getBanner(1);
```

#### Pages

```typescript
import { getPages, getPageBySlug, getPage } from '@/lib/strapi-client';

// Get all menu pages
const pages = await getPages(true);

// Get page by slug
const aboutPage = await getPageBySlug('sobre');

// Get page by ID
const page = await getPage(1);
```

#### Nerd Premiado

```typescript
import { getNerdPremiado } from '@/lib/strapi-client';

const nerdPremiado = await getNerdPremiado();
console.log(nerdPremiado.data.attributes.winnerAnnouncements);
```

#### Featured Products

```typescript
import { getFeaturedProducts, getFeaturedProduct } from '@/lib/strapi-client';

// Get all active featured products
const featured = await getFeaturedProducts(true);

// Get single featured product
const product = await getFeaturedProduct(1);
```

#### Site Settings

```typescript
import { getSiteSettings } from '@/lib/strapi-client';

const settings = await getSiteSettings();
console.log(settings.data.attributes.siteName);
```

#### Blog Posts

```typescript
import { getBlogPosts, getBlogPostBySlug } from '@/lib/strapi-client';

// Get all blog posts with filters
const posts = await getBlogPosts(
  {
    category: 'news',
    featured: true,
    tags: ['raffle', 'winner'],
    search: 'computador',
  },
  'pt-BR',
  1, // page
  10  // pageSize
);

// Get single post by slug
const post = await getBlogPostBySlug('primeiro-ganhador-2024');
```

### Unified Client Export

```typescript
import strapiClient from '@/lib/strapi-client';

// Organized by content type
const hero = await strapiClient.heroSection.get();
const banners = await strapiClient.banners.list('homepage');
const pages = await strapiClient.pages.getBySlug('sobre');
const nerdPremiado = await strapiClient.nerdPremiado.get();
const featuredProducts = await strapiClient.featuredProducts.list();
const settings = await strapiClient.siteSettings.get();
const posts = await strapiClient.blogPosts.list({ featured: true });
```

---

## 3. Strapi Utils (`lib/strapi-utils.ts`)

### Media URL Resolution

```typescript
import { getStrapiMediaUrl, getStrapiMediaObjectUrl, getStrapiMediaAlt } from '@/lib/strapi-utils';

// Convert relative to absolute URL
const url = getStrapiMediaUrl('/uploads/image.jpg');
// => 'http://localhost:1337/uploads/image.jpg'

// Get specific format from media object
const thumbnailUrl = getStrapiMediaObjectUrl(hero.backgroundImage, 'thumbnail');

// Get alt text
const alt = getStrapiMediaAlt(banner.image, 'Banner image');
```

### Date Formatting

```typescript
import {
  formatStrapiDate,
  formatStrapiDateTime,
  formatStrapiRelativeTime
} from '@/lib/strapi-utils';

// Brazilian date format (DD/MM/YYYY)
formatStrapiDate('2024-01-15T10:30:00Z'); // => '15/01/2024'

// Brazilian datetime format (DD/MM/YYYY HH:MM)
formatStrapiDateTime('2024-01-15T10:30:00Z'); // => '15/01/2024 10:30'

// Relative time in Portuguese
formatStrapiRelativeTime('2024-01-15T10:30:00Z'); // => '2 dias atrás'
```

### Content Processing

```typescript
import { getStrapiExcerpt, markdownToHtml } from '@/lib/strapi-utils';

// Extract plain text excerpt from markdown
const excerpt = getStrapiExcerpt(post.content, 160);

// Convert markdown to basic HTML
const html = markdownToHtml(post.content);
```

### Validation Helpers

```typescript
import { isBannerActive, isMaintenanceMode } from '@/lib/strapi-utils';

// Check if banner is active based on date range
const active = isBannerActive(banner.startDate, banner.endDate);

// Check maintenance mode with bypass token
const maintenance = isMaintenanceMode(settings.maintenanceMode, bypassToken);
```

### SEO Helpers

```typescript
import { buildOpenGraph, generateBlogPostJsonLd } from '@/lib/strapi-utils';

// Build Open Graph metadata
const og = buildOpenGraph({
  title: post.title,
  description: post.excerpt,
  image: getStrapiMediaUrl(post.coverImage?.data?.attributes.url),
  url: `https://use-nerd.com.br/blog/${post.slug}`,
});

// Generate JSON-LD for blog post
const jsonLd = generateBlogPostJsonLd({
  title: post.title,
  excerpt: post.excerpt,
  author: post.author,
  publishedAt: post.publishedAt,
  updatedAt: post.updatedAt,
  coverImage: getStrapiMediaUrl(post.coverImage?.data?.attributes.url),
  url: `https://use-nerd.com.br/blog/${post.slug}`,
});
```

---

## 4. Enhanced Medusa Client (`lib/medusa-enhanced.ts`)

### Features

- Type-safe raffle module endpoints
- Error handling with custom `MedusaAPIError`
- Next.js 14 ISR caching support
- Blockchain verification helpers
- Query parameter building

### Raffle API

```typescript
import {
  getRaffles,
  getActiveRaffles,
  getCompletedRaffles,
  getRaffleById,
  getRaffleStats
} from '@/lib/medusa-enhanced';

// Get all raffles with filters
const raffles = await getRaffles({
  filters: { status: 'active', product_type: 'computer' },
  limit: 10,
  sort: 'created_at:desc',
});

// Get active raffles only
const active = await getActiveRaffles(10, 30); // limit, revalidate

// Get completed raffles with winners
const completed = await getCompletedRaffles(10);

// Get single raffle
const raffle = await getRaffleById('raffle_01XXXXX');

// Get raffle statistics
const stats = await getRaffleStats('raffle_01XXXXX');
console.log(`${stats.stats.tickets_sold} / ${stats.stats.total_tickets} vendidos`);
```

### Ticket API

```typescript
import {
  getRaffleTickets,
  getTicketsByRaffle,
  getTicketsByCustomer,
  purchaseRaffleTickets
} from '@/lib/medusa-enhanced';

// Get all tickets with filters
const tickets = await getRaffleTickets({
  raffle_id: 'raffle_01XXXXX',
  status: 'paid',
  limit: 100,
});

// Get tickets for a raffle
const raffleTickets = await getTicketsByRaffle('raffle_01XXXXX');

// Get customer's tickets
const myTickets = await getTicketsByCustomer('cus_01XXXXX');

// Purchase tickets (requires authentication)
const purchased = await purchaseRaffleTickets(
  'raffle_01XXXXX',
  5, // quantity
  'cart_01XXXXX' // optional cart ID
);
```

### Winners API

```typescript
import { getRaffleWinners, getRaffleWinner } from '@/lib/medusa-enhanced';

// Get recent winners
const winners = await getRaffleWinners(10);

// Get winner for specific raffle
const winner = await getRaffleWinner('raffle_01XXXXX');
if (winner) {
  console.log(`Winner: Ticket #${winner.winner_ticket_number}`);
}
```

### Blockchain Verification

```typescript
import {
  verifyRaffleOnBlockchain,
  getTransactionStatus,
  getBlockchainExplorerUrl,
  getContractExplorerUrl
} from '@/lib/medusa-enhanced';

// Verify raffle on blockchain
const verification = await verifyRaffleOnBlockchain('raffle_01XXXXX');
console.log(`Verified: ${verification.verification.is_verified}`);

// Get transaction status
const txStatus = await getTransactionStatus('0x1234...');

// Get blockchain explorer URLs
const txUrl = getBlockchainExplorerUrl('0x1234...', 'polygon');
const contractUrl = getContractExplorerUrl('0xABCD...', 'polygon');
```

### Unified Client Export

```typescript
import medusaEnhancedClient from '@/lib/medusa-enhanced';

// Organized by resource
const raffles = await medusaEnhancedClient.raffles.getActive();
const tickets = await medusaEnhancedClient.tickets.getByCustomer('cus_01XXX');
const winners = await medusaEnhancedClient.winners.list();
const verification = await medusaEnhancedClient.blockchain.verify('raffle_01XXX');
```

---

## 5. Unified Data Fetcher (`lib/data-fetcher.ts`)

Combines Strapi CMS content with Medusa commerce data.

### Featured Products (Strapi + Medusa)

```typescript
import { getFeaturedProducts } from '@/lib/data-fetcher';

const products = await getFeaturedProducts();
// Returns enriched products with both Medusa data and Strapi metadata
products.forEach(p => {
  console.log(p.title); // from Medusa
  console.log(p.customLabel); // from Strapi
  console.log(p.labelColor); // from Strapi
});
```

### Nerd Premiado Page

```typescript
import { getNerdPremiadoPageData } from '@/lib/data-fetcher';

const pageData = await getNerdPremiadoPageData();

// Static content from Strapi
console.log(pageData.content.title);
console.log(pageData.content.description);

// Live raffle data from Medusa
console.log(`Active raffles: ${pageData.activeRaffles.length}`);
console.log(`Completed raffles: ${pageData.completedRaffles.length}`);

// Enriched winners with blockchain verification
pageData.enrichedWinners.forEach(winner => {
  console.log(winner.name);
  console.log(`Verification: ${winner.verificationStatus}`);
  if (winner.blockchainLink) {
    console.log(`Blockchain: ${winner.blockchainLink}`);
  }
});
```

### Homepage Data

```typescript
import { getHomepageData } from '@/lib/data-fetcher';

const homepage = await getHomepageData();

// Hero section
if (homepage.hero) {
  console.log(homepage.hero.title);
}

// Banners
homepage.banners.forEach(banner => {
  console.log(banner.title);
});

// Featured products (combined)
homepage.featuredProducts.forEach(product => {
  console.log(`${product.title} - ${product.customLabel}`);
});

// Active raffles
homepage.activeRaffles.forEach(raffle => {
  console.log(raffle.title);
});

// Recent winners
homepage.recentWinners.forEach(winner => {
  console.log(`${winner.raffle_title} - Ticket #${winner.winner_ticket_number}`);
});
```

### Raffle Detail Page

```typescript
import { getRaffleDetailData } from '@/lib/data-fetcher';

const detail = await getRaffleDetailData('raffle_01XXXXX');

// Raffle info
console.log(detail.raffle.title);
console.log(detail.raffle.prize_description);

// Statistics
console.log(`${detail.stats.tickets_sold} / ${detail.stats.total_tickets}`);
console.log(`${detail.stats.percentage_sold}% vendidos`);

// Winner (if completed)
if (detail.winner) {
  console.log(`Winner: Ticket #${detail.winner.winner_ticket_number}`);
}

// Blockchain verification
if (detail.blockchain?.is_verified) {
  console.log(`Verified on blockchain: ${detail.blockchain.explorer_url}`);
}
```

---

## 6. Environment Variables

### Required Variables

```env
# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_key_here

# Strapi CMS
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_TOKEN=  # Optional for public content

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=pt-BR

# Blockchain
NEXT_PUBLIC_POLYGON_NETWORK=polygon
NEXT_PUBLIC_POLYGON_CHAIN_ID=137
```

### Optional Variables

```env
# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=
NEXT_PUBLIC_SENTRY_DSN=

# Feature Flags
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true
NEXT_PUBLIC_ENABLE_RAFFLES=true
NEXT_PUBLIC_MAINTENANCE_MODE=false
NEXT_PUBLIC_MAINTENANCE_BYPASS_TOKEN=secret_token
```

---

## 7. Usage Examples

### Next.js 14 Server Component

```typescript
// app/page.tsx
import { getHomepageData } from '@/lib/data-fetcher';
import { getStrapiMediaUrl } from '@/lib/strapi-utils';

export default async function HomePage() {
  const data = await getHomepageData('pt-BR', 60);

  return (
    <main>
      {/* Hero Section */}
      {data.hero && (
        <section
          style={{
            backgroundImage: `url(${getStrapiMediaUrl(data.hero.backgroundImage)})`,
          }}
        >
          <h1>{data.hero.title}</h1>
          <p>{data.hero.subtitle}</p>
          {data.hero.ctaButtonText && (
            <a href={data.hero.ctaButtonLink}>{data.hero.ctaButtonText}</a>
          )}
        </section>
      )}

      {/* Featured Products */}
      <section>
        <h2>Produtos em Destaque</h2>
        <div className="grid grid-cols-3 gap-4">
          {data.featuredProducts.map((product) => (
            <div key={product.id}>
              <img src={product.thumbnail} alt={product.title} />
              <h3>{product.title}</h3>
              {product.customLabel && (
                <span className={getLabelColorClass(product.labelColor)}>
                  {product.customLabel}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Active Raffles */}
      <section>
        <h2>Rifas Ativas</h2>
        {data.activeRaffles.map((raffle) => (
          <div key={raffle.id}>
            <h3>{raffle.title}</h3>
            <p>{raffle.prize_description}</p>
            <p>Valor do ticket: R$ {(raffle.ticket_price / 100).toFixed(2)}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
```

### Raffle Detail Page with Revalidation

```typescript
// app/rifas/[id]/page.tsx
import { getRaffleDetailData } from '@/lib/data-fetcher';
import { formatStrapiDate } from '@/lib/strapi-utils';

interface Props {
  params: { id: string };
}

export const revalidate = 30; // Revalidate every 30 seconds

export default async function RaffleDetailPage({ params }: Props) {
  const data = await getRaffleDetailData(params.id, 30);

  return (
    <main>
      <h1>{data.raffle.title}</h1>
      <p>{data.raffle.prize_description}</p>

      {/* Statistics */}
      <div>
        <h2>Estatísticas</h2>
        <p>Vendidos: {data.stats.tickets_sold} / {data.stats.total_tickets}</p>
        <p>Disponíveis: {data.stats.tickets_available}</p>
        <div className="progress-bar">
          <div style={{ width: `${data.stats.percentage_sold}%` }} />
        </div>
      </div>

      {/* Blockchain Verification */}
      {data.blockchain?.is_verified && (
        <div>
          <h3>Verificado na Blockchain</h3>
          <a href={data.blockchain.explorer_url} target="_blank">
            Ver na PolygonScan
          </a>
        </div>
      )}

      {/* Winner */}
      {data.winner && (
        <div>
          <h3>Ganhador</h3>
          <p>Ticket: #{data.winner.winner_ticket_number}</p>
          <p>Data: {formatStrapiDate(data.winner.winner_drawn_at)}</p>
        </div>
      )}
    </main>
  );
}
```

---

## 8. Testing

Run the test suite:

```bash
cd storefront
npm run test
```

Run with UI:

```bash
npm run test:ui
```

Generate coverage report:

```bash
npm run test:coverage
```

---

## 9. Error Handling

### Strapi Errors

```typescript
import { StrapiAPIError } from '@/lib/strapi-client';

try {
  const hero = await getHeroSection();
} catch (error) {
  if (error instanceof StrapiAPIError) {
    console.error(`Strapi Error [${error.status}]: ${error.message}`);
    console.error('Details:', error.details);
  } else {
    console.error('Unknown error:', error);
  }
}
```

### Medusa Errors

```typescript
import { MedusaAPIError } from '@/lib/medusa-enhanced';

try {
  const raffle = await getRaffleById('invalid_id');
} catch (error) {
  if (error instanceof MedusaAPIError) {
    console.error(`Medusa Error [${error.code}]: ${error.message}`);
    console.error(`Type: ${error.type}, Status: ${error.status}`);
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## 10. Best Practices

### ISR Caching Strategy

- **Static content** (pages, site settings): 300s (5 minutes)
- **Dynamic content** (hero, banners, blog posts): 60s (1 minute)
- **Live data** (active raffles, stats): 30s (30 seconds)
- **Completed raffles, winners**: 60s (1 minute)

### Performance Tips

1. **Use unified data fetchers** for pages that need both Strapi and Medusa data
2. **Leverage Next.js ISR** with appropriate revalidation times
3. **Parallelize requests** using `Promise.all()`
4. **Handle errors gracefully** to prevent entire page failures
5. **Use proper TypeScript types** to catch errors at compile time

### Security

1. **Never expose API tokens** in client-side code
2. **Use environment variables** for all configuration
3. **Validate data** before rendering
4. **Sanitize user inputs** in search/filters
5. **Use HTTPS** in production

---

## 11. Troubleshooting

### Issue: "fetch is not defined"

**Solution:** Ensure you're using Node.js 18+ or install a fetch polyfill.

### Issue: "CORS error when fetching from Strapi"

**Solution:** Configure Strapi CORS settings in `config/middleware.ts`:

```typescript
export default {
  settings: {
    cors: {
      origin: ['http://localhost:3000'],
    },
  },
};
```

### Issue: "Medusa publishable key not working"

**Solution:** Verify the key is correct and has proper permissions:

```bash
# In Medusa backend
npx medusa develop
# Go to admin panel → Settings → Publishable API Keys
```

---

## 12. Migration Guide

If you have existing API calls, migrate them to the new client libraries:

### Before (Old Pattern)

```typescript
const response = await fetch('http://localhost:1337/api/hero-section');
const data = await response.json();
```

### After (New Pattern)

```typescript
import { getHeroSection } from '@/lib/strapi-client';

const data = await getHeroSection();
```

**Benefits:**
- Full TypeScript typing
- Automatic error handling
- Next.js ISR caching
- Query parameter building
- Consistent API across the app

---

## Support

For questions or issues:

1. Check the test suite in `__tests__/api-clients.test.ts` for examples
2. Review type definitions in `lib/types/`
3. Consult this documentation
4. Create an issue in the project repository

---

**Last Updated:** 2025-11-12
**Version:** 1.0.0
**Author:** USE Nerd Development Team
