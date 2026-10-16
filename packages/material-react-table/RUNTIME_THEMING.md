# Runtime Theme Customization Guide

This guide explains how to customize the Material React Table theme at runtime, including dynamic color changes, dark mode toggling, and scoped themes.

## Table of Contents

- [Overview](#overview)
- [CSS Variables](#css-variables)
- [Dark Mode](#dark-mode)
- [Runtime Color Changes](#runtime-color-changes)
- [Scoped Themes](#scoped-themes)
- [Color Conversion Utilities](#color-conversion-utilities)
- [Examples](#examples)

## Overview

Material React Table uses CSS variables for theming, which allows for runtime customization without rebuilding your application. All theme values can be changed dynamically via JavaScript or CSS.

### Key Features

- **CSS Variable-based**: All colors and properties use CSS variables
- **Runtime Updates**: Change theme without page reload
- **Dark Mode Support**: Built-in dark mode with easy toggling
- **Scoped Themes**: Apply different themes to different tables on the same page
- **Type-Safe**: Full TypeScript support for theme utilities

## CSS Variables

All theme properties are defined as CSS variables in the `:root` scope:

```css
:root {
  /* Core Colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  
  /* Primary Brand Colors */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  
  /* Border Radius */
  --radius: 0.5rem;
  
  /* ... more variables */
}
```

### Available Variables

| Variable | Description | Default (Light) | Default (Dark) |
|----------|-------------|-----------------|----------------|
| `--background` | Main background color | `0 0% 100%` | `222.2 84% 4.9%` |
| `--foreground` | Main text color | `222.2 84% 4.9%` | `210 40% 98%` |
| `--primary` | Primary action color | `221.2 83.2% 53.3%` | `217.2 91.2% 59.8%` |
| `--primary-foreground` | Text on primary | `210 40% 98%` | `222.2 47.4% 11.2%` |
| `--secondary` | Secondary UI color | `210 40% 96.1%` | `217.2 32.6% 17.5%` |
| `--secondary-foreground` | Text on secondary | `222.2 47.4% 11.2%` | `210 40% 98%` |
| `--muted` | Muted elements | `210 40% 96.1%` | `217.2 32.6% 17.5%` |
| `--muted-foreground` | Muted text | `215.4 16.3% 46.9%` | `215 20.2% 65.1%` |
| `--accent` | Accent/highlight | `210 40% 96.1%` | `217.2 32.6% 17.5%` |
| `--accent-foreground` | Text on accent | `222.2 47.4% 11.2%` | `210 40% 98%` |
| `--destructive` | Error/delete color | `0 84.2% 60.2%` | `0 62.8% 30.6%` |
| `--destructive-foreground` | Text on destructive | `210 40% 98%` | `210 40% 98%` |
| `--border` | Border color | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` |
| `--input` | Input background | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` |
| `--ring` | Focus ring color | `221.2 83.2% 53.3%` | `224.3 76.3% 48%` |
| `--card` | Card background | `0 0% 100%` | `222.2 84% 4.9%` |
| `--card-foreground` | Text on card | `222.2 84% 4.9%` | `210 40% 98%` |
| `--popover` | Popover background | `0 0% 100%` | `222.2 84% 4.9%` |
| `--popover-foreground` | Text on popover | `222.2 84% 4.9%` | `210 40% 98%` |
| `--radius` | Border radius | `0.5rem` | `0.5rem` |

### Color Format

Colors use HSL format without the `hsl()` wrapper:

```
hue saturation% lightness%
```

Example: `221.2 83.2% 53.3%` represents a blue color.

## Dark Mode

### Enabling Dark Mode

Dark mode is controlled by adding the `dark` class to a parent element:

```html
<!-- Enable dark mode for entire page -->
<html class="dark">
  <body>
    <MaterialReactTable {...props} />
  </body>
</html>

<!-- Enable dark mode for specific section -->
<div class="dark">
  <MaterialReactTable {...props} />
</div>
```

### JavaScript API

Use the provided utilities to toggle dark mode programmatically:

```typescript
import {
  isDarkMode,
  enableDarkMode,
  disableDarkMode,
  toggleDarkMode,
} from 'material-react-table';

// Check if dark mode is enabled
if (isDarkMode()) {
  console.log('Dark mode is active');
}

// Enable dark mode
enableDarkMode();

// Disable dark mode
disableDarkMode();

// Toggle dark mode
const isDark = toggleDarkMode();
console.log('Dark mode is now:', isDark ? 'enabled' : 'disabled');
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';
import { toggleDarkMode, isDarkMode } from 'material-react-table';

function DarkModeToggle() {
  const [dark, setDark] = useState(isDarkMode());

  const handleToggle = () => {
    toggleDarkMode();
    setDark(isDarkMode());
  };

  return (
    <button onClick={handleToggle}>
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

## Runtime Color Changes

### Using JavaScript

Change theme colors at runtime using the theme utilities:

```typescript
import { setThemeColor, getThemeColor } from 'material-react-table';

// Set primary color
setThemeColor('primary', '221 83% 53%');

// Set primary foreground color
setThemeColor('primary-foreground', '210 40% 98%');

// Get current primary color
const currentPrimary = getThemeColor('primary');
console.log('Current primary:', currentPrimary);
```

### Using CSS

Override CSS variables in your global CSS:

```css
/* Custom theme in your global CSS */
:root {
  --primary: 221 83% 53%;
  --primary-foreground: 210 40% 98%;
  --radius: 1rem;
}

/* Custom dark mode colors */
.dark {
  --primary: 217 91% 60%;
  --background: 222 84% 5%;
}
```

### Applying Multiple Properties

Use `applyTheme` to update multiple properties at once:

```typescript
import { applyTheme } from 'material-react-table';

applyTheme({
  primary: '221 83% 53%',
  'primary-foreground': '210 40% 98%',
  secondary: '210 40% 96%',
  radius: '1rem',
});
```

### Resetting Theme

Reset all theme variables to defaults:

```typescript
import { resetTheme } from 'material-react-table';

// Reset to default theme
resetTheme();
```

## Scoped Themes

Apply different themes to different tables on the same page:

```typescript
import { createScopedTheme } from 'material-react-table';

// Get table container element
const container1 = document.getElementById('table-1');
const container2 = document.getElementById('table-2');

// Create scoped theme for first table (blue theme)
const theme1 = createScopedTheme(container1, {
  primary: '221 83% 53%',
  'primary-foreground': '210 40% 98%',
});

// Create scoped theme for second table (green theme)
const theme2 = createScopedTheme(container2, {
  primary: '142 76% 36%',
  'primary-foreground': '210 40% 98%',
});

// Later, update a scoped theme
theme1.apply({
  primary: '217 91% 60%',
});

// Get a value from scoped theme
const color = theme1.get('primary');

// Reset a scoped theme
theme1.reset();
```

### React Component Example

```typescript
import { useRef, useEffect } from 'react';
import { createScopedTheme } from 'material-react-table';
import { MaterialReactTable } from 'material-react-table';

function ThemedTable({ theme, ...props }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && theme) {
      const scopedTheme = createScopedTheme(containerRef.current, theme);
      return () => scopedTheme.reset();
    }
  }, [theme]);

  return (
    <div ref={containerRef}>
      <MaterialReactTable {...props} />
    </div>
  );
}

// Usage
<ThemedTable
  theme={{
    primary: '221 83% 53%',
    radius: '1rem',
  }}
  columns={columns}
  data={data}
/>
```

## Color Conversion Utilities

Convert colors from other formats to HSL for use with theme variables:

### Hex to HSL

```typescript
import { hexToHSL, setThemeColor } from 'material-react-table';

// Convert hex color to HSL
const hsl = hexToHSL('#3b82f6');
console.log(hsl); // "221 83% 53%"

// Apply to theme
setThemeColor('primary', hsl);
```

### RGB to HSL

```typescript
import { rgbToHSL, setThemeColor } from 'material-react-table';

// Convert RGB to HSL
const hsl = rgbToHSL(59, 130, 246);
console.log(hsl); // "221 83% 53%"

// Apply to theme
setThemeColor('primary', hsl);
```

## Examples

### Example 1: Dynamic Theme Switcher

```typescript
import { applyTheme } from 'material-react-table';

const themes = {
  blue: {
    primary: '221 83% 53%',
    'primary-foreground': '210 40% 98%',
  },
  green: {
    primary: '142 76% 36%',
    'primary-foreground': '210 40% 98%',
  },
  purple: {
    primary: '262 83% 58%',
    'primary-foreground': '210 40% 98%',
  },
};

function ThemeSwitcher() {
  const handleThemeChange = (themeName: keyof typeof themes) => {
    applyTheme(themes[themeName]);
  };

  return (
    <div>
      <button onClick={() => handleThemeChange('blue')}>Blue</button>
      <button onClick={() => handleThemeChange('green')}>Green</button>
      <button onClick={() => handleThemeChange('purple')}>Purple</button>
    </div>
  );
}
```

### Example 2: Border Radius Slider

```typescript
import { useState } from 'react';
import { setThemeRadius } from 'material-react-table';

function RadiusSlider() {
  const [radius, setRadius] = useState(8);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setRadius(value);
    setThemeRadius(`${value}px`);
  };

  return (
    <div>
      <label>Border Radius: {radius}px</label>
      <input
        type="range"
        min="0"
        max="24"
        value={radius}
        onChange={handleChange}
      />
    </div>
  );
}
```

### Example 3: Color Picker Integration

```typescript
import { useState } from 'react';
import { hexToHSL, setThemeColor } from 'material-react-table';

function ColorPicker() {
  const [color, setColor] = useState('#3b82f6');

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setColor(hex);
    
    // Convert to HSL and apply
    const hsl = hexToHSL(hex);
    setThemeColor('primary', hsl);
  };

  return (
    <div>
      <label>Primary Color</label>
      <input
        type="color"
        value={color}
        onChange={handleColorChange}
      />
    </div>
  );
}
```

### Example 4: Persistent Theme with localStorage

```typescript
import { useEffect } from 'react';
import { applyTheme, isDarkMode, enableDarkMode, disableDarkMode } from 'material-react-table';

function usePersistentTheme() {
  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      applyTheme(JSON.parse(savedTheme));
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      enableDarkMode();
    }
  }, []);

  const saveTheme = (theme: Record<string, string>) => {
    localStorage.setItem('theme', JSON.stringify(theme));
    applyTheme(theme);
  };

  const saveDarkMode = (enabled: boolean) => {
    localStorage.setItem('darkMode', String(enabled));
    if (enabled) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  };

  return { saveTheme, saveDarkMode };
}
```

## Best Practices

1. **Use HSL Format**: Always provide colors in HSL format for consistency
2. **Test Both Modes**: Test your custom colors in both light and dark modes
3. **Maintain Contrast**: Ensure sufficient contrast between foreground and background colors
4. **Scope When Needed**: Use scoped themes when you need different themes on the same page
5. **Persist Preferences**: Save user theme preferences to localStorage
6. **Provide Defaults**: Always provide fallback values for custom themes
7. **Validate Colors**: Validate color values before applying them

## Troubleshooting

### Colors Not Updating

If colors aren't updating, check:

1. CSS variables are properly defined in your global CSS
2. The element you're targeting exists in the DOM
3. The color format is correct (HSL without `hsl()` wrapper)
4. No conflicting inline styles or CSS rules

### Dark Mode Not Working

If dark mode isn't working:

1. Ensure the `dark` class is being added to a parent element
2. Check that dark mode variables are defined in your CSS
3. Verify Tailwind's dark mode is configured correctly
4. Check for conflicting CSS that might override dark mode styles

### Scoped Themes Not Applying

If scoped themes aren't working:

1. Ensure the container element exists before creating the scoped theme
2. Check that the element has a unique ID or ref
3. Verify CSS specificity isn't being overridden
4. Make sure the scoped theme is created after the element is mounted

## API Reference

See the [theme.utils.ts](./src/utils/theme.utils.ts) file for complete API documentation.

### Functions

- `isDarkMode()`: Check if dark mode is enabled
- `enableDarkMode()`: Enable dark mode
- `disableDarkMode()`: Disable dark mode
- `toggleDarkMode()`: Toggle dark mode on/off
- `setThemeColor(key, value, element?)`: Set a theme color
- `getThemeColor(key, element?)`: Get a theme color value
- `setThemeRadius(value, element?)`: Set border radius
- `getThemeRadius(element?)`: Get border radius value
- `applyTheme(config, element?)`: Apply multiple theme properties
- `resetTheme(element?)`: Reset theme to defaults
- `createScopedTheme(element, config)`: Create a scoped theme
- `hexToHSL(hex)`: Convert hex color to HSL
- `rgbToHSL(r, g, b)`: Convert RGB color to HSL

### Types

- `ThemeColorKey`: Valid theme color keys
- `ThemePropertyKey`: Valid theme property keys (colors + radius)
- `ThemeConfig`: Theme configuration object
