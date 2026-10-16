/**
 * Theme Utilities for Material React Table
 * 
 * This module provides utility functions for runtime theme manipulation,
 * including dynamic color changes, dark mode toggling, and CSS variable updates.
 * 
 * @example Toggle Dark Mode
 * ```typescript
 * import { toggleDarkMode, isDarkMode } from 'material-react-table';
 * 
 * const handleToggle = () => {
 *   toggleDarkMode();
 *   console.log('Dark mode:', isDarkMode());
 * };
 * ```
 * 
 * @example Update Theme Colors
 * ```typescript
 * import { setThemeColor } from 'material-react-table';
 * 
 * setThemeColor('primary', '221 83% 53%');
 * setThemeColor('primary-foreground', '210 40% 98%');
 * ```
 * 
 * @example Apply Custom Theme
 * ```typescript
 * import { applyTheme } from 'material-react-table';
 * 
 * applyTheme({
 *   primary: '221 83% 53%',
 *   'primary-foreground': '210 40% 98%',
 *   radius: '1rem',
 * });
 * ```
 */

/**
 * Valid theme color keys that can be customized.
 * These correspond to the CSS variables defined in globals.css.
 */
export type ThemeColorKey =
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'destructive-foreground'
  | 'border'
  | 'input'
  | 'ring'
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5';

/**
 * Valid theme property keys including colors and other properties.
 */
export type ThemePropertyKey = ThemeColorKey | 'radius';

/**
 * Theme configuration object for applying multiple theme properties at once.
 */
export type ThemeConfig = Partial<Record<ThemePropertyKey, string>>;

/**
 * Checks if dark mode is currently enabled.
 * 
 * @returns True if dark mode is enabled, false otherwise
 * 
 * @example
 * ```typescript
 * if (isDarkMode()) {
 *   console.log('Dark mode is active');
 * }
 * ```
 */
