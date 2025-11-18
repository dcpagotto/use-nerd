# Cyberpunk Theme - Quick Reference

## Essential Tailwind Classes

### Color Classes

```css
/* Text Colors */
text-white              /* Pure white */
text-gray-cyber-100     /* Light gray */
text-gray-cyber-300     /* Medium gray */
text-gray-cyber-400     /* Muted gray */

neon-text-purple        /* Purple with glow */
neon-text-blue          /* Blue with glow */
neon-text-pink          /* Pink with glow */

text-gradient-cyber     /* Purple → Blue gradient */
text-gradient-neon      /* Purple → Pink → Blue gradient */

/* Background Colors */
bg-cyber-dark           /* Deepest black (#0A0A0F) */
bg-cyber-dark-100       /* Card background (#0F0F14) */
bg-cyber-dark-50        /* Element background (#1A1A24) */

bg-neon-purple          /* Neon purple (#B026FF) */
bg-neon-blue            /* Cyber blue (#06B6D4) */
bg-neon-pink            /* Hot pink (#EC4899) */
bg-neon-green           /* Matrix green (#10B981) */
bg-neon-yellow          /* Electric yellow (#FBBF24) */

/* Gradient Backgrounds */
bg-gradient-cyber       /* Purple → Blue */
bg-gradient-cyber-reverse /* Blue → Purple */
bg-gradient-neon        /* Purple → Pink → Blue */

/* Border Colors */
border-neon-purple      /* Purple border */
border-neon-purple/20   /* 20% opacity */
border-neon-purple/30   /* 30% opacity (default) */
```

---

### Component Classes

```css
/* Buttons */
btn-neon-purple         /* Outlined purple button */
btn-neon-blue           /* Outlined blue button */
btn-neon-pink           /* Outlined pink button */

btn-neon-filled-purple  /* Filled purple button */
btn-neon-filled-blue    /* Filled blue button */

/* Cards */
card-cyber              /* Standard card */
card-cyber-glow         /* Card with hover glow */

/* Inputs */
input-cyber             /* Styled input field */

/* Focus */
focus-cyber             /* Custom focus ring */
```

---

### Layout Classes

```css
/* Border Radius */
rounded-cyber           /* 0.5rem */
rounded-cyber-lg        /* 1rem */
rounded-cyber-xl        /* 1.5rem */

/* Shadows */
shadow-cyber            /* Standard depth */
shadow-cyber-lg         /* Large depth */

shadow-neon-purple      /* Purple glow (large) */
shadow-neon-purple-sm   /* Purple glow (small) */
shadow-neon-blue        /* Blue glow */
shadow-neon-pink        /* Pink glow */
shadow-neon-green       /* Green glow */
```

---

### Animation Classes

```css
/* Animations */
animate-glow-pulse      /* Pulsing glow (2s) */
animate-pulse-slow      /* Slow pulse (3s) */
animate-float           /* Gentle float (6s) */
animate-scan-line       /* Scan line effect (8s) */
animate-cyber-blink     /* Blinking cursor */

/* Special Containers */
scan-line-container     /* Add scan-line overlay */

/* Utility Animations */
hover-lift              /* Lift on hover (-translate-y) */
hover-glow              /* Glow on hover */
```

---

### Typography

```css
/* Font Families */
font-display            /* Orbitron (headers) */
font-sans               /* Geist Sans (body) */
font-mono               /* Geist Mono (technical) */

/* Font Sizes (custom) */
text-display-1          /* 4.5rem - Extra large */
text-display-2          /* 3.75rem - Very large */
text-display-3          /* 3rem - Large */
text-heading-1          /* 2.25rem - H1 */
text-heading-2          /* 1.875rem - H2 */
text-heading-3          /* 1.5rem - H3 */

/* Text Effects */
text-glow-purple        /* Purple text shadow glow */
text-glow-blue          /* Blue text shadow glow */
text-glow-pink          /* Pink text shadow glow */
```

---

## Common Patterns

### Standard Card

```tsx
<div className="rounded-cyber-lg bg-cyber-dark-100 border-2 border-neon-purple/20 shadow-cyber p-6">
  <h3 className="text-xl font-bold text-white mb-2">Title</h3>
  <p className="text-gray-cyber-300">Content...</p>
</div>
```

### Card with Hover Glow

```tsx
<Link
  href="/path"
  className="card-cyber-glow group rounded-cyber-lg bg-cyber-dark-100 border-2 border-neon-purple/20 p-6 transition-all duration-300 hover:border-neon-purple hover:shadow-neon-purple hover:-translate-y-2"
>
  <h3 className="text-xl font-bold text-white group-hover:text-gradient-cyber transition-all">
    Title
  </h3>
</Link>
```

### Neon Button with Glow

```tsx
<button className="group relative inline-block">
  {/* Glow effect */}
  <div className="absolute -inset-1 bg-gradient-cyber rounded-cyber blur opacity-75 group-hover:opacity-100 transition-opacity" />

  {/* Button */}
  <div className="relative px-6 py-3 bg-cyber-dark rounded-cyber border-2 border-neon-purple group-hover:border-neon-pink transition-all">
    <span className="font-bold uppercase tracking-wider text-neon-purple group-hover:text-neon-pink">
      Click Me
    </span>
  </div>
</button>
```

### Progress Bar

```tsx
<div className="h-2 rounded-full bg-cyber-dark-50 border border-neon-purple/20 overflow-hidden">
  <div
    className="h-full rounded-full bg-gradient-cyber shadow-neon-purple-sm transition-all duration-500"
    style={{ width: `${percentage}%` }}
  />
</div>
```

