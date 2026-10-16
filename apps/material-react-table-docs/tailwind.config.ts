import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import baseConfig from '../../packages/material-react-table/tailwind.config';

const config: Config = {
  ...baseConfig,
  corePlugins: {
    preflight: false,
  },
  content: [
    './pages/**/*.{ts,tsx,md,mdx}',
    './components/**/*.{ts,tsx}',
    './examples/**/*.{ts,tsx}',
    '../../packages/material-react-table/src/**/*.{ts,tsx}',
  ],
  plugins: [...(baseConfig.plugins || []), animate],
};

export default config;