export function isDarkMode(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

/**
 * Enables dark mode by adding the 'dark' class to the document root.
 * 
 * @example
 * ```typescript
 * enableDarkMode();
 * ```
 */
export function enableDarkMode(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.add('dark');
}

/**
 * Disables dark mode by removing the 'dark' class from the document root.
 * 
 * @example
 * ```typescript
 * disableDarkMode();
 * ```
 */
export function disableDarkMode(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.remove('dark');
}

/**
 * Toggles dark mode on/off.
 * 
 * @returns The new dark mode state (true if enabled, false if disabled)
 * 
 * @example
 * ```typescript
 * const isDark = toggleDarkMode();
 * console.log('Dark mode is now:', isDark ? 'enabled' : 'disabled');
 * ```
 */
export function toggleDarkMode(): boolean {
  if (typeof document === 'undefined') return false;
  document.documentElement.classList.toggle('dark');
  return isDarkMode();
}

/**
 * Sets a specific theme color variable.
 * 
 * @param key - The theme color key to update
 * @param value - The HSL color value (e.g., "221 83% 53%")
 * @param element - Optional element to apply the variable to (defaults to document root)
 * 
 * @example
 * ```typescript
 * // Set primary color
 * setThemeColor('primary', '221 83% 53%');
 * 
 * // Set primary color on a specific element
 * const container = document.getElementById('my-table');
 * setThemeColor('primary', '221 83% 53%', container);
 * ```
 */
export function setThemeColor(
  key: ThemeColorKey,
  value: string,
  element?: HTMLElement | null,
): void {
  if (typeof document === 'undefined') return;
  const target = element || document.documentElement;
  target.style.setProperty(`--${key}`, value);
}

/**
 * Gets the current value of a theme color variable.
 * 
 * @param key - The theme color key to retrieve
 * @param element - Optional element to read the variable from (defaults to document root)
 * @returns The current color value, or empty string if not set
 * 
 * @example
 * ```typescript
 * const primaryColor = getThemeColor('primary');
 * console.log('Current primary color:', primaryColor);
 * ```
 */
export function getThemeColor(
  key: ThemeColorKey,
  element?: HTMLElement | null,
): string {
  if (typeof document === 'undefined') return '';
  const target = element || document.documentElement;
  return getComputedStyle(target).getPropertyValue(`--${key}`).trim();
}

/**
 * Sets the border radius value.
 * 
 * @param value - The border radius value (e.g., "0.5rem", "8px")
 * @param element - Optional element to apply the variable to (defaults to document root)
 * 
 * @example
 * ```typescript
 * // Set border radius to 1rem
 * setThemeRadius('1rem');
 * 
 * // Set border radius to 0 for sharp corners
 * setThemeRadius('0');
 * ```
 */
export function setThemeRadius(
  value: string,
  element?: HTMLElement | null,
): void {
  if (typeof document === 'undefined') return;
  const target = element || document.documentElement;
  target.style.setProperty('--radius', value);
}

/**
 * Gets the current border radius value.
 * 
 * @param element - Optional element to read the variable from (defaults to document root)
 * @returns The current border radius value
 * 
 * @example
 * ```typescript
 * const radius = getThemeRadius();
 * console.log('Current border radius:', radius);
 * ```
 */
export function getThemeRadius(element?: HTMLElement | null): string {
  if (typeof document === 'undefined') return '';
  const target = element || document.documentElement;
  return getComputedStyle(target).getPropertyValue('--radius').trim();
}

/**
 * Applies multiple theme properties at once.
 * 
 * @param config - Object containing theme properties to update
 * @param element - Optional element to apply the variables to (defaults to document root)
 * 
 * @example
 * ```typescript
 * // Apply a custom theme
 * applyTheme({
 *   primary: '221 83% 53%',
 *   'primary-foreground': '210 40% 98%',
 *   secondary: '210 40% 96%',
 *   radius: '1rem',
 * });
 * 
 * // Apply theme to a specific element
 * const container = document.getElementById('my-table');
 * applyTheme({
 *   primary: '221 83% 53%',
 * }, container);
 * ```
 */
export function applyTheme(
  config: ThemeConfig,
  element?: HTMLElement | null,
): void {
  if (typeof document === 'undefined') return;
  const target = element || document.documentElement;

  Object.entries(config).forEach(([key, value]) => {
    if (value !== undefined) {
      target.style.setProperty(`--${key}`, value);
    }
  });
}

/**
 * Resets all theme variables to their default values by removing inline styles.
 * 
 * @param element - Optional element to reset (defaults to document root)
 * 
 * @example
 * ```typescript
 * // Reset theme to defaults
 * resetTheme();
 * 
 * // Reset theme on a specific element
 * const container = document.getElementById('my-table');
 * resetTheme(container);
 * ```
 */
export function resetTheme(element?: HTMLElement | null): void {
  if (typeof document === 'undefined') return;
  const target = element || document.documentElement;

  // List of all theme properties to reset
  const properties: ThemePropertyKey[] = [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
    'radius',
    'chart-1',
    'chart-2',
    'chart-3',
    'chart-4',
    'chart-5',
  ];

  properties.forEach((prop) => {
    target.style.removeProperty(`--${prop}`);
  });
}

/**
 * Creates a scoped theme container that applies theme variables to a specific element.
 * This is useful for having multiple tables with different themes on the same page.
 * 
 * @param element - The element to apply the scoped theme to
 * @param config - Theme configuration to apply
 * 
 * @example
 * ```typescript
 * const container = document.getElementById('my-table');
 * const scopedTheme = createScopedTheme(container, {
 *   primary: '221 83% 53%',
 *   radius: '1rem',
 * });
 * 
 * // Later, reset the scoped theme
 * scopedTheme.reset();
 * ```
 */
export function createScopedTheme(
  element: HTMLElement,
  config: ThemeConfig,
): {
  apply: (newConfig: ThemeConfig) => void;
  reset: () => void;
  get: (key: ThemeColorKey) => string;
  set: (key: ThemeColorKey, value: string) => void;
} {
  // Apply initial theme
  applyTheme(config, element);

  return {
    /**
     * Apply new theme properties to the scoped element
     */
    apply: (newConfig: ThemeConfig) => {
      applyTheme(newConfig, element);
    },

    /**
     * Reset the scoped theme to defaults
     */
    reset: () => {
      resetTheme(element);
    },

    /**
     * Get a theme color value from the scoped element
     */
    get: (key: ThemeColorKey) => {
      return getThemeColor(key, element);
    },

    /**
     * Set a theme color value on the scoped element
     */
    set: (key: ThemeColorKey, value: string) => {
      setThemeColor(key, value, element);
    },
  };
}

/**
 * Utility to convert hex color to HSL format for use with theme variables.
 * 
 * @param hex - Hex color string (e.g., "#3b82f6" or "3b82f6")
 * @returns HSL color string (e.g., "221 83% 53%")
 * 
 * @example
 * ```typescript
 * const hsl = hexToHSL('#3b82f6');
 * setThemeColor('primary', hsl);
 * ```
 */
export function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `${h} ${s}% ${lPercent}%`;
}

/**
 * Utility to convert RGB color to HSL format for use with theme variables.
 * 
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns HSL color string (e.g., "221 83% 53%")
 * 
 * @example
 * ```typescript
 * const hsl = rgbToHSL(59, 130, 246);
 * setThemeColor('primary', hsl);
 * ```
 */
export function rgbToHSL(r: number, g: number, b: number): string {
  // Normalize RGB values
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  // Convert to degrees and percentages
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `${h} ${s}% ${lPercent}%`;
}
