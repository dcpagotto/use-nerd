# USE Nerd Cyberpunk Theme Guide

## Overview

This is the complete Tailwind CSS cyberpunk theme for the USE Nerd e-commerce platform. The theme features neon colors, futuristic animations, and a dark, tech-inspired aesthetic perfect for the Brazilian blockchain raffle market.

## Color Palette

### Primary Colors

#### Neon Purple (Primary Brand Color)
```
#B026FF - Main brand color
#CC99FF - Light variant
#7E22CE - Dark variant
```
**Usage:** Primary actions, CTAs, brand elements, main buttons

#### Cyber Blue (Secondary)
```
#06B6D4 - Main secondary color
#22D3EE - Light variant
#0E7490 - Dark variant
```
**Usage:** Secondary actions, links, informational elements, tech highlights

### Accent Colors

#### Hot Pink
```
#EC4899 - Accent pink
```
**Usage:** Special offers, highlights, featured items

#### Matrix Green
```
#10B981 - Success/tech green
```
**Usage:** Success states, active indicators, blockchain confirmations

#### Electric Yellow
```
#FBBF24 - Warning yellow
```
**Usage:** Warnings, important notices, alerts

#### Danger Red
```
#EF4444 - Error red
```
**Usage:** Errors, critical alerts, destructive actions

### Dark Backgrounds
```
#0A0A0F - Primary background
#0F0F14 - Secondary background
#1A1A24 - Tertiary background / cards
```

### Text Colors
```
#F9FAFB - Primary text (light gray)
#D1D5DB - Secondary text
#9CA3AF - Muted text
```

## Google Fonts Recommendations

Add these fonts to your Next.js app for the full cyberpunk experience:

### 1. **Orbitron** (Display/Headings)
- Weight: 400, 600, 700, 800
- Purpose: Hero headings, section titles, logo
- Fallback: system-ui, sans-serif

### 2. **Rajdhani** (Body/UI)
- Weight: 300, 400, 500, 600, 700
- Purpose: Body text, UI elements, navigation
- Fallback: system-ui, sans-serif

### 3. **Geist Sans** (Already included in Next.js)
- Purpose: Alternative body text, modern clean UI

### 4. **Geist Mono** (Already included in Next.js)
- Purpose: Code snippets, technical data, wallet addresses

### How to Add Fonts

In your `app/layout.tsx`:

```tsx
import { Orbitron, Rajdhani } from 'next/font/google'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-orbitron',
  display: 'swap',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

## Component Examples

### Buttons

```jsx
// Neon Outline Button (Purple)
<button className="btn-neon-purple">
  Comprar Rifa
</button>

// Neon Outline Button (Blue)
<button className="btn-neon-blue">
  Explorar
</button>

// Filled Neon Button
<button className="btn-neon-filled-purple">
  Participar Agora
</button>

// Custom Tailwind Classes
<button className="px-6 py-3 bg-neon-purple text-white rounded-cyber shadow-neon-purple-sm hover:shadow-neon-purple transition-all duration-300">
  Custom Button
</button>
```

### Cards

```jsx
// Basic Cyber Card
<div className="card-cyber p-6">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-gray-cyber-300">Card content goes here</p>
</div>

// Card with Glow Effect
<div className="card-cyber-glow p-6">
  <h3 className="text-gradient-cyber text-2xl font-bold mb-4">Featured Raffle</h3>
  <p>Content with gradient heading</p>
</div>

// Glass Effect Card
<div className="glass-cyber rounded-cyber-lg p-6">
  <p>Glassmorphism effect</p>
</div>
```

### Inputs

```jsx
// Cyber Input
<input
  type="text"
  placeholder="Digite seu email"
  className="input-cyber"
/>

// With Focus Effect
<input
  type="email"
  placeholder="Email"
  className="w-full px-4 py-3 bg-cyber-dark-100 border border-neon-purple/30 rounded-cyber text-white focus:border-neon-purple focus:shadow-neon-purple-sm focus-cyber"
/>
```

### Text Styles

```jsx
// Gradient Text
<h1 className="text-gradient-cyber text-display-1">
  USE Nerd
</h1>

// Neon Glow Text
<h2 className="neon-text-purple text-heading-1">
  Blockchain Raffles
</h2>

// With Custom Gradient
<span className="text-gradient-neon text-xl font-bold">
  Limited Edition
</span>
```

### Animations

```jsx
// Glow Pulse Animation
<div className="animate-glow-pulse border border-neon-purple rounded-cyber p-4">
  Pulsing glow effect
</div>

// Float Animation
<div className="animate-float">
  Floating element
</div>

// Neon Flicker
<span className="animate-neon-flicker neon-text-purple">
  Flickering neon text
</span>

// Scan Line Container
<div className="scan-line-container h-96">
  <p>Content with scan line effect</p>
</div>
```

### Backgrounds

```jsx
// Cyberpunk Gradient
<div className="bg-gradient-cyber p-8 rounded-cyber-lg">
  Purple to Blue gradient
</div>

// Grid Background
<section className="grid-cyber-bg py-20">
  Section with cyber grid
</section>

// Neon Gradient
<div className="bg-gradient-neon p-6">
  Multi-color neon gradient
