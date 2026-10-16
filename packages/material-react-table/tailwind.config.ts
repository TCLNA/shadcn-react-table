/**
 * Tailwind CSS Configuration for Material React Table
 * 
 * This configuration provides the default theme for Material React Table,
 * including colors, spacing, typography, and other design tokens.
 * 
 * ## Customization
 * 
 * Users can customize the theme by:
 * 
 * 1. **Extending this configuration** in their own tailwind.config.ts:
 * ```typescript
 * import type { Config } from 'tailwindcss';
 * 
 * const config: Config = {
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
 * 2. **Overriding CSS variables** in their global CSS:
 * ```css
 * :root {
 *   --primary: 221 83% 53%;
 *   --primary-foreground: 210 40% 98%;
 *   --radius: 0.5rem;
 * }
 * ```
 * 
 * 3. **Using dark mode** by adding the `dark` class to a parent element:
 * ```tsx
 * <div className="dark">
 *   <MaterialReactTable {...props} />
 * </div>
 * ```
 * 
 * ## Color System
 * 
 * Colors are defined using CSS variables with HSL values for better dark mode support.
 * Each color is referenced via `hsl(var(--color-name))` to allow runtime customization.
 * 
 * ### Semantic Colors:
 * - **border**: Border colors for table cells, inputs, and containers
 * - **input**: Background color for input fields
 * - **ring**: Focus ring color for keyboard navigation
 * - **background**: Main background color
 * - **foreground**: Main text color
 * - **primary**: Primary action color (buttons, links)
 * - **secondary**: Secondary UI elements
 * - **destructive**: Destructive actions (delete, error states)
 * - **muted**: Muted/disabled elements
 * - **accent**: Accent color for highlights and hover states
 * - **popover**: Popover and dropdown backgrounds
 * - **card**: Card and paper backgrounds
 * 
 * ## Spacing System
 * 
 * Spacing follows a consistent scale based on rem units:
 * - 0: 0px
 * - 1: 0.25rem (4px)
 * - 2: 0.5rem (8px)
 * - 3: 0.75rem (12px)
 * - 4: 1rem (16px)
 * - 5: 1.25rem (20px)
 * - 6: 1.5rem (24px)
 * - 8: 2rem (32px)
 * - 10: 2.5rem (40px)
 * - 12: 3rem (48px)
 * - 16: 4rem (64px)
 * 
 * ## Typography
 * 
 * Font sizes include line heights for optimal readability:
 * - xs: 0.75rem / 1rem (12px / 16px)
 * - sm: 0.875rem / 1.25rem (14px / 20px)
 * - base: 1rem / 1.5rem (16px / 24px)
 * - lg: 1.125rem / 1.75rem (18px / 28px)
 * - xl: 1.25rem / 1.75rem (20px / 28px)
 * - 2xl: 1.5rem / 2rem (24px / 32px)
 * 
 * Font families:
 * - sans: Roboto and system font stack
 * - mono: Roboto Mono and monospace stack
 * 
 * ## Border Radius
 * 
 * Border radius values are calculated from the `--radius` CSS variable:
 * - sm: calc(var(--radius) - 4px)
 * - md: calc(var(--radius) - 2px)
 * - lg: var(--radius)
 * 
 * Default --radius: 0.5rem (8px)
 * 
 * ## Dark Mode
 * 
 * Dark mode is enabled via the `class` strategy. Add the `dark` class to any
 * parent element to enable dark mode for all child components.
 * 
 * CSS variables are automatically switched when the `dark` class is present.
 * See src/styles/globals.css for dark mode color definitions.
 * 
 * ## Animations
 * 
 * Custom animations for table interactions:
 * - collapsible-down/up: For expanding/collapsing detail panels
 * - progress-indeterminate: For loading indicators
 * 
 * @see {@link https://tailwindcss.com/docs/configuration} for Tailwind configuration docs
 * @see {@link ./src/theme.ts} for TypeScript theme interfaces
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  // Enable dark mode via class strategy
  darkMode: 'class',
  
  // Content paths for Tailwind to scan for class names
  content: [
    './src/**/*.{ts,tsx}',
    './stories/**/*.{ts,tsx}',
  ],
  
  theme: {
    extend: {
      // Color palette using CSS variables for runtime customization
      // Colors use HSL format: hsl(hue saturation% lightness%)
      colors: {
        // Border colors for table cells, inputs, and dividers
        border: 'hsl(var(--border))',
        
        // Input field background color
        input: 'hsl(var(--input))',
        
        // Focus ring color for keyboard navigation
        ring: 'hsl(var(--ring))',
        
        // Main background color for the table
        background: 'hsl(var(--background))',
        
        // Main text/foreground color
        foreground: 'hsl(var(--foreground))',
        
        // Primary brand color (buttons, links, active states)
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        
        // Secondary UI elements (toolbar, pagination)
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        
        // Destructive actions (delete buttons, error states)
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        
        // Muted/disabled elements
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        
        // Accent color for highlights and hover states
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        
        // Popover and dropdown backgrounds
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        
        // Card and paper backgrounds (table container)
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      
      // Border radius scale based on --radius CSS variable
      // Default --radius is 0.5rem (8px)
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      // Spacing scale for consistent padding, margin, and gaps
      // Uses rem units for scalability with font size
      spacing: {
        '0': '0px',
        '1': '0.25rem',  // 4px
        '2': '0.5rem',   // 8px
        '3': '0.75rem',  // 12px
        '4': '1rem',     // 16px
        '5': '1.25rem',  // 20px
        '6': '1.5rem',   // 24px
        '8': '2rem',     // 32px
        '10': '2.5rem',  // 40px
        '12': '3rem',    // 48px
        '16': '4rem',    // 64px
      },
      
      // Font size scale with line heights for optimal readability
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px / 16px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px / 20px
        base: ['1rem', { lineHeight: '1.5rem' }],     // 16px / 24px
        lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px / 28px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px / 28px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px / 32px
      },
      
      // Font family stacks for typography
      fontFamily: {
        // Sans-serif stack for body text (matches Material Design)
        sans: [
          'Roboto',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        // Monospace stack for code and data
        mono: [
          '"Roboto Mono"',
          'Consolas',
          'Monaco',
          '"Courier New"',
          'monospace',
        ],
      },
      
      // Custom keyframe animations for table interactions
      keyframes: {
        // Collapsible panel expansion animation
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        // Collapsible panel collapse animation
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        // Indeterminate progress bar animation
        'progress-indeterminate': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
      
      // Animation utilities
      animation: {
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        'progress-indeterminate': 'progress-indeterminate 1.5s ease-in-out infinite',
      },
    },
  },
  
  // Tailwind plugins (none currently, but can be extended)
  plugins: [],
};

export default config;
