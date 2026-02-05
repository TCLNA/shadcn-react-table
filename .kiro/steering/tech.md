# Technology Stack

## Build System

- **Monorepo**: TurboRepo with pnpm workspaces
- **Package Manager**: pnpm v9.3.0
- **Node Version**: >=16.0.0
- **Bundler**: Rollup (for library), Vite (for Storybook), Next.js (for docs)

## Core Technologies

### Library Package (`packages/material-react-table`)
- **React**: 18+ (peer dependency)
- **TypeScript**: 5.7.2 with strict mode enabled
- **Material UI**: V6 (peer dependency)
  - @mui/material
  - @mui/icons-material
  - @mui/x-date-pickers
- **Emotion**: V11 for styling (peer dependency)
- **TanStack Table**: V8.20.6 (internal dependency)
- **TanStack Virtual**: V3.11.2 for virtualization
- **Base UI**: V1.0.0 for headless components

### Documentation Site (`apps/material-react-table-docs`)
- **Framework**: Next.js with MDX support
- **Styling**: Material UI V6 + custom theme

## Code Quality Tools

- **Linting**: ESLint with TypeScript parser
- **Formatting**: Prettier
  - Print width: 80
  - Single quotes
  - Semicolons required
  - Trailing commas: all
- **Type Checking**: TypeScript strict mode
- **Bundle Size**: size-limit (55KB limit for CJS, 51KB for ESM)

## Common Commands

### Development
```bash
# Run library storybook for development
pnpm storybook

# Run docs site locally
pnpm docs:dev

# Run both in parallel
pnpm dev
```

### Building
```bash
# Build library only
pnpm lib:build

# Build library components
pnpm lib:build-lib

# Build locale files
pnpm lib:build-locales

# Build everything (library + docs)
pnpm build

# Build docs site
pnpm docs:build
```

### Testing & Quality
```bash
# Run linting
pnpm lint

# Format code
pnpm format

# Check bundle size
pnpm size
```

### Storybook
```bash
# Run storybook dev server (port 6006)
pnpm storybook

# Build storybook static site
pnpm storybook:build
```

## TypeScript Configuration

- **Target**: ES6
- **Module**: ESNext with Node resolution
- **JSX**: react-jsx
- **Strict Mode**: Enabled
- **Source Maps**: Enabled
- **Declaration Files**: Generated in types directory
- **Unused Variables/Parameters**: Error on unused

## Build Outputs

- **Library**: `dist/` (CJS and ESM)
- **Locales**: `locales/` (separate locale files)
- **Types**: Included in dist with .d.ts files
- **Docs**: `.next/` for Next.js build
- **Storybook**: `storybook-static/`
