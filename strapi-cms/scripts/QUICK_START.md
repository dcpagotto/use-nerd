# Strapi CMS - Quick Start Guide

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Daily Development](#daily-development)
3. [Common Tasks](#common-tasks)
4. [Troubleshooting](#troubleshooting)
5. [API Examples](#api-examples)

---

## Initial Setup

### Step 1: Run Setup Script

```bash
cd strapi-cms
node scripts/setup-content-types.js
```

**Expected output:**
```
✓ Created: 7 content types
✓ Created: 3 components
✓ Setup completed successfully!
```

### Step 2: Restart Strapi

```bash
# Using Docker
docker restart use-nerd-strapi

# OR using npm (if running locally)
npm run develop
```

### Step 3: Verify Setup

```bash
node scripts/verify-setup.js
```

**Expected output:**
```
✓ Valid: 7/7 content types
✓ Valid: 3/3 components
```

### Step 4: Configure Permissions

1. Open admin panel: **http://localhost:1337/admin**
2. Login with admin credentials
3. Navigate to: **Settings** → **Users & Permissions plugin** → **Roles** → **Public**
4. For each content type, enable:
   - ☑ `find` (list all)
   - ☑ `findOne` (get single)
5. Click **Save**

### Step 5: Test API

```bash
node scripts/verify-setup.js --test-api
```

**Expected output:**
```
✓ /api/hero-section (200)
✓ /api/banners (200)
✓ /api/pages (200)
...
```

---

## Daily Development

### Start Strapi (Development Mode)

```bash
# Using Docker
docker start use-nerd-strapi
docker logs -f use-nerd-strapi

# OR using npm
cd strapi-cms
npm run develop
```

Access admin panel: **http://localhost:1337/admin**

### Stop Strapi

```bash
# Using Docker
docker stop use-nerd-strapi

# OR npm (Ctrl+C in terminal)
```

### Rebuild After Changes

```bash
# Clear cache and rebuild
rm -rf .cache build
npm run build
npm run develop
```

---

## Common Tasks

### Add Content via Admin UI

1. **Hero Section** (Homepage Banner)
   - Content Manager → Hero Section → Edit
   - Upload background image
   - Set title/subtitle
   - Configure CTA button
   - Save

2. **Site Settings** (Global Config)
   - Content Manager → Site Settings → Edit
   - Upload logo and favicon
   - Set contact info
   - Add social media links
   - Configure default SEO
   - Save

3. **Create a Page**
   - Content Manager → Pages → Create new entry
   - Set title (slug auto-generates)
   - Write content using rich text editor
   - Add SEO metadata
   - Save as draft or Publish

4. **Create a Banner**
   - Content Manager → Banners → Create new entry
   - Upload banner image
   - Set title, description, link
   - Choose placement (homepage, category, etc.)
   - Set priority (higher = shown first)
   - Schedule with start/end dates (optional)
   - Publish

5. **Feature a Product**
   - Get product ID from Medusa (e.g., "prod_01HXXX...")
   - Content Manager → Featured Products → Create new entry
   - Paste product ID
   - Set placement and priority
   - Add custom title/description (optional)
   - Choose badge (new, hot, sale, etc.)
   - Publish

6. **Write a Blog Post**
   - Content Manager → Blog Posts → Create new entry
   - Set title and slug
   - Write excerpt and full content
   - Upload cover image
   - Select category
   - Add SEO metadata
   - Publish

### Query API from Command Line

```bash
# Get hero section
curl http://localhost:1337/api/hero-section?populate=*

# Get all banners
curl http://localhost:1337/api/banners?populate=*

# Get homepage banners only
curl "http://localhost:1337/api/banners?filters[placement][\$eq]=homepage&populate=*"

# Get published pages
curl http://localhost:1337/api/pages?populate=*

# Get featured products for homepage
curl "http://localhost:1337/api/featured-products?filters[placement][\$eq]=homepage-grid&sort=priority:desc&populate=*"

# Get site settings
curl http://localhost:1337/api/site-setting?populate=deep

# Get published blog posts
curl "http://localhost:1337/api/blog-posts?filters[publishedAt][\$notNull]=true&sort=publishedDate:desc&populate=*"
```

### Backup Database

```bash
# PostgreSQL backup (Docker)
docker exec -t use-nerd-postgres pg_dump -U strapi strapi_cms > backup_$(date +%Y%m%d).sql

# Restore from backup
docker exec -i use-nerd-postgres psql -U strapi strapi_cms < backup_20251112.sql
```

### Export/Import Media

```bash
# Export uploads folder
tar -czf media_backup.tar.gz strapi-cms/public/uploads/

# Import uploads folder
tar -xzf media_backup.tar.gz -C strapi-cms/public/
```

---

## Troubleshooting

### Problem: Content types not showing in admin

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .cache build
npm run build
npm run develop
```

### Problem: API returns 403 Forbidden

**Solution:** Configure permissions
1. Admin → Settings → Users & Permissions → Roles → Public
2. Enable `find` and `findOne` for the content type
3. Save

### Problem: Schema changes not applied

**Solution:**
1. Stop Strapi
2. Delete `.cache` and `build` folders
3. Re-run setup script: `node scripts/setup-content-types.js`
4. Restart Strapi

### Problem: Image uploads failing

**Solution:** Check file permissions
```bash
# Ensure uploads directory is writable
chmod -R 755 strapi-cms/public/uploads
```

### Problem: Database connection error

**Solution:** Verify PostgreSQL is running
```bash
# Check PostgreSQL status
docker ps | grep postgres

# Check connection
docker exec use-nerd-postgres psql -U strapi -c "SELECT 1"
```

### Problem: Port 1337 already in use

**Solution:** Kill existing process
```bash
# Find process using port 1337
lsof -i :1337

# Kill process
kill -9 <PID>
```

---

## API Examples

### JavaScript/TypeScript (Node.js)

```javascript
// Fetch hero section
async function getHeroSection() {
  const response = await fetch('http://localhost:1337/api/hero-section?populate=*');
  const data = await response.json();
  return data.data;
}

// Fetch banners with filters
async function getHomepageBanners() {
  const qs = require('qs');
  const query = qs.stringify({
    filters: {
      placement: { $eq: 'homepage' },
      isActive: { $eq: true }
    },
    populate: ['image'],
    sort: ['priority:desc']
  });

  const response = await fetch(`http://localhost:1337/api/banners?${query}`);
  const data = await response.json();
  return data.data;
}

// Create a blog post (requires authentication)
async function createBlogPost(token, postData) {
  const response = await fetch('http://localhost:1337/api/blog-posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ data: postData })
  });

  const data = await response.json();
  return data.data;
}
```

### Next.js App Router (Server Component)

```typescript
// app/lib/strapi.ts
import qs from 'qs';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getHeroSection() {
  const query = qs.stringify({
    populate: ['backgroundImage'],
    locale: 'pt-BR'
  });

  const res = await fetch(`${STRAPI_URL}/api/hero-section?${query}`, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });

  if (!res.ok) throw new Error('Failed to fetch hero section');
  return res.json();
}

export async function getPages() {
  const query = qs.stringify({
    filters: {
      isPublic: { $eq: true }
    },
    populate: ['coverImage', 'seo'],
    locale: 'pt-BR'
  });

  const res = await fetch(`${STRAPI_URL}/api/pages?${query}`, {
    next: { revalidate: 300 } // Revalidate every 5 minutes
  });

  if (!res.ok) throw new Error('Failed to fetch pages');
  return res.json();
}

// app/page.tsx (Server Component)
export default async function HomePage() {
  const { data: heroData } = await getHeroSection();

  return (
    <div>
      <section
        style={{
          backgroundImage: `url(${heroData.attributes.backgroundImage.data.attributes.url})`
        }}
      >
        <h1>{heroData.attributes.title}</h1>
        <p>{heroData.attributes.subtitle}</p>
        <a href={heroData.attributes.ctaButtonLink}>
          {heroData.attributes.ctaButtonText}
        </a>
      </section>
    </div>
  );
}
```

### Python

```python
import requests

STRAPI_URL = "http://localhost:1337"

def get_hero_section():
    response = requests.get(f"{STRAPI_URL}/api/hero-section?populate=*")
    response.raise_for_status()
    return response.json()

def get_banners(placement="homepage"):
    params = {
        "filters[placement][$eq]": placement,
        "filters[isActive][$eq]": True,
        "populate": "*",
        "sort": "priority:desc"
    }
    response = requests.get(f"{STRAPI_URL}/api/banners", params=params)
    response.raise_for_status()
    return response.json()

# Usage
hero = get_hero_section()
print(hero['data']['attributes']['title'])

banners = get_banners()
for banner in banners['data']:
    print(banner['attributes']['title'])
```

### cURL Examples

```bash
# GET request with query parameters
curl -G "http://localhost:1337/api/banners" \
  --data-urlencode "filters[placement][\$eq]=homepage" \
  --data-urlencode "populate=*" \
  --data-urlencode "sort=priority:desc"

# POST request (create blog post) - requires auth token
curl -X POST "http://localhost:1337/api/blog-posts" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "data": {
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "excerpt": "This is a short description",
      "content": "Full content goes here...",
      "author": "John Doe",
      "category": "news",
      "featured": false
    }
  }'

# PUT request (update hero section)
curl -X PUT "http://localhost:1337/api/hero-section" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "data": {
      "title": "Updated Hero Title",
      "isActive": true
    }
  }'

