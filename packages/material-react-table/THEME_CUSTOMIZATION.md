# Theme Customization Guide

Material React Table uses Tailwind CSS for styling, providing a flexible and powerful theme system. This guide explains how to customize the appearance of your tables.

## Table of Contents

- [Overview](#overview)
- [Customization Methods](#customization-methods)
- [Color System](#color-system)
- [Spacing and Layout](#spacing-and-layout)
- [Typography](#typography)
- [Dark Mode](#dark-mode)
- [Migration from MUI Theme](#migration-from-mui-theme)
- [Examples](#examples)

## Overview

The theme system is built on three layers:

1. **CSS Variables** - Runtime customization via CSS custom properties
2. **Tailwind Configuration** - Build-time theme extension
3. **TypeScript Interfaces** - Type-safe theme configuration

All theme values use CSS variables, allowing you to customize the appearance without rebuilding your application.

## Customization Methods

### Method 1: CSS Variables (Recommended)

The easiest way to customize the theme is by overriding CSS variables in your global CSS:

```css
/* In your global CSS file */
:root {
  /* Primary brand color */
  --primary: 221 83% 53%;
  --primary-foreground: 210 40% 98%;
  
  /* Border radius */
  --radius: 0.5rem;
  
  /* Background colors */
  --background: 0 0% 100%;
  --foreground: 222 84% 5%;
}

/* Dark mode overrides */
.dark {
  --primary: 217 91% 60%;
  --background: 222 84% 5%;
  --foreground: 210 40% 98%;
}
```

**Note:** Colors use HSL format without the `hsl()` wrapper. Format: `hue saturation% lightness%`

### Method 2: Tailwind Configuration

For more extensive customization, extend the Tailwind configuration:

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(221, 83%, 53%)',
          foreground: 'hsl(210, 40%, 98%)',
        },
        // Override other colors...
      },
      spacing: {
        '4': '1.5rem', // Override default spacing
      },
      fontSize: {
        base: ['1.125rem', { lineHeight: '1.75rem' }],
      },
    },
  },
};

export default config;
```

### Method 3: TypeScript Theme Interface

For type-safe theme configuration, use the provided TypeScript interfaces:

```typescript
import type { MRTCustomTheme } from 'material-react-table';

const customTheme: MRTCustomTheme = {
  extend: {
    colors: {
      primary: {
        DEFAULT: '221 83% 53%',
        foreground: '210 40% 98%',
      },
    },
    spacing: {
      '4': '1.5rem',
    },
  },
};
```

## Color System

### Available Color Tokens

Material React Table uses semantic color tokens:

| Token | Purpose | Example Usage |
|-------|---------|---------------|
| `border` | Border colors for cells, inputs | Table cell borders, input outlines |
| `input` | Input field backgrounds | Filter inputs, edit fields |
| `ring` | Focus ring for keyboard navigation | Focused buttons, inputs |
| `background` | Main background color | Table background |
| `foreground` | Main text color | Body text, labels |
| `primary` | Primary actions | Action buttons, links |
| `secondary` | Secondary UI elements | Toolbar, pagination |
| `destructive` | Destructive actions | Delete buttons, error states |
| `muted` | Muted/disabled elements | Disabled buttons, placeholder text |
| `accent` | Highlights and hover states | Row hover, selected items |
| `popover` | Popover backgrounds | Dropdown menus, tooltips |
| `card` | Card/paper backgrounds | Table container |

### Color Format

Colors use HSL (Hue, Saturation, Lightness) format for better dark mode support:

```css
/* HSL format: hue saturation% lightness% */
--primary: 221 83% 53%;

/* Used in Tailwind as: */
background-color: hsl(var(--primary));
```

**Why HSL?**
- Easier to create color variations (lighter/darker)
- Better dark mode support
- More intuitive than RGB for designers

### Customizing Colors

```css
:root {
  /* Brand colors */
  --primary: 221 83% 53%;           /* Blue */
  --primary-foreground: 210 40% 98%; /* White text on blue */
  
  /* UI colors */
  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 11%;
  
  /* Semantic colors */
  --destructive: 0 84% 60%;         /* Red for delete actions */
  --destructive-foreground: 210 40% 98%;
  
  /* Surface colors */
  --background: 0 0% 100%;          /* White */
  --foreground: 222 84% 5%;         /* Near black */
  --card: 0 0% 100%;
  --card-foreground: 222 84% 5%;
  
  /* Interactive colors */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;
  
  /* Border and input */
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 221 83% 53%;
}
```

## Spacing and Layout

### Spacing Scale

Material React Table uses a consistent spacing scale:

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `0` | 0px | 0px | No spacing |
| `1` | 0.25rem | 4px | Tight spacing |
| `2` | 0.5rem | 8px | Small spacing |
| `3` | 0.75rem | 12px | Medium-small |
| `4` | 1rem | 16px | Base spacing |
| `5` | 1.25rem | 20px | Medium-large |
| `6` | 1.5rem | 24px | Large spacing |
| `8` | 2rem | 32px | Extra large |
| `10` | 2.5rem | 40px | 2XL spacing |
| `12` | 3rem | 48px | 3XL spacing |
| `16` | 4rem | 64px | 4XL spacing |

### Customizing Spacing

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      spacing: {
        '4': '1.5rem', // Override default 1rem
        '18': '4.5rem', // Add new spacing value
      },
    },
  },
};
```

### Border Radius

Border radius values are calculated from the `--radius` CSS variable:

```css
:root {
  --radius: 0.5rem; /* Base radius (8px) */
}

/* Calculated values: */
/* sm: calc(var(--radius) - 4px) = 4px */
/* md: calc(var(--radius) - 2px) = 6px */
/* lg: var(--radius) = 8px */
```

To customize:

```css
:root {
  --radius: 0.75rem; /* Increase to 12px */
}
```

## Typography

### Font Sizes

Material React Table provides a type scale with line heights:

| Size | Font Size | Line Height | Usage |
|------|-----------|-------------|-------|
| `xs` | 0.75rem (12px) | 1rem (16px) | Small labels, captions |
| `sm` | 0.875rem (14px) | 1.25rem (20px) | Table cells, inputs |
| `base` | 1rem (16px) | 1.5rem (24px) | Body text |
| `lg` | 1.125rem (18px) | 1.75rem (28px) | Headings |
| `xl` | 1.25rem (20px) | 1.75rem (28px) | Large headings |
| `2xl` | 1.5rem (24px) | 2rem (32px) | Page titles |

### Font Families

Two font stacks are provided:

**Sans-serif (default):**
```css
font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", 
             "Helvetica Neue", Arial, sans-serif;
```

**Monospace (for data/code):**
```css
font-family: "Roboto Mono", Consolas, Monaco, "Courier New", monospace;
```

### Customizing Typography

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontSize: {
        sm: ['0.875rem', { lineHeight: '1.5rem' }], // Increase line height
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
};
```

## Dark Mode

### Enabling Dark Mode

Dark mode is enabled via the `class` strategy. Add the `dark` class to any parent element:

```tsx
// App-wide dark mode
<div className="dark">
  <MaterialReactTable {...props} />
</div>

// Per-table dark mode
<div className="dark">
  <MaterialReactTable {...props} />
</div>
```

### Dark Mode Colors

Define dark mode colors in your CSS:

```css
.dark {
  --background: 222 84% 5%;
  --foreground: 210 40% 98%;
  --card: 222 84% 5%;
  --card-foreground: 210 40% 98%;
  --popover: 222 84% 5%;
  --popover-foreground: 210 40% 98%;
  --primary: 217 91% 60%;
  --primary-foreground: 222 47% 11%;
  --secondary: 217 33% 18%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217 33% 18%;
  --muted-foreground: 215 20% 65%;
  --accent: 217 33% 18%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 210 40% 98%;
  --border: 217 33% 18%;
  --input: 217 33% 18%;
  --ring: 224 76% 48%;
}
```

### Dark Mode Toggle

Implement a dark mode toggle:

```tsx
import { useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className={darkMode ? 'dark' : ''}>
      <button onClick={() => setDarkMode(!darkMode)}>
        Toggle Dark Mode
      </button>
      <MaterialReactTable {...props} />
    </div>
  );
}
```

## Migration from MUI Theme

If you're migrating from Material UI, here's how to translate common theme customizations:

### MUI Theme → Tailwind CSS Variables

```typescript
// MUI Theme (before)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
  spacing: 8,
  typography: {
    fontSize: 14,
  },
});

