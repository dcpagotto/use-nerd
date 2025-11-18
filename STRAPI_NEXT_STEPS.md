# Strapi CMS - Next Steps Action Plan

**Current Status**: Content populated, API permissions pending

---

## Immediate Actions (Do First)

### 1. Configure API Permissions (5 minutes)

**Priority**: 🔴 CRITICAL

**Steps**:
1. Open http://localhost:1337/admin
2. Login: `dhiego@pagotto.eu` / `##Dcp1501`
3. Go to: Settings > Roles > Public
4. Enable permissions:
   ```
   ✓ Banner.find + Banner.findOne
   ✓ Page.find + Page.findOne
   ✓ Hero-section.find + Hero-section.findOne
   ✓ Site-setting.find + Site-setting.findOne
   ✓ Nerd-premiado.find + Nerd-premiado.findOne
   ```
5. Click **Save**

**Verify**:
```bash
curl http://localhost:1337/api/banners
# Should return JSON with banner data, not 403 error
```

**Details**: See `STRAPI_API_PERMISSIONS_GUIDE.md`

---

### 2. Test All API Endpoints (2 minutes)

**Priority**: 🟡 HIGH

**Commands**:
```bash
# Test each endpoint
curl http://localhost:1337/api/banners
curl http://localhost:1337/api/pages
curl http://localhost:1337/api/hero-sections
curl http://localhost:1337/api/site-settings
curl http://localhost:1337/api/nerd-premiados

# Test with filters
curl "http://localhost:1337/api/pages?filters[slug][\$eq]=sobre"
curl "http://localhost:1337/api/banners?filters[active][\$eq]=true&sort=position:asc"
curl "http://localhost:1337/api/nerd-premiados?filters[featured][\$eq]=true"
```

**Success Criteria**: All endpoints return HTTP 200 with JSON data

---

## Short-Term Actions (Next 1-2 Days)

### 3. Upload Media Files

**Priority**: 🟢 MEDIUM

**What to Upload**:
- Hero section background image
- Banner images (5 banners)
- Winner photos (5 winners)
- Blog post images (Cyberpunk collection)

**How**:
1. In Strapi admin, go to Media Library
2. Upload images
3. Edit each content entry to attach images
4. Regenerate API responses with `?populate=*`

**Recommended Sizes**:
```
Hero background:  1920x1080px
Banners:          1200x400px
Winner photos:    400x400px
Blog images:      800x600px
```

---

### 4. Integrate with Next.js Frontend

**Priority**: 🟡 HIGH

**Create API Client**:

```typescript
// storefront/lib/strapi-client.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function fetchFromStrapi(endpoint: string, options = {}) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    ...options,
    next: { revalidate: 60 } // Cache for 60 seconds
  });

  if (!res.ok) throw new Error(`Strapi error: ${res.status}`);

  const data = await res.json();
  return data.data;
}

export const strapiClient = {
  getBanners: () => fetchFromStrapi('banners?filters[active][$eq]=true&sort=position:asc&populate=*'),
  getPages: () => fetchFromStrapi('pages?filters[published][$eq]=true'),
  getPageBySlug: (slug: string) => fetchFromStrapi(`pages?filters[slug][$eq]=${slug}&populate=*`),
  getHeroSection: () => fetchFromStrapi('hero-sections?populate=*'),
  getSiteSettings: () => fetchFromStrapi('site-settings'),
  getFeaturedWinners: () => fetchFromStrapi('nerd-premiados?filters[featured][$eq]=true&sort=draw_date:desc&populate=*'),
};
```

**Update Components**:
```typescript
// storefront/components/Hero.tsx
import { strapiClient } from '@/lib/strapi-client';

export default async function Hero() {
  const heroes = await strapiClient.getHeroSection();
  const hero = heroes[0];

  return (
    <section className="hero">
      <h1>{hero.attributes.title}</h1>
      <p>{hero.attributes.subtitle}</p>
      <a href={hero.attributes.cta_link}>{hero.attributes.cta_text}</a>
    </section>
  );
}
```

---

### 5. Create Dynamic Routes

**Priority**: 🟡 HIGH

**Create Dynamic Page Route**:

```typescript
// storefront/app/[slug]/page.tsx
import { strapiClient } from '@/lib/strapi-client';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const pages = await strapiClient.getPages();
  return pages.map((page: any) => ({
    slug: page.attributes.slug,
  }));
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const pages = await strapiClient.getPageBySlug(params.slug);

  if (!pages.length) notFound();

  const page = pages[0];
  const { title, content } = page.attributes;

  return (
    <article className="prose lg:prose-xl">
      <h1>{title}</h1>
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
```

**Install Dependencies**:
```bash
cd storefront
npm install react-markdown
```

---

## Medium-Term Actions (Next Week)

### 6. Enhance Content Types

**Add Media Relations**:
- Hero section: background_image
- Banners: image
- Winners: photo

**Add SEO Component**:
- Meta title
- Meta description
- Open Graph tags

**Steps**:
1. Go to Content-Type Builder
2. Add relation fields for media
3. Add SEO component (if not exists)
4. Republish API

---

### 7. Configure CORS (If Needed)

**If frontend is on different domain**:

Edit `strapi-cms/config/middlewares.ts`:
```typescript
export default [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        directives: {
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io'],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000', 'https://usenerd.com.br'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  },
  // ... other middlewares
];
```

