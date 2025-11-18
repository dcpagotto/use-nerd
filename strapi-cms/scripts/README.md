# Strapi Content Types & Components Setup Script

## Overview

This directory contains automated setup scripts for USE Nerd's Strapi CMS. The main script generates all required Content Types and Components using Strapi's file-based schema method.

## What This Script Creates

### Content Types (7 Total)

1. **Hero Section** (Single Type)
   - Homepage hero banner configuration
   - Localized content support
   - Background image management
   - CTA button configuration

2. **Banners** (Collection Type)
   - Promotional banners for different placements
   - Campaign scheduling with start/end dates
   - Priority-based ordering
   - Draft/Publish workflow

3. **Pages** (Collection Type)
   - Static pages (About, Terms, Privacy, etc.)
   - Rich text content editor
   - SEO component integration
   - Slug-based routing

4. **Nerd Premiado** (Single Type)
   - Special raffle campaign page
   - Prize configuration
   - Winner announcement component
   - Blockchain transaction hash tracking

5. **Featured Products** (Collection Type)
   - Curated product highlights
   - Multiple placement options
   - Badge system (new, hot, sale, limited, exclusive)
   - Time-based scheduling

6. **Site Settings** (Single Type)
   - Global site configuration
   - Logo and branding assets
   - Social media links
   - Maintenance mode toggle
   - Default SEO settings

7. **Blog Posts** (Collection Type)
   - Blog articles and news
   - Category system
   - Featured posts
   - View count tracking
   - SEO optimization

### Components (3 Total)

1. **shared.seo**
   - Meta title and description
   - Keywords
   - Open Graph image
   - Canonical URL
   - Structured data (JSON-LD)

2. **shared.social-link**
   - Platform selection (Facebook, Instagram, Twitter, etc.)
   - URL configuration
   - Active/inactive toggle

3. **raffle.winner-announcement**
   - Winner information
   - Announcement date
   - Blockchain verification
   - Winner photo upload

## Prerequisites

- Node.js >= 18.0.0
- Strapi 4.26.0 installed
- Strapi server **not running** during script execution

## Installation

The script is already included in the `strapi-cms/scripts/` directory. No additional installation required.

## Usage

### Basic Execution

Navigate to the Strapi CMS directory and run:

```bash
cd strapi-cms
node scripts/setup-content-types.js
```

### Alternative: Run from scripts directory

```bash
cd strapi-cms/scripts
node setup-content-types.js
```

## Expected Output

The script will display colorful console output showing:

1. **Initialization**
   - Directory paths
   - Base directory creation

2. **Content Type Generation**
   - Each content type created or skipped
   - Success/error status

3. **Component Generation**
   - Each component created or skipped
   - Success/error status

4. **Summary Report**
   - Total created, skipped, and errors
   - List of all created items
   - Any error details

5. **Next Steps**
   - Instructions for restarting Strapi
   - Verification steps
   - Testing commands

### Sample Output

```
╔═══════════════════════════════════════════════════════════════╗
║   STRAPI CONTENT TYPES & COMPONENTS AUTOMATED SETUP           ║
║   USE Nerd E-commerce Platform                                ║
╚═══════════════════════════════════════════════════════════════╝

Strapi Root: C:\Users\...\strapi-cms
Source Directory: C:\Users\...\strapi-cms\src

Ensuring base directories exist...
✓ Base directories ready

=== Generating Content Types ===

  ✓ Created content type: hero-section
  ✓ Created content type: banner
  ✓ Created content type: page
  ✓ Created content type: nerd-premiado
  ✓ Created content type: featured-product
  ✓ Created content type: site-setting
  ✓ Created content type: blog-post

=== Generating Components ===

  ✓ Created component: shared.seo
  ✓ Created component: shared.social-link
  ✓ Created component: raffle.winner-announcement

╔═══════════════════════════════════════════════════════════════╗
║              STRAPI SETUP COMPLETION REPORT                   ║
╚═══════════════════════════════════════════════════════════════╝

Content Types:
  ✓ Created: 7
  ⊘ Skipped: 0
  ✗ Errors:  0

Components:
  ✓ Created: 3
  ⊘ Skipped: 0
  ✗ Errors:  0
```

## Post-Installation Steps

### 1. Restart Strapi Server

#### Using Docker:
```bash
docker restart use-nerd-strapi
```

#### Local Development:
```bash
# Stop current server (Ctrl+C if running)
npm run develop
```

### 2. Verify in Strapi Admin

1. Open your browser to: `http://localhost:1337/admin`
2. Log in with your admin credentials
3. Navigate to **Content-Type Builder** in the left sidebar
4. Verify you see:
   - **Collection Types**: Banners, Pages, Featured Products, Blog Posts
   - **Single Types**: Hero Section, Nerd Premiado, Site Settings
5. Click on any content type to inspect the fields
6. Navigate to **Components** section
7. Verify you see:
   - **shared**: SEO, Social Link
   - **raffle**: Winner Announcement

### 3. Configure API Permissions

1. Go to **Settings** → **Users & Permissions plugin** → **Roles**
2. Click on **Public** role
3. Expand each content type and check appropriate permissions:
   - **Read-only endpoints**: `find`, `findOne`
   - **For public content**: Hero Section, Banners, Pages, Site Settings, Blog Posts
4. Click **Save**
5. Repeat for **Authenticated** role with additional permissions as needed