// Tailwind CSS Variables (after)
:root {
  --primary: 207 90% 54%;        /* #1976d2 in HSL */
  --background: 0 0% 100%;       /* #ffffff */
  --card: 0 0% 96%;              /* #f5f5f5 */
  --radius: 0.5rem;              /* 8px */
}
```

### Common MUI Properties

| MUI Property | Tailwind Equivalent |
|--------------|---------------------|
| `theme.palette.primary.main` | `--primary` |
| `theme.palette.secondary.main` | `--secondary` |
| `theme.palette.error.main` | `--destructive` |
| `theme.palette.background.default` | `--background` |
| `theme.palette.background.paper` | `--card` |
| `theme.palette.text.primary` | `--foreground` |
| `theme.palette.text.secondary` | `--muted-foreground` |
| `theme.spacing(2)` | `spacing-2` (0.5rem) |
| `theme.shape.borderRadius` | `--radius` |

## Examples

### Example 1: Corporate Brand Colors

```css
:root {
  /* Corporate blue */
  --primary: 210 100% 50%;
  --primary-foreground: 0 0% 100%;
  
  /* Corporate gray */
  --secondary: 210 10% 90%;
  --secondary-foreground: 210 10% 20%;
  
  /* Accent orange */
  --accent: 30 100% 50%;
  --accent-foreground: 0 0% 100%;
}
```

### Example 2: High Contrast Theme

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  --border: 0 0% 0%;
  --primary: 0 0% 0%;
  --primary-foreground: 0 0% 100%;
  --ring: 0 0% 0%;
}
```

