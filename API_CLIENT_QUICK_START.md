# API Client Libraries - Quick Start Guide

Get up and running with the USE Nerd API client libraries in 5 minutes.

## Setup

### 1. Environment Variables

Create `storefront/.env.local`:

```bash
# Copy the example file
cd storefront
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_key_here

# Strapi CMS
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Application
NEXT_PUBLIC_DEFAULT_LOCALE=pt-BR
```

### 2. Verify Installation

No additional packages needed! The clients use:
- `qs` (already installed via @medusajs/js-sdk)
- `fetch` (built-in Node.js 18+)

## Basic Usage

### Fetch Homepage Data (Easiest)

```typescript
// app/page.tsx
import { getHomepageData } from '@/lib/data-fetcher';

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <main>
      {/* Hero Section */}
      {data.hero && (
        <section>
          <h1>{data.hero.title}</h1>
          <p>{data.hero.subtitle}</p>
        </section>
      )}

      {/* Featured Products */}
      <div className="grid grid-cols-3 gap-4">
        {data.featuredProducts.map(product => (
          <div key={product.id}>
            <h3>{product.title}</h3>
            {product.customLabel && (
              <span className="badge">{product.customLabel}</span>
            )}
          </div>
        ))}
      </div>

      {/* Active Raffles */}
      <div>
        <h2>Rifas Ativas</h2>
        {data.activeRaffles.map(raffle => (
          <div key={raffle.id}>
            <h3>{raffle.title}</h3>
            <p>R$ {(raffle.ticket_price / 100).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
```

### Fetch Strapi Content

```typescript
// app/sobre/page.tsx
import { getPageBySlug } from '@/lib/strapi-client';
import { getStrapiMediaUrl } from '@/lib/strapi-utils';

export default async function AboutPage() {
  const result = await getPageBySlug('sobre');
  const page = result.data[0];

  return (
    <main>
      <h1>{page.attributes.title}</h1>
      {page.attributes.coverImage && (
        <img
          src={getStrapiMediaUrl(page.attributes.coverImage.data?.attributes.url)}
          alt={page.attributes.title}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: page.attributes.content }} />
    </main>
  );
}
```

### Fetch Raffle Details

```typescript
// app/rifas/[id]/page.tsx
import { getRaffleDetailData } from '@/lib/data-fetcher';

export default async function RaffleDetailPage({
  params
}: {
  params: { id: string }
}) {
  const data = await getRaffleDetailData(params.id);

  return (
    <main>
      <h1>{data.raffle.title}</h1>
      <p>{data.raffle.prize_description}</p>

      {/* Progress Bar */}
      <div>
        <p>Vendidos: {data.stats.tickets_sold} / {data.stats.total_tickets}</p>
        <div className="progress-bar">
          <div style={{ width: `${data.stats.percentage_sold}%` }} />
        </div>
      </div>

      {/* Blockchain Verification */}
      {data.blockchain?.is_verified && (
        <a href={data.blockchain.explorer_url} target="_blank">
          ✅ Verificado na Blockchain
        </a>
      )}

      {/* Winner (if completed) */}
      {data.winner && (
        <div>
          <h3>Ganhador: Ticket #{data.winner.winner_ticket_number}</h3>
        </div>
      )}
    </main>
  );
}
```

## Common Patterns

### Pattern 1: Static Page with ISR

```typescript
// app/blog/page.tsx
import { getBlogPosts } from '@/lib/strapi-client';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPage() {
  const posts = await getBlogPosts({ featured: true }, 'pt-BR', 1, 10);

  return (
    <div>
      {posts.data.map(post => (
        <article key={post.id}>
          <h2>{post.attributes.title}</h2>
          <p>{post.attributes.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Pattern 2: Dynamic Data with Frequent Updates

```typescript
// app/rifas/ativas/page.tsx
import { getActiveRaffles } from '@/lib/medusa-enhanced';

export const revalidate = 30; // Update every 30 seconds

export default async function ActiveRafflesPage() {
  const result = await getActiveRaffles(20, 30);

  return (
    <div>
      <h1>Rifas Ativas</h1>
      {result.raffles.map(raffle => (
        <div key={raffle.id}>
          <h3>{raffle.title}</h3>
          <span className="status">{raffle.status}</span>
        </div>
      ))}
    </div>
  );
}
```

### Pattern 3: Error Handling

```typescript
import { getRaffleById } from '@/lib/medusa-enhanced';
import { MedusaAPIError } from '@/lib/medusa-enhanced';

export default async function RafflePage({ params }: { params: { id: string } }) {
  try {
    const result = await getRaffleById(params.id);
    return <div>{result.raffle.title}</div>;
  } catch (error) {
    if (error instanceof MedusaAPIError) {
      if (error.status === 404) {
        return <div>Rifa não encontrada</div>;
      }
      return <div>Erro ao carregar rifa: {error.message}</div>;
    }
    return <div>Erro inesperado</div>;
  }
}
```

### Pattern 4: Parallel Data Fetching

```typescript
import { getRaffleById, getRaffleStats } from '@/lib/medusa-enhanced';
import { getBlogPosts } from '@/lib/strapi-client';

export default async function RafflePage({ params }: { params: { id: string } }) {
  // Fetch in parallel
  const [raffleRes, statsRes, relatedPosts] = await Promise.all([
    getRaffleById(params.id),
    getRaffleStats(params.id),
    getBlogPosts({ category: 'raffle', tags: [params.id] }),
  ]);

  return (
    <div>
      <h1>{raffleRes.raffle.title}</h1>
      <p>Tickets sold: {statsRes.stats.tickets_sold}</p>
      {/* Related blog posts */}
    </div>
  );
}
```

## Utility Functions Cheat Sheet

### Image URLs

```typescript
import { getStrapiMediaUrl, getStrapiMediaObjectUrl } from '@/lib/strapi-utils';