</div>
```

### Complex Components

```jsx
// Hero Section
<section className="section-cyber">
  <div className="container mx-auto text-center">
    <h1 className="text-display-1 font-display text-gradient-cyber mb-6 animate-fade-in">
      Rifas Blockchain
    </h1>
    <p className="text-xl text-gray-cyber-300 mb-8 max-w-2xl mx-auto">
      Transparência total com tecnologia Polygon
    </p>
    <button className="btn-neon-filled-purple text-lg">
      Começar Agora
    </button>
  </div>
</section>

// Product Card
<article className="card-cyber-glow p-6 hover-lift">
  <div className="relative mb-4">
    <img
      src="/product.jpg"
      alt="Product"
      className="rounded-cyber w-full h-48 object-cover"
    />
    <span className="absolute top-2 right-2 bg-neon-pink text-white text-xs font-bold px-3 py-1 rounded-full shadow-neon-pink-sm">
      Novo
    </span>
  </div>
  <h3 className="text-heading-3 font-cyber mb-2">Nome do Produto</h3>
  <p className="text-gray-cyber-300 mb-4">Descrição do produto...</p>
  <div className="flex items-center justify-between">
    <span className="text-2xl font-bold text-neon-purple">R$ 99,90</span>
    <button className="btn-neon-purple">
      Comprar
    </button>
  </div>
</article>

// Status Badge
<span className="inline-flex items-center gap-2 px-3 py-1 bg-neon-green/20 border border-neon-green rounded-full text-neon-green text-sm font-semibold">
  <span className="w-2 h-2 bg-neon-green rounded-full animate-cyber-blink"></span>
  Ativo
</span>
```

## Utility Classes Reference

### Text Glow
- `text-glow-purple` - Purple text shadow glow
- `text-glow-blue` - Blue text shadow glow
- `text-glow-pink` - Pink text shadow glow
- `text-glow-green` - Green text shadow glow

### Hover Effects
- `hover-lift` - Lifts element on hover (-translate-y-2)
- `hover-glow` - Adds neon glow on hover

### Custom Animations
- `animate-glow-pulse` - Pulsing glow effect (2s)
- `animate-neon-flicker` - Neon sign flicker (1.5s)
- `animate-scan-line` - Vertical scan line (8s)
- `animate-float` - Floating effect (6s)
- `animate-glitch` - Glitch effect (1s)
- `animate-cyber-blink` - Blinking indicator (1.5s)

### Backgrounds
- `bg-gradient-cyber` - Purple to blue gradient
- `bg-gradient-neon` - Multi-color neon gradient
- `bg-grid-cyber` - Cyberpunk grid pattern

### Borders
- `border-neon-glow` - Neon border with glow
- `rounded-cyber` - 0.5rem radius
- `rounded-cyber-lg` - 1rem radius
- `rounded-cyber-xl` - 1.5rem radius

### Shadows
- `shadow-cyber` - Dark shadow with purple tint
- `shadow-cyber-lg` - Larger dark shadow
- `shadow-neon-purple` - Purple neon glow
- `shadow-neon-blue` - Blue neon glow
- `shadow-neon-pink` - Pink neon glow

## Responsive Design

All components follow mobile-first design. Use standard Tailwind breakpoints:

```jsx
<div className="px-4 md:px-8 lg:px-12">
  <h1 className="text-3xl md:text-5xl lg:text-display-1">
    Responsive Heading
  </h1>
</div>
```

## Accessibility

All custom components include:
- Focus-visible styles with `focus-cyber` class
- Proper color contrast ratios
- Screen reader support with `sr-only` class
- Keyboard navigation support

```jsx
// Screen reader only text
<span className="sr-only">Hidden from visual users</span>

// Accessible focus
<button className="focus-cyber">
  Accessible Button
</button>
```

## Performance Tips

1. Use `@apply` sparingly - prefer utility classes in HTML
2. Import only needed animations
3. Use CSS variables for runtime theming
4. Lazy load heavy animation effects
5. Use `transform` and `opacity` for animations (GPU-accelerated)

## Dark Mode

The theme is dark by default. Light mode is not currently supported but can be added by:

1. Adding light color variants to `tailwind.config.ts`
2. Using `dark:` variant classes
3. Toggling the `dark` class on `<html>`

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (some glow effects may vary)
- Mobile browsers: Full support

## Example Page Structure

```jsx
export default function HomePage() {
  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <section className="section-cyber scan-line-container">
        <div className="container mx-auto px-4">
          <h1 className="text-display-1 font-display text-gradient-cyber text-center mb-8 animate-fade-in">
            Bem-vindo ao USE Nerd
          </h1>
          <p className="text-xl text-center text-gray-cyber-300 mb-12 max-w-3xl mx-auto">
            A primeira plataforma de rifas blockchain do Brasil
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-neon-filled-purple">
              Participar Agora
            </button>
            <button className="btn-neon-blue">
              Saber Mais
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-cyber-glow p-6 hover-lift">
              <h3 className="text-heading-3 text-neon-purple mb-4">Blockchain</h3>
              <p className="text-gray-cyber-300">
                Transparência total com Polygon
              </p>
            </div>
            {/* More cards... */}
          </div>
        </div>
      </section>
    </div>
  )
}
```

## Need Help?

For more examples and component patterns, check:
- `/components` - Reusable components
- `/app` - Page examples
- Tailwind CSS Documentation: https://tailwindcss.com/docs

---

**Theme Version:** 1.0.0
**Last Updated:** 2025-11-11
**Tailwind Version:** 4.0.0-alpha.30
