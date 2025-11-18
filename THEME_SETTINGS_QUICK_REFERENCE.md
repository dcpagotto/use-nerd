# Theme Settings - Quick Reference Guide

## API Endpoint

```
GET http://localhost:1337/api/theme-setting
```

**Status:** PUBLIC (no authentication required)

## Response Structure

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "themeName": "Cyberpunk Neon",
      "primaryColor": "#a855f7",
      "secondaryColor": "#ec4899",
      "accentColor": "#06b6d4",
      "backgroundColor": "#0f172a",
      "surfaceColor": "#1e293b",
      "textColor": "#f1f5f9",
      "textMutedColor": "#94a3b8",
      "successColor": "#10b981",
      "errorColor": "#ef4444",
      "warningColor": "#f59e0b"
    }
  }
}
```

## Color Palette

| Color Variable   | Hex Value | Description            |
|------------------|-----------|------------------------|
| primaryColor     | #a855f7   | Purple neon (main)     |
| secondaryColor   | #ec4899   | Pink neon (accents)    |
| accentColor      | #06b6d4   | Cyan (highlights)      |
| backgroundColor  | #0f172a   | Dark slate (bg)        |
| surfaceColor     | #1e293b   | Slate 800 (cards)      |
| textColor        | #f1f5f9   | Light (main text)      |
| textMutedColor   | #94a3b8   | Gray (secondary text)  |
| successColor     | #10b981   | Green (success)        |
| errorColor       | #ef4444   | Red (errors)           |
| warningColor     | #f59e0b   | Amber (warnings)       |

## Frontend Integration

### Fetch Theme Settings (Next.js)

```typescript
// lib/strapi-client.ts
export async function getThemeSettings() {
  const res = await fetch('http://localhost:1337/api/theme-setting', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!res.ok) throw new Error('Failed to fetch theme');

  const data = await res.json();
  return data.data.attributes;
}
```

### Apply as CSS Variables

```tsx
// app/layout.tsx
import { getThemeSettings } from '@/lib/strapi-client';

export default async function RootLayout({ children }) {
  const theme = await getThemeSettings();

  return (
    <html
      lang="pt-BR"
      style={{
        '--color-primary': theme.primaryColor,
        '--color-secondary': theme.secondaryColor,
        '--color-accent': theme.accentColor,
        '--color-bg': theme.backgroundColor,
        '--color-surface': theme.surfaceColor,
        '--color-text': theme.textColor,
        '--color-text-muted': theme.textMutedColor,
        '--color-success': theme.successColor,
        '--color-error': theme.errorColor,
        '--color-warning': theme.warningColor,
      }}
    >
      <body className="bg-[var(--color-bg)] text-[var(--color-text)]">
        {children}
      </body>
    </html>
  );
}
```

### Use in Tailwind Config

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-text-muted)',
      },
    },
  },
};
```

### Use in Components

```tsx
// Component example
<div className="bg-surface text-primary border-accent">
  <h1 className="text-primary">Cyberpunk Heading</h1>
  <p className="text-muted">Secondary text</p>
</div>
```

## Admin Management

### Update Colors via Admin UI

1. Navigate to: http://localhost:1337/admin
2. Go to: **Content Manager** → **Theme Settings**
3. Edit color fields (must be valid hex: #RRGGBB or #RGB)
4. Click **Save**

### Update via Database

```sql
-- Connect to database
docker exec -it use-nerd-postgres psql -U postgres -d use-nerd

-- Update a color
UPDATE strapi.theme_settings
SET primary_color = '#NEW_HEX'
WHERE id = 1;

-- View current settings
SELECT theme_name, primary_color, secondary_color, accent_color
FROM strapi.theme_settings;
```

## Testing

### Test API Endpoint

```bash
# Get theme settings
curl http://localhost:1337/api/theme-setting | python -m json.tool

# Check HTTP status
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:1337/api/theme-setting
```

### Verify Database

```bash
docker exec use-nerd-postgres psql -U postgres -d use-nerd \
  -c "SELECT * FROM strapi.theme_settings;"
```

## File Locations

```
strapi-cms/src/api/theme-setting/
├── content-types/theme-setting/schema.json
├── controllers/theme-setting.js
├── services/theme-setting.js
└── routes/theme-setting.js
```

## Common Issues

### 403 Forbidden Error
**Problem:** API returns 403 when accessing /api/theme-setting

**Solution:** Check public permissions in Strapi admin:
1. Settings → Users & Permissions → Roles → Public
2. Find "Theme-setting" → Enable "find" permission
3. Save

### Empty Response
**Problem:** API returns `{"data": null}`

**Solution:** Insert default data:
```sql
INSERT INTO strapi.theme_settings (
  theme_name, primary_color, secondary_color, accent_color,
  background_color, surface_color, text_color, text_muted_color,
  success_color, error_color, warning_color,
  created_at, updated_at, created_by_id, updated_by_id
) VALUES (
  'Cyberpunk Neon', '#a855f7', '#ec4899', '#06b6d4',
  '#0f172a', '#1e293b', '#f1f5f9', '#94a3b8',
  '#10b981', '#ef4444', '#f59e0b',
  NOW(), NOW(), 3, 3
);
```

### Invalid Hex Color
**Problem:** Color validation fails

**Solution:** Ensure hex format is correct:
- Valid: `#a855f7`, `#fff`, `#000000`
- Invalid: `a855f7`, `#gg0000`, `rgb(255,0,0)`

---

**Quick Test:**
```bash
curl http://localhost:1337/api/theme-setting
```

Expected: HTTP 200 with full theme color data
