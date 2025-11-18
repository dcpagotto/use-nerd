# API Testing Commands - Quick Reference

This document provides quick command references for testing the Strapi and Medusa APIs after token configuration.

---

## Strapi CMS API Tests

### 1. Test Strapi Connection (No Auth - Should Fail)
```bash
curl http://localhost:1337/api/banners
```
**Expected**: `{"data":null,"error":{"status":403,"name":"ForbiddenError",...}}`

### 2. Test Strapi with API Token
After creating the token in Strapi admin, replace `YOUR_TOKEN_HERE`:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:1337/api/banners
```
**Expected**: `{"data":[],"meta":{...}}` (empty array if no banners exist yet)

### 3. Test Strapi - Get Winners
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:1337/api/winners?populate=*
```

### 4. Test Strapi - Get Blog Posts
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:1337/api/blog-posts?populate=*
```

### 5. Test Strapi - Get Pages
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:1337/api/pages?populate=*
```

---

## Medusa Backend API Tests

### 1. Test Medusa - Store Products (With Publishable Key)
```bash
curl -H "x-publishable-api-key: pk_c9f247ebb15729b47c19f524b7830283750808c68d7d653d587935fef8224e55" \
  http://localhost:9000/store/products
```
**Expected**: `{"products":[...],"count":X,"offset":0,"limit":50}`

### 2. Test Medusa - Store Regions
```bash
curl -H "x-publishable-api-key: pk_c9f247ebb15729b47c19f524b7830283750808c68d7d653d587935fef8224e55" \
  http://localhost:9000/store/regions
```

### 3. Test Medusa - Store Collections
```bash
curl -H "x-publishable-api-key: pk_c9f247ebb15729b47c19f524b7830283750808c68d7d653d587935fef8224e55" \
  http://localhost:9000/store/collections
```

### 4. Test Medusa - Raffle Module (Custom)
```bash
curl -H "x-publishable-api-key: pk_c9f247ebb15729b47c19f524b7830283750808c68d7d653d587935fef8224e55" \
  http://localhost:9000/store/raffles
```

---

## PowerShell Commands (Windows)

If using PowerShell instead of bash:

### Strapi (PowerShell)
```powershell
Invoke-WebRequest -Uri "http://localhost:1337/api/banners" `
  -Headers @{"Authorization"="Bearer YOUR_TOKEN_HERE"} `
  | Select-Object -Expand Content
```

### Medusa (PowerShell)
```powershell
Invoke-WebRequest -Uri "http://localhost:9000/store/products" `
  -Headers @{"x-publishable-api-key"="pk_c9f247ebb15729b47c19f524b7830283750808c68d7d653d587935fef8224e55"} `
  | Select-Object -Expand Content
```

---

## Node.js Test Script

Create a file `test-apis.js`:

```javascript
const STRAPI_TOKEN = 'YOUR_TOKEN_HERE';
const MEDUSA_KEY = 'pk_c9f247ebb15729b47c19f524b7830283750808c68d7d653d587935fef8224e55';

async function testStrapi() {
  console.log('Testing Strapi API...');
  try {
    const response = await fetch('http://localhost:1337/api/banners', {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });
    const data = await response.json();
    console.log('✓ Strapi:', response.status, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('✗ Strapi Error:', error.message);
  }
}

async function testMedusa() {
  console.log('\nTesting Medusa API...');
  try {
    const response = await fetch('http://localhost:9000/store/products', {
      headers: {
        'x-publishable-api-key': MEDUSA_KEY
      }
    });
    const data = await response.json();
    console.log('✓ Medusa:', response.status, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('✗ Medusa Error:', error.message);
  }
}

(async () => {
  await testStrapi();
  await testMedusa();
})();
```

Run with:
```bash
node test-apis.js
```

---

## Frontend Integration Test

Create a Next.js API route to test from the frontend:

**File**: `storefront/app/api/test-connections/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const results = {
    strapi: { status: 'pending', data: null, error: null },
    medusa: { status: 'pending', data: null, error: null },
  };

  // Test Strapi
  try {
    const strapiResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/banners`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
      },
    });
    results.strapi.status = strapiResponse.ok ? 'success' : 'error';
    results.strapi.data = await strapiResponse.json();
  } catch (error: any) {
    results.strapi.status = 'error';
    results.strapi.error = error.message;
  }

  // Test Medusa
  try {
    const medusaResponse = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products`, {
      headers: {
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
      },
    });
    results.medusa.status = medusaResponse.ok ? 'success' : 'error';
    results.medusa.data = await medusaResponse.json();
  } catch (error: any) {
    results.medusa.status = 'error';
    results.medusa.error = error.message;
  }

  return NextResponse.json(results);
}
```

Then visit: http://localhost:3000/api/test-connections

---

## Troubleshooting

### Strapi 403 Forbidden
- Token not created or incorrect
- Token not set in environment variable
- Strapi service not restarted after config change

### Strapi 401 Unauthorized
- Token is invalid or expired
- Token format incorrect (should be: `Bearer YOUR_TOKEN`)

### Medusa "Publishable API key required"
- Key not provided in header
- Header name incorrect (should be: `x-publishable-api-key`)

### Medusa "A valid publishable key is required"
- Key doesn't exist in database
- Key is revoked or expired
- Key not linked to a sales channel

### CORS Errors (in Browser)
- Check `strapi-cms/config/middlewares.js` includes your frontend origin
- Check `medusa-config.ts` includes your frontend in `storeCors`
- Restart both services after config changes

---

## Service Restart Commands

If you need to restart services after configuration changes:

```bash
# Restart all services
docker-compose restart

# Restart specific services
docker restart use-nerd-strapi
docker restart use-nerd-backend

# View logs
docker logs use-nerd-strapi --tail 50 -f
docker logs use-nerd-backend --tail 50 -f
```

---

## Environment Variables Checklist

Before testing, ensure these are set in `storefront/.env.local`:

- [ ] `NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000`
- [ ] `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_c9f247eb...` (64 char hex)
- [ ] `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`
- [ ] `NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api`
- [ ] `NEXT_PUBLIC_STRAPI_API_TOKEN=<your_token_from_strapi_admin>`

After updating `.env.local`, restart the Next.js dev server:
```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

---

**Last Updated**: 2025-11-17