# DELETE request (delete a page)
curl -X DELETE "http://localhost:1337/api/pages/1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Query Parameter Reference

### Populate (Include Relations)

```bash
# Populate all relations
?populate=*

# Populate specific fields
?populate[0]=coverImage&populate[1]=seo

# Deep populate
?populate=deep

# Populate nested component
?populate[seo][populate]=*
```

### Filters

```bash
# Exact match
?filters[title][$eq]=Hello

# Not equal
?filters[isActive][$ne]=false

# Contains (case-sensitive)
?filters[title][$contains]=Raffle

# Case-insensitive contains
?filters[title][$containsi]=raffle

# Greater than / Less than
?filters[priority][$gt]=5
?filters[priority][$lt]=10

# In array
?filters[category][$in][0]=news&filters[category][$in][1]=tutorial

# Null / Not null
?filters[endDate][$null]=true
?filters[publishedAt][$notNull]=true

# Date range
?filters[startDate][$gte]=2025-01-01
?filters[endDate][$lte]=2025-12-31

# AND conditions
?filters[$and][0][isActive][$eq]=true&filters[$and][1][placement][$eq]=homepage

# OR conditions
?filters[$or][0][category][$eq]=news&filters[$or][1][featured][$eq]=true
```

### Sorting

```bash
# Ascending
?sort=priority

# Descending
?sort=priority:desc

# Multiple fields
?sort[0]=priority:desc&sort[1]=createdAt:desc
```