### 4. Test API Endpoints

```bash
# Single Types
curl http://localhost:1337/api/hero-section
curl http://localhost:1337/api/nerd-premiado
curl http://localhost:1337/api/site-setting

# Collection Types
curl http://localhost:1337/api/banners
curl http://localhost:1337/api/pages
curl http://localhost:1337/api/featured-products
curl http://localhost:1337/api/blog-posts
```

Expected response format:
```json
{
  "data": {
    "id": 1,
    "attributes": {
      // Your content fields
    }
  },
  "meta": {}
}
```

### 5. Populate Initial Content

1. Navigate to **Content Manager** in the admin panel
2. Start adding content to each content type:
   - **Hero Section**: Configure homepage hero banner
   - **Site Settings**: Set up logo, contact info, social links
   - **Pages**: Create About, Terms, Privacy pages
   - **Banners**: Add promotional banners
   - **Featured Products**: Highlight key products

## Directory Structure

After running the script, your `src/` directory will look like:

```
strapi-cms/src/
├── api/
│   ├── hero-section/
│   │   └── content-types/
│   │       └── hero-section/
│   │           └── schema.json
│   ├── banner/
│   │   └── content-types/
│   │       └── banner/
│   │           └── schema.json
│   ├── page/
│   │   └── content-types/
│   │       └── page/
│   │           └── schema.json
│   ├── nerd-premiado/
│   │   └── content-types/
│   │       └── nerd-premiado/
│   │           └── schema.json
│   ├── featured-product/
│   │   └── content-types/
│   │       └── featured-product/
│   │           └── schema.json
│   ├── site-setting/
│   │   └── content-types/
│   │       └── site-setting/
│   │           └── schema.json
│   └── blog-post/
│       └── content-types/
│           └── blog-post/
│               └── schema.json
└── components/
    ├── shared/
    │   ├── seo.json
    │   └── social-link.json
    └── raffle/
        └── winner-announcement.json
```

## Troubleshooting

### Issue: Script reports "already exists" for all items

**Solution**: The content types have already been created. To recreate them:
1. Delete the existing schema files
2. Run the script again
3. Restart Strapi

### Issue: Permission denied errors

**Solution**:
- Ensure you have write permissions to the `strapi-cms/src/` directory
- On Windows, try running terminal as Administrator
- On Linux/Mac, check file ownership: `ls -la src/`

### Issue: Strapi doesn't recognize new content types after restart

**Solution**:
1. Clear Strapi cache: `rm -rf .cache build`
2. Rebuild Strapi: `npm run build`
3. Restart: `npm run develop`

### Issue: API endpoints return 403 Forbidden

**Solution**: You haven't configured permissions yet. See "Configure API Permissions" section above.

### Issue: Components not showing up

**Solution**:
1. Verify component files exist in `src/components/`
2. Check JSON syntax is valid
3. Ensure components are referenced in content type schemas
4. Clear cache and rebuild

### Issue: i18n plugin errors

**Solution**:
- Ensure `@strapi/plugin-i18n` is installed
- Check `config/plugins.js` or `config/plugins.ts` has i18n enabled
- Verify default locale is configured

## Script Features

### Intelligent Skip Logic
- Detects existing content types and components
- Skips creation if already exists
- Reports skipped items separately from errors

### Error Handling
- Validates directory structure
- Catches and reports individual errors
- Continues execution even if some items fail
- Provides detailed error messages

### Colorful Output
- Green: Success messages
- Yellow: Warnings and skip messages
- Red: Errors
- Cyan: Section headers
- Blue: Important information

### Detailed Reporting
- Summary counts for created/skipped/errors
- Lists all created items
- Identifies specific errors
- Provides actionable next steps

## Integration with Next.js Frontend

Once content types are created and populated, you can fetch them from your Next.js frontend:

```typescript
// storefront/lib/strapi.ts
import qs from 'qs';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function getHeroSection() {
  const query = qs.stringify({
    populate: ['backgroundImage'],
    locale: 'pt-BR'
  });

  const res = await fetch(`${STRAPI_URL}/api/hero-section?${query}`);
  return res.json();
}

export async function getBanners(placement: string) {
  const query = qs.stringify({
    filters: {
      placement: { $eq: placement },
      isActive: { $eq: true }
    },
    populate: ['image'],
    sort: ['priority:desc']
  });

  const res = await fetch(`${STRAPI_URL}/api/banners?${query}`);
  return res.json();
}
```

## Maintenance

### Adding New Content Types

To add new content types in the future:

1. Add schema definition to `contentTypeSchemas` object in the script
2. Run the script again
3. Restart Strapi

### Modifying Existing Content Types

**Warning**: Modifying schemas via script may cause data loss.

Recommended approach:
1. Use Strapi Admin UI for schema changes
2. Export updated schema from `src/api/*/schema.json`
3. Update script with new schema for future deployments

### Version Control

Commit the generated files to version control:

```bash
git add src/api/ src/components/
git commit -m "feat: add CMS content types and components"
```

## Support

For issues or questions:
- Check Strapi documentation: https://docs.strapi.io/
- Review project README: `../README.md`
- Contact USE Nerd development team

## License

MIT License - USE Nerd E-commerce Platform

---

**Last Updated**: 2025-11-12
**Script Version**: 1.0.0
**Strapi Version**: 4.26.0
