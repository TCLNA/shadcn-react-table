# Project Structure

## Monorepo Layout

```
material-react-table/
├── packages/
│   └── material-react-table/     # Core library package
└── apps/
    └── material-react-table-docs/ # Documentation website
```

## Library Package Structure (`packages/material-react-table/`)

### Source Code (`src/`)

```
src/
├── components/          # React components (organized by category)
│   ├── body/           # Table body components (cells, rows, detail panels)
│   ├── buttons/        # Action buttons (expand, copy, toggle, etc.)
│   ├── footer/         # Table footer components
│   ├── head/           # Table header components (cells, filters, sorting)
│   ├── inputs/         # Form inputs (filters, edit fields, checkboxes)
│   ├── menus/          # Dropdown menus (column actions, row actions)
│   ├── modals/         # Modal dialogs (edit row modal)
│   ├── table/          # Core table components (container, paper, loading)
│   └── toolbar/        # Toolbar components (top/bottom, pagination, alerts)
├── fns/                # Pure functions
│   ├── aggregationFns  # Data aggregation functions
│   ├── filterFns       # Custom filter functions
│   └── sortingFns      # Custom sorting functions
├── hooks/              # React hooks
│   ├── useMaterialReactTable  # Main hook for table instance
│   ├── useMRT_*               # Internal hooks for specific features
│   └── ...
├── utils/              # Utility functions
│   ├── tanstack.helpers # TanStack Table helpers
│   ├── cell.utils       # Cell-related utilities
│   ├── column.utils     # Column-related utilities
│   ├── row.utils        # Row-related utilities
│   └── displayColumn.utils # Display column utilities
├── locales/            # Internationalization files (40+ languages)
├── styles/             # Styling utilities and theme helpers
├── lib/                # Additional library code
├── types.ts            # TypeScript type definitions
├── icons.ts            # Icon exports and mappings
└── index.ts            # Main entry point (exports all public APIs)
```

### Other Key Files

- `stories/` - Storybook stories for local development and testing
- `rollup.config.mjs` - Rollup bundler configuration
- `build-locales.mjs` - Script to build locale files
- `.storybook/` - Storybook configuration

## Documentation Site Structure (`apps/material-react-table-docs/`)

```
apps/material-react-table-docs/
├── components/
│   ├── mdx/            # MDX components for docs (code snippets, cards, etc.)
│   ├── navigation/     # Navigation components (sidebar, topbar, breadcrumbs)
│   └── prop-tables/    # API documentation tables
├── examples/           # Live example components (100+ examples)
│   ├── basic/
│   ├── advanced/
│   ├── editing-crud-*/
│   ├── localization-i18n-*/
│   └── .../
├── example-groups/     # Grouped example switchers
├── pages/              # Next.js pages (MDX and TSX)
│   ├── docs/           # Documentation pages
│   ├── api/            # API reference pages
│   ├── blog/           # Blog posts
│   └── index.tsx       # Homepage
├── public/             # Static assets
└── styles/             # Global styles and MUI theme
```

## Component Naming Convention

All library components follow the `MRT_` prefix pattern:
- `MRT_TableBody` - Main table body
- `MRT_TableHeadCell` - Header cell component
- `MRT_EditActionButtons` - Edit action buttons
- `useMRT_TableOptions` - Hook for table options

## Export Strategy

- `index.ts` exports all public APIs (components, hooks, types, utilities)
- Components are organized in subdirectories but exported flat
- All exports are named exports (no default exports)
- Types are co-located with implementation or in `types.ts`

## Key Architectural Patterns

1. **Composition**: Small, focused components composed into larger features
2. **Hooks-based**: Logic extracted into custom hooks for reusability
3. **Type-safe**: Extensive TypeScript generics for type inference
4. **Headless Core**: Built on TanStack Table's headless architecture
5. **Opt-in Features**: All features disabled by default, enabled via props
6. **Customization**: Multiple customization points (props, slots, styling)

## File Naming Conventions

- Components: PascalCase with `MRT_` prefix (e.g., `MRT_TableBody.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useMaterialReactTable.ts`)
- Utils: camelCase with `.utils` suffix (e.g., `cell.utils.ts`)
- Types: PascalCase for interfaces/types (e.g., `MRT_TableInstance`)
- Stories: Component name + `.stories.tsx`
