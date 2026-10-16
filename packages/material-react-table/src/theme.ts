/**
 * Theme Configuration System for Material React Table
 * 
 * This module provides TypeScript interfaces and utilities for customizing
 * the appearance of Material React Table using Tailwind CSS.
 * 
 * @example Basic Usage
 * ```typescript
 * // In your tailwind.config.ts
 * import type { MRTThemeConfig } from 'material-react-table';
 * 
 * const config = {
 *   theme: {
 *     extend: {
 *       colors: {
 *         primary: {
 *           DEFAULT: 'hsl(221, 83%, 53%)',
 *           foreground: 'hsl(210, 40%, 98%)',
 *         },
 *       },
 *     },
 *   },
 * };
 * ```
 * 
 * @example CSS Variables
 * ```css
 * :root {
 *   --primary: 221 83% 53%;
 *   --primary-foreground: 210 40% 98%;
 * }
 * ```
 */

/**
 * Color configuration for a single color with foreground variant.
 * Colors should be specified in HSL format without the `hsl()` wrapper.
 * 
 * @example
 * ```typescript
 * const primary: MRTColorConfig = {
 *   DEFAULT: '221 83% 53%',
 *   foreground: '210 40% 98%',
 * };
 * ```
 */
export interface MRTColorConfig {
  /** The default color value in HSL format (e.g., "221 83% 53%") */
  DEFAULT: string;
  /** The foreground/text color to use on top of this color */
  foreground: string;
}

/**
 * Complete color palette configuration for Material React Table.
 * All colors use HSL format for better dark mode support.
 * 
 * Colors are organized by semantic meaning:
 * - **border**: Border colors for table cells, inputs, and containers
 * - **input**: Background color for input fields
 * - **ring**: Focus ring color for interactive elements
 * - **background**: Main background color
 * - **foreground**: Main text color
 * - **primary**: Primary action color (buttons, links)
 * - **secondary**: Secondary UI elements
 * - **destructive**: Destructive actions (delete, error states)
 * - **muted**: Muted/disabled elements
 * - **accent**: Accent color for highlights and hover states
 * - **popover**: Popover and dropdown backgrounds
 * - **card**: Card and paper backgrounds
 */
export interface MRTColorPalette {
  /** Border color for table cells, inputs, and dividers */
  border: string;
  /** Background color for input fields */
  input: string;
  /** Focus ring color for keyboard navigation */
  ring: string;
  /** Main background color for the table */
  background: string;
  /** Main text/foreground color */
  foreground: string;
  /** Primary brand color with foreground variant */
  primary: MRTColorConfig;
  /** Secondary UI color with foreground variant */
  secondary: MRTColorConfig;
  /** Destructive action color with foreground variant */
  destructive: MRTColorConfig;
  /** Muted/disabled element color with foreground variant */
  muted: MRTColorConfig;
  /** Accent/highlight color with foreground variant */
  accent: MRTColorConfig;
  /** Popover background color with foreground variant */
  popover: MRTColorConfig;
  /** Card/paper background color with foreground variant */
  card: MRTColorConfig;
}

/**
 * Spacing scale configuration for consistent spacing throughout the table.
 * Values should be specified in rem units for scalability.
 * 
 * @example
 * ```typescript
 * const spacing: MRTSpacingConfig = {
 *   '0': '0px',
 *   '1': '0.25rem',
 *   '2': '0.5rem',
 *   '4': '1rem',
 * };
 * ```
 */
export interface MRTSpacingConfig {
  /** No spacing (0px) */
  '0': string;
  /** Extra small spacing (0.25rem / 4px) */
  '1': string;
  /** Small spacing (0.5rem / 8px) */
  '2': string;
  /** Medium-small spacing (0.75rem / 12px) */
  '3': string;
  /** Medium spacing (1rem / 16px) */
  '4': string;
  /** Medium-large spacing (1.25rem / 20px) */
  '5': string;
  /** Large spacing (1.5rem / 24px) */
  '6': string;
  /** Extra large spacing (2rem / 32px) */
  '8': string;
  /** 2XL spacing (2.5rem / 40px) */
  '10': string;
  /** 3XL spacing (3rem / 48px) */
  '12': string;
  /** 4XL spacing (4rem / 64px) */
  '16': string;
}

/**
 * Border radius configuration for rounded corners.
 * Supports multiple sizes from small to large.
 * 
 * @example
 * ```typescript
 * const borderRadius: MRTBorderRadiusConfig = {
 *   sm: 'calc(var(--radius) - 4px)',
 *   md: 'calc(var(--radius) - 2px)',
 *   lg: 'var(--radius)',
 * };
 * ```
 */
export interface MRTBorderRadiusConfig {
  /** Small border radius */
  sm: string;
  /** Medium border radius */
  md: string;
  /** Large border radius */
  lg: string;
}

/**
 * Font size configuration with line heights.
 * Each size includes both font size and line height for optimal readability.
 * 
 * @example
 * ```typescript
 * const fontSize: MRTFontSizeConfig = {
 *   xs: ['0.75rem', { lineHeight: '1rem' }],
 *   sm: ['0.875rem', { lineHeight: '1.25rem' }],
 * };
 * ```
 */
export interface MRTFontSizeConfig {
  /** Extra small text (12px) */
  xs: [string, { lineHeight: string }];
  /** Small text (14px) */
  sm: [string, { lineHeight: string }];
  /** Base text (16px) */
  base: [string, { lineHeight: string }];
  /** Large text (18px) */
  lg: [string, { lineHeight: string }];
  /** Extra large text (20px) */
  xl: [string, { lineHeight: string }];
  /** 2XL text (24px) */
  '2xl': [string, { lineHeight: string }];
}

