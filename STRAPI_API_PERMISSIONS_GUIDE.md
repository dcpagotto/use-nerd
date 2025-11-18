# Strapi API Permissions Configuration Guide

**Quick reference for enabling public API access to populated content**

---

## Why This is Needed

The content has been successfully created in the PostgreSQL database, but Strapi's API endpoints return `403 Forbidden` because public access permissions haven't been configured yet.

**Current Status**:
```bash
curl http://localhost:1337/api/banners
# Returns: {"error": {"status": 403, "name": "ForbiddenError"}}
```

**After Configuration**:
```bash
curl http://localhost:1337/api/banners
# Returns: {"data": [{"id": 1, "attributes": {"title": "Black Friday Nerd", ...}}]}
```

---

## Step-by-Step Configuration

### 1. Access Strapi Admin Panel

Open your browser and go to:
```
http://localhost:1337/admin
```

**Login Credentials**:
- Email: `admin@example.com`
- Password: `[YOUR_SECURE_PASSWORD]`

---

### 2. Navigate to Permissions Settings

1. Click on **Settings** (⚙️ icon in the left sidebar)
2. Under "USERS & PERMISSIONS PLUGIN" section, click **Roles**
3. Click on **Public** role

---

### 3. Enable Permissions for Each Content Type

For each content type below, enable the `find` and `findOne` permissions:

#### A. Banners
- Scroll to: **Banner**
- Check: ✅ `find` (allows GET /api/banners)
- Check: ✅ `findOne` (allows GET /api/banners/:id)

#### B. Pages
- Scroll to: **Page**
- Check: ✅ `find` (allows GET /api/pages)
- Check: ✅ `findOne` (allows GET /api/pages/:id)

#### C. Hero Sections
- Scroll to: **Hero-section**
- Check: ✅ `find` (allows GET /api/hero-sections)
- Check: ✅ `findOne` (allows GET /api/hero-sections/:id)

#### D. Site Settings
- Scroll to: **Site-setting**
- Check: ✅ `find` (allows GET /api/site-settings)
- Check: ✅ `findOne` (allows GET /api/site-settings/:id)

#### E. Nerd Premiados (Winners)
- Scroll to: **Nerd-premiado**
- Check: ✅ `find` (allows GET /api/nerd-premiados)
- Check: ✅ `findOne` (allows GET /api/nerd-premiados/:id)

---

### 4. Save Configuration

Click the **Save** button at the top-right of the page.

---

## Visual Guide

```
┌─────────────────────────────────────────────────────────────┐
│ Settings > Users & Permissions Plugin > Roles > Public     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ PERMISSIONS                                                 │
│                                                             │
│ ▼ Banner                                                    │
│   ☑ find        ☐ findOne    ☐ create    ☐ update          │
│                                                             │
│ ▼ Page                                                      │
│   ☑ find        ☑ findOne    ☐ create    ☐ update          │
│                                                             │
│ ... (repeat for all content types)                         │
│                                                             │
│                                        [Save] button →      │
└─────────────────────────────────────────────────────────────┘
```

---

## Testing After Configuration

### Test All Endpoints

```bash
# Test Banners
curl http://localhost:1337/api/banners?populate=*

# Test Pages
curl http://localhost:1337/api/pages

# Test specific page by slug
curl "http://localhost:1337/api/pages?filters[slug][\$eq]=sobre"

# Test Hero Sections
curl http://localhost:1337/api/hero-sections

# Test Site Settings
curl http://localhost:1337/api/site-settings

# Test Winners (Nerd Premiados)
curl http://localhost:1337/api/nerd-premiados
```

### Expected Response Format

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Black Friday Nerd",
        "description": "Descontos de até 50% em produtos selecionados!...",
        "link": "/promocoes/black-friday",
        "active": true,
        "position": 1,
        "createdAt": "2025-11-17T17:52:08.000Z",
        "updatedAt": "2025-11-17T17:52:08.000Z",
        "publishedAt": "2025-11-17T17:52:08.000Z"
      }
    },
    ...
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

## Advanced: Populate Relations

If your content types have media or relations, use the `populate` parameter:

```bash
# Populate all relations
curl http://localhost:1337/api/banners?populate=*

# Populate specific fields
curl http://localhost:1337/api/pages?populate[0]=seo&populate[1]=components
```

---

## Filtering and Sorting Examples