---

### 8. Setup Environment Variables

**Frontend .env**:
```bash
# storefront/.env.local
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

**Production .env**:
```bash
# storefront/.env.production
NEXT_PUBLIC_STRAPI_URL=https://cms.usenerd.com.br
```

---

### 9. Implement Caching Strategy

**Options**:

1. **Next.js ISR (Incremental Static Regeneration)**:
   ```typescript
   fetch(url, { next: { revalidate: 60 } })
   ```

2. **React Query**:
   ```typescript
   const { data } = useQuery(['banners'], () => strapiClient.getBanners(), {
     staleTime: 5 * 60 * 1000, // 5 minutes
   });
   ```

3. **Redis Caching** (Advanced):
   - Cache API responses in Redis
   - Invalidate on Strapi webhooks

---

### 10. Setup Webhooks (Optional)

**Purpose**: Trigger frontend rebuild on content changes

**Steps**:
1. In Strapi: Settings > Webhooks
2. Add webhook URL: `https://vercel.com/api/revalidate?token=...`
3. Select events: Entry create, update, delete
4. Test webhook

---

## Long-Term Actions (Next 2-4 Weeks)

### 11. Add More Content

**Expand Existing**:
- Create 10+ blog posts
- Add 20+ promotional banners (seasonal)
- Add more winner testimonials

**New Content Types**:
- FAQ
- Team members
- Partners/Sponsors
- Testimonials (separate from winners)

---

### 12. Localization (i18n)

**If targeting multiple languages**:
1. Enable i18n plugin
2. Add English translations
3. Update frontend to support locale switching

---

### 13. Performance Optimization

**Strapi**:
- Enable database query optimization
- Setup CDN for media (Cloudflare, Cloudinary)
- Implement Redis cache

**Frontend**:
- Image optimization (Next.js Image)
- Bundle analysis
- Lazy loading

---

### 14. Monitoring & Analytics

**Setup**:
- Strapi admin activity logs
- API usage monitoring
- Error tracking (Sentry)
- Performance monitoring (New Relic, Datadog)

---

## Testing Checklist

### Content Tests
- [ ] All banners display correctly
- [ ] All pages render markdown properly
- [ ] Hero section shows on homepage
- [ ] Winners gallery displays featured winners
- [ ] Site settings populate footer/header

### API Tests
- [ ] All endpoints return 200 OK
- [ ] Filtering works correctly
- [ ] Sorting works as expected
- [ ] Pagination works (if implemented)
- [ ] Population includes relations

### Frontend Tests
- [ ] Hero section displays
- [ ] Banners carousel works
- [ ] Dynamic pages load by slug
- [ ] Winners gallery renders
- [ ] Navigation links work

---

## Troubleshooting

### API Returns Empty Array
**Check**:
- Content is published (`published_at` is not null)
- Filters are correct
- Permissions are enabled

### 403 Forbidden
**Check**:
- Public role has `find` and `findOne` permissions
- Clicked Save after enabling permissions
- Tried restarting Strapi

### Markdown Not Rendering
**Check**:
- Installed `react-markdown`
- Content field has markdown
- Component properly renders markdown

---

## Success Metrics

### Content Quality
- [ ] All text is in Portuguese
- [ ] No spelling/grammar errors
- [ ] Tone matches brand voice
- [ ] SEO keywords included

### Technical
- [ ] API response time < 200ms
- [ ] Frontend loads in < 3s
- [ ] Images optimized < 200KB
- [ ] 100% uptime

### Business
- [ ] Content drives engagement
- [ ] Clear calls-to-action
- [ ] Conversion paths defined

---

## Resources

**Documentation Created**:
1. `STRAPI_CONTENT_POPULATION_REPORT.md` - Full detailed report
2. `STRAPI_API_PERMISSIONS_GUIDE.md` - Permission configuration
3. `STRAPI_CONTENT_SUMMARY.md` - Quick reference
4. `STRAPI_CONTENT_STRUCTURE.md` - Visual overview
5. `CHANGELOG_STRAPI_CONTENT.md` - Change log
6. `STRAPI_NEXT_STEPS.md` - This action plan

**External Resources**:
- Strapi Docs: https://docs.strapi.io/
- Next.js Docs: https://nextjs.org/docs
- React Markdown: https://github.com/remarkjs/react-markdown

---

## Timeline Overview

```
Week 1 (Current)
├── Day 1: ✅ Content populated
├── Day 2: 🔴 Configure permissions + Test API
└── Day 3: 🟡 Upload media + Frontend integration

Week 2
├── Enhance content types
├── Setup caching
└── Create all dynamic routes

Week 3
├── Add more content
├── Performance optimization
└── Testing

Week 4
├── Monitoring setup
├── Documentation review
└── Launch preparation
```

---

## Quick Command Reference

```bash
# Database check
docker-compose exec -T postgres psql -U postgres -d use-nerd -c "SELECT COUNT(*) FROM strapi.banners;"

# Restart Strapi
docker-compose restart strapi-cms

# View Strapi logs
docker-compose logs -f strapi-cms

# Access Strapi admin
http://localhost:1337/admin

# Test API
curl http://localhost:1337/api/banners
```

---

**Next Action**: Configure API permissions (see step 1 above)

**Questions?** Check documentation or contact dhiego@pagotto.eu

**Status**: 🟢 Ready to proceed