### Badge

```tsx
{/* Success/Verified */}
<span className="rounded-cyber bg-neon-green px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-cyber-dark shadow-neon-green">
  Verified
</span>

{/* Featured */}
<span className="rounded-cyber bg-gradient-cyber px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg animate-glow-pulse">
  Featured
</span>
```

### Section Header

```tsx
<div className="text-center mb-12">
  <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-wider text-gradient-neon mb-4">
    Section Title
  </h2>
  <p className="text-lg text-gray-cyber-300">Subtitle text</p>
  <div className="h-1 w-32 mx-auto bg-gradient-cyber rounded-full shadow-neon-purple-sm mt-4" />
</div>
```

### Image Container with Overlay

```tsx
<div className="relative aspect-video overflow-hidden bg-gradient-cyber rounded-cyber-lg">
  <Image
    src={imageUrl}
    alt="Description"
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-110"
  />

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark-100 via-transparent to-transparent" />

  {/* Grid overlay */}
  <div className="absolute inset-0 bg-grid-cyber bg-grid-md opacity-10 pointer-events-none" />
</div>
```

### Corner Accent Glow

```tsx
<div className="relative">
  {/* Main content */}
  <div className="...">
    Content here
  </div>

  {/* Corner glow (top-right) */}
  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-neon-purple/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
</div>
```

### Bottom Neon Border

```tsx
<div className="relative">
  {/* Content */}
  <div className="...">
    Content here
  </div>

  {/* Neon border that expands on hover */}
  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-cyber transition-all duration-300 group-hover:h-2 shadow-neon-purple-sm" />
</div>
```

---

## Responsive Patterns

### Grid Layout

```tsx
{/* 1 column mobile, 2 tablet, 3 desktop, 4 wide */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(...)}
</div>
```

### Responsive Text

```tsx
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black">
  Responsive Heading
</h1>

<p className="text-base sm:text-lg md:text-xl text-gray-cyber-300">
  Responsive paragraph
</p>
```

### Responsive Spacing

```tsx
<section className="py-12 sm:py-16 md:py-20 lg:py-24">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    Content
  </div>
</section>
```

---

## Color Combinations

### Primary (Purple + Blue)
```tsx
bg-gradient-cyber        /* Background */
text-neon-purple         /* Text */
border-neon-purple       /* Border */
shadow-neon-purple       /* Glow */
```

### Secondary (Blue + Green)
```tsx
bg-neon-blue/10          /* Subtle background */
text-neon-blue           /* Text */
border-neon-blue         /* Border */
shadow-neon-blue-sm      /* Small glow */
```

### Success/Verified (Green)
```tsx
bg-neon-green            /* Background */
text-cyber-dark          /* Dark text on green */
border-neon-green        /* Border */
shadow-neon-green        /* Glow */
```

### Warning/Featured (Yellow)
```tsx
bg-neon-yellow           /* Background */
text-cyber-dark          /* Dark text on yellow */
border-neon-yellow       /* Border */
```

### Accent (Pink)
```tsx
bg-neon-pink             /* Background */
text-neon-pink           /* Text */
border-neon-pink         /* Border */
shadow-neon-pink         /* Glow */
```

---

## Transition Timing

```css
/* Standard transitions */
transition-all duration-300

/* Slower for large elements */
transition-all duration-500

/* Fast for interactions */
transition-colors duration-200

/* Complex transforms */
transition-transform duration-500
```

---

## Z-Index Layers

```css
z-0    /* Background overlays */
z-10   /* Content */
z-20   /* Badges, labels */
z-30   /* Tooltips */
z-40   /* Dropdowns */
z-50   /* Modals, header */
```

---

## Hover States Template

```tsx
<div className="group">
  {/* Scale image */}
  <img className="group-hover:scale-110 transition-transform duration-500" />

  {/* Change text color */}
  <h3 className="text-white group-hover:text-gradient-cyber transition-all">
    Title
  </h3>

  {/* Lift card */}
  <div className="group-hover:-translate-y-2 transition-transform">
    Card
  </div>

  {/* Show glow */}
  <div className="group-hover:shadow-neon-purple transition-shadow">
    Element
  </div>

  {/* Expand border */}
  <div className="h-1 group-hover:h-2 transition-all">
    Border
  </div>
</div>
```

---

## Print This Reference

Save this file and keep it open while coding for quick access to class names and patterns.

### Most Used Classes
1. `bg-cyber-dark-100` - Card backgrounds
2. `border-neon-purple/20` - Subtle borders
3. `text-gradient-cyber` - Gradient text
4. `rounded-cyber-lg` - Rounded corners
5. `shadow-neon-purple` - Glow effects
6. `hover:-translate-y-2` - Lift animation
7. `transition-all duration-300` - Smooth transitions
8. `group-hover:scale-110` - Image zoom
9. `text-gray-cyber-300` - Body text
10. `font-display` - Headers

---

**Pro Tip**: Combine classes for maximum effect!

```tsx
<button className="
  relative group
  px-6 py-3
  bg-gradient-cyber
  rounded-cyber-lg
  border-2 border-neon-purple
  shadow-neon-purple-sm
  font-bold uppercase tracking-wider
  text-white
  transition-all duration-300
  hover:scale-105 hover:shadow-neon-purple
  focus-cyber
">
  Ultimate Button
</button>
```