### Example 3: Compact Spacing

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      spacing: {
        '1': '0.125rem', // 2px
        '2': '0.25rem',  // 4px
        '3': '0.5rem',   // 8px
        '4': '0.75rem',  // 12px
      },
    },
  },
};
```

### Example 4: Custom Font Stack

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],
        base: ['0.9375rem', { lineHeight: '1.5rem' }],
      },
    },
  },
};
```

## Best Practices

1. **Use CSS Variables for Runtime Changes** - CSS variables allow theme changes without rebuilding
2. **Use HSL for Colors** - HSL makes it easier to create color variations and dark modes
3. **Maintain Contrast Ratios** - Ensure text meets WCAG AA standards (4.5:1 for normal text)
4. **Test Dark Mode** - Always test your customizations in both light and dark modes
5. **Use Semantic Tokens** - Use `primary`, `secondary`, etc. instead of specific colors
6. **Consistent Spacing** - Stick to the spacing scale for visual consistency
7. **Document Customizations** - Keep a record of your theme customizations

## Troubleshooting

### Colors Not Applying

Make sure CSS variables are defined in `:root`:

```css
:root {
  --primary: 221 83% 53%; /* ✓ Correct */
}

/* Not in :root */
.my-class {
  --primary: 221 83% 53%; /* ✗ Won't work globally */
}
```

### Dark Mode Not Working

Ensure the `dark` class is on a parent element:

```tsx
<div className="dark"> {/* ✓ Correct */}
  <MaterialReactTable {...props} />
</div>

<MaterialReactTable className="dark" {...props} /> {/* ✗ Won't work */}
```

### Spacing Not Consistent

Use the spacing scale instead of arbitrary values:

```tsx
<div className="p-4"> {/* ✓ Correct - uses scale */}
<div className="p-[17px]"> {/* ✗ Avoid - arbitrary value */}
```

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HSL Color Picker](https://hslpicker.com/)
- [WCAG Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Material Design Color System](https://m3.material.io/styles/color/system/overview)

## Support

For questions or issues with theme customization:
- [GitHub Issues](https://github.com/KevinVandy/material-react-table/issues)
- [Discord Community](https://discord.gg/5wqyRx6fnm)
- [Documentation](https://www.material-react-table.com)