/**
 * Font family configuration for typography.
 * Includes sans-serif and monospace font stacks.
 * 
 * @example
 * ```typescript
 * const fontFamily: MRTFontFamilyConfig = {
 *   sans: ['Roboto', 'Arial', 'sans-serif'],
 *   mono: ['Roboto Mono', 'Courier New', 'monospace'],
 * };
 * ```
 */
export interface MRTFontFamilyConfig {
  /** Sans-serif font stack for body text */
  sans: string[];
  /** Monospace font stack for code and data */
  mono: string[];
}

/**
 * Complete theme configuration interface for Material React Table.
 * This interface defines all customizable theme properties.
 * 
 * @example Complete Theme Configuration
 * ```typescript
 * import type { MRTThemeConfig } from 'material-react-table';
 * 
 * const theme: MRTThemeConfig = {
 *   colors: {
 *     border: '214 31% 91%',
 *     input: '214 31% 91%',
 *     ring: '221 83% 53%',
 *     background: '0 0% 100%',
 *     foreground: '222 84% 5%',
 *     primary: {
 *       DEFAULT: '221 83% 53%',
 *       foreground: '210 40% 98%',
 *     },
 *     // ... other colors
 *   },
 *   spacing: {
 *     '0': '0px',
 *     '1': '0.25rem',
 *     // ... other spacing values
 *   },
 *   borderRadius: {
 *     sm: 'calc(var(--radius) - 4px)',
 *     md: 'calc(var(--radius) - 2px)',
 *     lg: 'var(--radius)',
 *   },
 *   fontSize: {
 *     xs: ['0.75rem', { lineHeight: '1rem' }],
 *     // ... other font sizes
 *   },
 *   fontFamily: {
 *     sans: ['Roboto', 'Arial', 'sans-serif'],
 *     mono: ['Roboto Mono', 'monospace'],
 *   },
 * };
 * ```
 */
export interface MRTThemeConfig {
  /** Color palette configuration */
  colors: MRTColorPalette;
  /** Spacing scale configuration */
  spacing: MRTSpacingConfig;
  /** Border radius configuration */
  borderRadius: MRTBorderRadiusConfig;
  /** Font size configuration */
  fontSize: MRTFontSizeConfig;
  /** Font family configuration */
  fontFamily: MRTFontFamilyConfig;
}

/**
 * User-facing theme customization interface.
 * Allows partial overrides of the default theme.
 * 
 * @example Customizing Colors
 * ```typescript
 * import type { MRTCustomTheme } from 'material-react-table';
 * 
 * const customTheme: MRTCustomTheme = {
 *   extend: {
 *     colors: {
 *       primary: {
 *         DEFAULT: '221 83% 53%',
 *         foreground: '210 40% 98%',
 *       },
 *     },
 *   },
 * };
 * ```
 * 
 * @example Customizing Spacing
 * ```typescript
 * const customTheme: MRTCustomTheme = {
 *   extend: {
 *     spacing: {
 *       '4': '1.5rem', // Override default 1rem
 *     },
 *   },
 * };
 * ```
 */
export interface MRTCustomTheme {
  /** Theme extensions - partial overrides of default theme */
  extend?: {
    /** Partial color palette overrides */
    colors?: Partial<MRTColorPalette>;
    /** Partial spacing scale overrides */
    spacing?: Partial<MRTSpacingConfig>;
    /** Partial border radius overrides */
    borderRadius?: Partial<MRTBorderRadiusConfig>;
    /** Partial font size overrides */
    fontSize?: Partial<MRTFontSizeConfig>;
    /** Partial font family overrides */
    fontFamily?: Partial<MRTFontFamilyConfig>;
  };
}

/**
 * Default theme configuration for Material React Table.
 * This provides sensible defaults that match the Material Design aesthetic.
 * 
 * Users can override these values by extending the Tailwind configuration
 * or by providing CSS variables in their global styles.
 */
export const defaultMRTTheme: MRTThemeConfig = {
  colors: {
    border: '214.3 31.8% 91.4%',
    input: '214.3 31.8% 91.4%',
    ring: '221.2 83.2% 53.3%',
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    primary: {
      DEFAULT: '221.2 83.2% 53.3%',
      foreground: '210 40% 98%',
    },
    secondary: {
      DEFAULT: '210 40% 96.1%',
      foreground: '222.2 47.4% 11.2%',
    },
    destructive: {
      DEFAULT: '0 84.2% 60.2%',
      foreground: '210 40% 98%',
    },
    muted: {
      DEFAULT: '210 40% 96.1%',
      foreground: '215.4 16.3% 46.9%',
    },
    accent: {
      DEFAULT: '210 40% 96.1%',
      foreground: '222.2 47.4% 11.2%',
    },
    popover: {
      DEFAULT: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
    },
    card: {
      DEFAULT: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
    },
  },
  spacing: {
    '0': '0px',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
  },
  borderRadius: {
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
  },
  fontFamily: {
    sans: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ],
    mono: [
      '"Roboto Mono"',
      'Consolas',
      'Monaco',
      '"Courier New"',
      'monospace',
    ],
  },
};

/**
 * Utility type for extracting color values from the theme.
 * Useful for type-safe color references in components.
 */
export type MRTColorKey = keyof MRTColorPalette;

/**
 * Utility type for extracting spacing values from the theme.
 * Useful for type-safe spacing references in components.
 */
export type MRTSpacingKey = keyof MRTSpacingConfig;