### Pagination

```bash
# Limit
?pagination[limit]=10

# Offset
?pagination[start]=20

# Page-based
?pagination[page]=2&pagination[pageSize]=10
```

### Locale (i18n)

```bash
# Specific locale
?locale=pt-BR

# All locales
?locale=all
```

---

## Environment Variables

```bash
# .env file for Strapi
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_cms
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_password

HOST=0.0.0.0
PORT=1337

APP_KEYS=app-key-1,app-key-2,app-key-3,app-key-4
API_TOKEN_SALT=your-salt
ADMIN_JWT_SECRET=your-admin-secret
JWT_SECRET=your-jwt-secret

# Optional
NODE_ENV=development
STRAPI_ADMIN_URL=http://localhost:1337/admin
```

---

## Useful Commands

```bash
# Generate API token
npm run strapi admin:create-user

# Reset admin password
npm run strapi admin:reset-user-password

# Build for production
npm run build

# Start in production mode
NODE_ENV=production npm start

# Generate types (TypeScript)
npm run strapi ts:generate-types

# Clean cache
npm run strapi clear-cache

# View logs (Docker)
docker logs -f use-nerd-strapi

# Access container shell (Docker)
docker exec -it use-nerd-strapi sh
```

---

## Resources

- **Strapi Documentation**: https://docs.strapi.io/
- **REST API Docs**: https://docs.strapi.io/dev-docs/api/rest
- **Query Parameters**: https://docs.strapi.io/dev-docs/api/rest/parameters
- **Admin Panel**: http://localhost:1337/admin
- **API Root**: http://localhost:1337/api

---

**Last Updated**: 2025-11-12
**Strapi Version**: 4.26.0
**Project**: USE Nerd E-commerce Platform