### Filter Pages by Slug
```bash
curl "http://localhost:1337/api/pages?filters[slug][\$eq]=sobre"
```

### Get Only Published Content
```bash
curl "http://localhost:1337/api/banners?filters[active][\$eq]=true"
```

### Sort Banners by Position
```bash
curl "http://localhost:1337/api/banners?sort=position:asc"
```

### Get Featured Winners
```bash
curl "http://localhost:1337/api/nerd-premiados?filters[featured][\$eq]=true"
```

### Pagination
```bash
curl "http://localhost:1337/api/pages?pagination[page]=1&pagination[pageSize]=10"
```

---

## Frontend Integration Examples

### Next.js Data Fetching

```typescript
// lib/strapi-api.ts
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getBanners() {
  const res = await fetch(`${STRAPI_URL}/api/banners?sort=position:asc&filters[active][$eq]=true`);
  const data = await res.json();
  return data.data;
}

export async function getPageBySlug(slug: string) {
  const res = await fetch(`${STRAPI_URL}/api/pages?filters[slug][$eq]=${slug}`);
  const data = await res.json();
  return data.data[0];
}

export async function getHeroSection() {
  const res = await fetch(`${STRAPI_URL}/api/hero-sections?populate=*`);
  const data = await res.json();
  return data.data[0];
}

export async function getFeaturedWinners() {
  const res = await fetch(`${STRAPI_URL}/api/nerd-premiados?filters[featured][$eq]=true&sort=draw_date:desc`);
  const data = await res.json();
  return data.data;
}
```

### React Component Example

```tsx
// components/HeroSection.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    fetch('http://localhost:1337/api/hero-sections')
      .then(res => res.json())
      .then(data => setHero(data.data[0]));
  }, []);

  if (!hero) return <div>Loading...</div>;

  const { title, subtitle, cta_text, cta_link } = hero.attributes;

  return (
    <section className="hero bg-gradient-to-r from-purple-900 to-pink-900 py-20">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold text-white mb-4">{title}</h1>
        <p className="text-xl text-gray-200 mb-8">{subtitle}</p>
        <Link href={cta_link} className="btn btn-primary">
          {cta_text}
        </Link>
      </div>
    </section>
  );
}
```

---

## Troubleshooting

### Issue: Still Getting 403 After Configuration

**Solution**:
1. Make sure you clicked **Save** after enabling permissions
2. Try clearing browser cache and logging out/in to Strapi admin
3. Restart Strapi container: `docker-compose restart strapi-cms`

### Issue: Empty Data Array

**Possible Causes**:
- Content is not published (check `published_at` field)
- Wrong API endpoint name (use plural: `/api/banners`, not `/api/banner`)
- Filtering is too restrictive

**Verify in Database**:
```sql
SELECT id, title, published_at FROM strapi.banners;
```

### Issue: 404 Not Found

**Possible Causes**:
- Content type doesn't exist or has different name
- API is not enabled for that content type

**Check Content Types**:
Go to: Strapi Admin > Content-Type Builder

---

## Security Note

These permissions make content **publicly readable**. This is appropriate for:
- Banners (promotional content)
- Pages (public information)
- Hero sections (homepage content)
- Winners gallery (public testimonials)
- Site settings (public configuration)

Do NOT enable these permissions for:
- User data
- Orders
- Payment information
- Admin data
- Any sensitive content

---

## Quick Checklist

Before testing the frontend:

- [ ] Logged into Strapi admin (http://localhost:1337/admin)
- [ ] Navigated to Settings > Roles > Public
- [ ] Enabled `find` for all 5 content types
- [ ] Enabled `findOne` for all 5 content types
- [ ] Clicked Save
- [ ] Tested at least one endpoint with curl
- [ ] Verified JSON response contains data
- [ ] Ready to integrate with frontend!

---

## Next Steps After Configuration

1. **Upload Media**: Add actual images for banners, winners, hero section
2. **Test Frontend**: Integrate APIs with Next.js storefront
3. **Configure CORS**: If frontend is on different domain
4. **Setup CDN**: For media delivery
5. **Monitor Performance**: Use Strapi's analytics

---

**Need Help?**

- Strapi Documentation: https://docs.strapi.io/
- USE Nerd Project Docs: See `STRAPI_CONTENT_POPULATION_REPORT.md`
- Contact: admin@example.com

---

**Last Updated**: 2025-11-17