// From relative path
const url = getStrapiMediaUrl('/uploads/image.jpg');
// => 'http://localhost:1337/uploads/image.jpg'

// From media object with format
const thumbnail = getStrapiMediaObjectUrl(banner.image, 'thumbnail');
```

### Date Formatting

```typescript
import { formatStrapiDate, formatStrapiDateTime, formatStrapiRelativeTime } from '@/lib/strapi-utils';

formatStrapiDate('2024-01-15T10:30:00Z');
// => '15/01/2024'

formatStrapiDateTime('2024-01-15T10:30:00Z');
// => '15/01/2024 10:30'

formatStrapiRelativeTime('2024-01-15T10:30:00Z');
// => '2 dias atrás'
```

### Text Processing

```typescript
import { getStrapiExcerpt } from '@/lib/strapi-utils';

const excerpt = getStrapiExcerpt(post.content, 160);
// Removes markdown, truncates to 160 chars
```

### Blockchain URLs

```typescript
import { getBlockchainExplorerUrl } from '@/lib/medusa-enhanced';

const url = getBlockchainExplorerUrl('0x123...', 'polygon');
// => 'https://polygonscan.com/tx/0x123...'
```

## Testing Your Setup

### Run Tests

```bash
cd storefront
npm run test
```

Expected output:
```
✓ __tests__/api-clients.test.ts (20 tests)
Test Files  1 passed (1)
     Tests  20 passed (20)
```

### Test in Browser

1. Start Strapi: `cd strapi && npm run develop`
2. Start Medusa: `cd .. && npm run dev` (from project root)
3. Start Next.js: `cd storefront && npm run dev`
4. Visit: http://localhost:3000

## Client Imports Reference

### Strapi Client

```typescript
import {
  getHeroSection,
  getBanners,
  getPages,
  getPageBySlug,
  getNerdPremiado,
  getFeaturedProducts,
  getSiteSettings,
  getBlogPosts,
  getBlogPostBySlug,
} from '@/lib/strapi-client';
```

### Medusa Enhanced Client

```typescript
import {
  getRaffles,
  getActiveRaffles,
  getCompletedRaffles,
  getRaffleById,
  getRaffleStats,
  getTicketsByRaffle,
  getTicketsByCustomer,
  purchaseRaffleTickets,
  getRaffleWinners,
  getRaffleWinner,
  verifyRaffleOnBlockchain,
  getBlockchainExplorerUrl,
} from '@/lib/medusa-enhanced';
```

### Data Fetchers (Recommended)

```typescript
import {
  getHomepageData,
  getFeaturedProducts,
  getNerdPremiadoPageData,
  getRaffleDetailData,
} from '@/lib/data-fetcher';
```

### Utilities

```typescript
import {
  getStrapiMediaUrl,
  getStrapiMediaObjectUrl,
  getStrapiMediaAlt,
  formatStrapiDate,
  formatStrapiDateTime,
  formatStrapiRelativeTime,
  getStrapiExcerpt,
  isBannerActive,
} from '@/lib/strapi-utils';
```

## TypeScript Types

All types are exported from:

```typescript
import type {
  HeroSection,
  Banner,
  Page,
  NerdPremiado,
  FeaturedProduct,
  SiteSettings,
  BlogPost,
} from '@/lib/types/strapi';

import type {
  Raffle,
  RaffleTicket,
  RaffleDraw,
  RaffleStats,
  WinnerInfo,
  RaffleStatus,
  TicketStatus,
  ProductType,
} from '@/lib/types/medusa';
```

## Troubleshooting

### Issue: "fetch is not defined"

**Solution**: Upgrade to Node.js 18+

```bash
node --version  # Should be >= 18.0.0
```

### Issue: "CORS error from Strapi"

**Solution**: Add Next.js URL to Strapi CORS config

```typescript
// strapi/config/middleware.ts
export default {
  settings: {
    cors: {
      origin: ['http://localhost:3000'],
    },
  },
};
```

### Issue: "Medusa publishable key error"

**Solution**: Generate a publishable key in Medusa admin

1. Go to: http://localhost:9000/app
2. Settings → Publishable API Keys
3. Create new key
4. Copy to `.env.local`

### Issue: "Cannot find module '@/lib/...'

**Solution**: Ensure `tsconfig.json` has path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Next Steps

1. ✅ Read full documentation: `API_CLIENT_LIBRARIES_DOCUMENTATION.md`
2. ✅ Review implementation report: `API_CLIENT_IMPLEMENTATION_REPORT.md`
3. ✅ Explore type definitions: `storefront/lib/types/`
4. ✅ Run tests: `npm run test`
5. ✅ Build your first page using data fetchers

## Examples Repository

Check these example pages in the codebase:

- Homepage: Use `getHomepageData()`
- Raffle detail: Use `getRaffleDetailData()`
- Static pages: Use `getPageBySlug()`
- Blog: Use `getBlogPosts()`

## Support

Questions? Check:
- Full documentation: `API_CLIENT_LIBRARIES_DOCUMENTATION.md`
- Tests: `storefront/__tests__/api-clients.test.ts`
- Type definitions: `storefront/lib/types/`

---

**Happy coding!** 🚀
