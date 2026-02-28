import { readFileSync } from 'fs';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default [
  {
    external: [
      '@mui/icons-material',
      '@mui/material',
      '@mui/x-date-pickers',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-collapsible',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tooltip',
      '@tanstack/match-sorter-utils',
      '@tanstack/react-table',
      '@tanstack/react-virtual',
      'class-variance-authority',
      'clsx',
      'cmdk',
      'date-fns',
      'highlight-words',
      'lucide-react',
      'react',
      'react-day-picker',
      'tailwind-merge',
    ],
    input: './src/index.ts',
    output: [
      {
        file: `./${pkg.main}`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `./${pkg.module}`,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      external(),
      postcss({
        config: {
          path: './postcss.config.js',
        },
        extensions: ['.css'],
        minimize: true,
        inject: {
          insertAt: 'top',
        },
      }),
      typescript({
        rootDir: './src',
        exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      }),
    ],
  },
  {
    input: './dist/types/index.d.ts',
    output: [{ file: `./${pkg.typings}`, format: 'esm' }],
    plugins: [
      del({
        hook: 'buildEnd',
        targets: ['dist/types'],
      }),
      dts(),
    ],
  },
];
