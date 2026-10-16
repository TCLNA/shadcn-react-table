# Design Document: MUI to shadcn/ui Migration

## Overview

This design outlines the systematic migration of Material React Table from Material UI V6 to shadcn/ui. The migration maintains the library's comprehensive feature set and public API while modernizing the styling approach from Emotion CSS-in-JS to Tailwind CSS utility classes.

The migration strategy follows a phased approach:
1. **Dependency Setup**: Install shadcn/ui, Tailwind, and supporting libraries
2. **Component Mapping**: Systematically replace MUI components with shadcn/ui equivalents
3. **Styling Migration**: Convert Emotion styles to Tailwind utility classes
4. **Theme System**: Build a new theme system using Tailwind configuration
5. **Testing & Validation**: Ensure feature parity and fix regressions
6. **Documentation**: Update examples and create migration guide

The design preserves TanStack Table V8 as the headless core, maintaining all table logic while only changing the presentation layer.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Public API Layer                         │
│  (useMaterialReactTable, MRT_* components, types)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Component Library Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ shadcn/ui    │  │ Custom MRT   │  │ Radix UI     │     │
│  │ Components   │  │ Components   │  │ Primitives   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Styling Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Tailwind CSS │  │ Theme Config │  │ Custom       │     │
│  │ Utilities    │  │ (colors,     │  │ Utilities    │     │
│  │              │  │  spacing)    │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  TanStack Table V8 Core                      │
│  (Headless table logic - unchanged)                         │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

The component architecture maintains the existing structure with updated implementations:

```
MRT Components (src/components/)
├── body/          → Use shadcn Table components + Tailwind
├── buttons/       → Use shadcn Button + lucide-react icons
├── footer/        → Use shadcn Table components + Tailwind
├── head/          → Use shadcn Table components + Tailwind
├── inputs/        → Use shadcn Input, Select, Checkbox
├── menus/         → Use shadcn DropdownMenu, ContextMenu
├── modals/        → Use shadcn Dialog
├── table/         → Use shadcn Table + custom Paper equivalent
└── toolbar/       → Use Tailwind flex layouts + shadcn components
```

### Styling Architecture

**Current (Emotion)**:
```typescript
const StyledComponent = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));
```

**Target (Tailwind)**:
```typescript
const Component = ({ className }) => (
  <div className={cn(
    "p-4 bg-background hover:bg-accent",
    className
  )}>
    {/* content */}
  </div>
);
```

## Components and Interfaces

### Core Component Mappings

#### 1. Table Structure Components

**MUI → shadcn/ui Mapping**:
- `Table` → `<Table>` from shadcn/ui
- `TableContainer` → `<div>` with Tailwind classes
- `TableHead` → `<TableHeader>` from shadcn/ui
- `TableBody` → `<TableBody>` from shadcn/ui
- `TableRow` → `<TableRow>` from shadcn/ui
- `TableCell` → `<TableCell>` from shadcn/ui
- `Paper` → `<div>` with `border rounded-lg shadow-sm bg-card` classes

#### 2. Input Components

**MUI → shadcn/ui Mapping**:
- `TextField` → `<Input>` from shadcn/ui
- `Select` → `<Select>` from shadcn/ui
- `Checkbox` → `<Checkbox>` from shadcn/ui
- `Switch` → `<Switch>` from shadcn/ui
- `Radio` → `<RadioGroup>` from shadcn/ui
- `Autocomplete` → `<Command>` or custom with `<Popover>` + `<Input>`

#### 3. Action Components

**MUI → shadcn/ui Mapping**:
- `Button` → `<Button>` from shadcn/ui
- `IconButton` → `<Button variant="ghost" size="icon">` from shadcn/ui
- `Tooltip` → `<Tooltip>` from shadcn/ui
- `Menu` → `<DropdownMenu>` from shadcn/ui
- `MenuItem` → `<DropdownMenuItem>` from shadcn/ui

#### 4. Feedback Components

**MUI → shadcn/ui Mapping**:
- `CircularProgress` → `<Spinner>` or custom loading component
- `LinearProgress` → `<Progress>` from shadcn/ui
- `Alert` → `<Alert>` from shadcn/ui
- `Snackbar` → `<Toast>` from shadcn/ui (via sonner)
- `Dialog` → `<Dialog>` from shadcn/ui
- `Popover` → `<Popover>` from shadcn/ui

#### 5. Layout Components

**MUI → shadcn/ui Mapping**:
- `Box` → `<div>` with Tailwind classes
- `Stack` → `<div>` with `flex flex-col gap-*` classes
- `Toolbar` → `<div>` with `flex items-center gap-*` classes
- `Divider` → `<Separator>` from shadcn/ui
- `Collapse` → `<Collapsible>` from shadcn/ui

### Icon System

**Migration Strategy**:
```typescript
// Current (MUI Icons)
import { ArrowDownward, FilterList, Search } from '@mui/icons-material';

// Target (lucide-react)
import { ArrowDown, Filter, Search } from 'lucide-react';
```

**Icon Mapping Table** (key icons):
- `ArrowDownward` → `ArrowDown`
- `ArrowUpward` → `ArrowUp`
- `FilterList` → `Filter`
- `Search` → `Search`
- `Close` → `X`
- `MoreVert` → `MoreVertical`
- `Edit` → `Pencil`
- `Delete` → `Trash2`
- `Save` → `Save`
- `Cancel` → `X`
- `Add` → `Plus`
- `Remove` → `Minus`
- `ExpandMore` → `ChevronDown`
- `ChevronRight` → `ChevronRight`
- `DragIndicator` → `GripVertical`
- `Visibility` → `Eye`
- `VisibilityOff` → `EyeOff`
- `ContentCopy` → `Copy`
- `Fullscreen` → `Maximize`
- `FullscreenExit` → `Minimize`

### Date Picker Integration

**Selected Library**: react-day-picker (compatible with shadcn/ui)

**Integration Approach**:
```typescript
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DateFilter = ({ column }) => {
  const [date, setDate] = useState<Date>();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {date ? format(date, 'PPP') : 'Pick a date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  );
};
```

### Theme System Interface

**Theme Configuration Structure**:
```typescript
// tailwind.config.ts
export interface MRTThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    card: string;
    'card-foreground': string;
    border: string;
    input: string;
    ring: string;
    // ... additional color tokens
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  fontSize: Record<string, string>;
  fontFamily: {
    sans: string[];
    mono: string[];
  };
}

// User-facing theme customization
export interface MRTCustomTheme {
  extend?: {
    colors?: Partial<MRTThemeConfig['colors']>;
    spacing?: Partial<MRTThemeConfig['spacing']>;
    // ... other customizations
  };
}
```

**Theme Application**:
```typescript
// User provides theme
const customTheme: MRTCustomTheme = {
  extend: {
    colors: {
      primary: 'hsl(221, 83%, 53%)',
      secondary: 'hsl(210, 40%, 96%)',
    },
  },
};

// Library merges with defaults and applies via Tailwind
```

### Public API Preservation

**Key Interfaces** (unchanged):
```typescript
// Main hook interface
export function useMaterialReactTable<TData extends Record<string, any>>(
  options: MRT_TableOptions<TData>
): MRT_TableInstance<TData>;

// Table component interface
export function MaterialReactTable<TData extends Record<string, any>>(
  props: MaterialReactTableProps<TData>
): JSX.Element;

// Column definition interface
export interface MRT_ColumnDef<TData extends Record<string, any>> {
  accessorKey?: string;
  header: string;
  Cell?: (props: MRT_CellProps<TData>) => ReactNode;
  // ... all existing props maintained
}

// Table options interface
export interface MRT_TableOptions<TData extends Record<string, any>> {
  columns: MRT_ColumnDef<TData>[];
  data: TData[];
  enableSorting?: boolean;
  enableFiltering?: boolean;
  // ... all existing options maintained
}
```

**Customization Props** (maintained):
```typescript
// Component override props
muiTableProps?: TableProps; // Renamed to: tableProps
muiTableHeadCellProps?: TableCellProps; // Renamed to: tableHeadCellProps
muiTableBodyCellProps?: TableCellProps; // Renamed to: tableBodyCellProps
// ... all mui* props renamed to remove "mui" prefix

// Render override props (unchanged)
renderTopToolbar?: (props: MRT_TableInstance<TData>) => ReactNode;
renderBottomToolbar?: (props: MRT_TableInstance<TData>) => ReactNode;
renderDetailPanel?: (props: MRT_RowProps<TData>) => ReactNode;
// ... all render props maintained
```

## Data Models

### Component Props Models

**Button Component Props**:
```typescript
interface MRT_ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
  children: ReactNode;
  className?: string;
  startIcon?: ReactNode; // Custom prop for icon placement
  endIcon?: ReactNode;   // Custom prop for icon placement
}
```

**Table Component Props**:
```typescript
interface MRT_TableProps {
  className?: string;
  // Inherits from shadcn/ui Table component
}

interface MRT_TableContainerProps {
  className?: string;
  maxHeight?: string | number;
  // Custom wrapper for scrolling behavior
}
```

**Input Component Props**:
```typescript
interface MRT_InputProps {
  type?: 'text' | 'number' | 'email' | 'password';
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  startAdornment?: ReactNode; // Custom prop for icons/text
  endAdornment?: ReactNode;   // Custom prop for icons/text
}
```

### Theme Data Model

**Tailwind Theme Extension**:
```typescript
interface TailwindTheme {
  extend: {
    colors: {
      border: string;
      input: string;
      ring: string;
      background: string;
      foreground: string;
      primary: {
        DEFAULT: string;
        foreground: string;
      };
      secondary: {
        DEFAULT: string;
        foreground: string;
      };
      destructive: {
        DEFAULT: string;
        foreground: string;
      };
      muted: {
        DEFAULT: string;
        foreground: string;
      };
      accent: {
        DEFAULT: string;
        foreground: string;
      };
      popover: {
        DEFAULT: string;
        foreground: string;
      };
      card: {
        DEFAULT: string;
        foreground: string;
      };
    };
    borderRadius: {
      lg: string;
      md: string;
      sm: string;
    };
  };
  darkMode: ['class'];
}
```

### Localization Data Model

**Locale Structure** (unchanged):
```typescript
interface MRT_Localization {
  actions: string;
  cancel: string;
  clearFilter: string;
  clearSearch: string;
  clearSort: string;
  columnActions: string;
  // ... 50+ translation keys
}

// Example locale file (unchanged structure)
export const MRT_Localization_EN: MRT_Localization = {
  actions: 'Actions',
  cancel: 'Cancel',
  // ... translations
};
```

### Build Configuration Model

**Package.json Dependencies**:
```json
{
  "dependencies": {
    "@tanstack/react-table": "^8.20.6",
    "@tanstack/react-virtual": "^3.11.2",
    "lucide-react": "^0.index",
    "react-day-picker": "^8.10.0",
    "date-fns": "^3.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.7.2",
    "rollup": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

**Rollup Configuration Updates**:
```typescript
// rollup.config.mjs additions
import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  // ... existing config
  plugins: [
    // ... existing plugins
    postcss({
      config: {
        path: './postcss.config.js',
      },
      extensions: ['.css'],
      minimize: true,
      inject: {
        insertAt: 'top',
      },
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    }),
  ],
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

For this migration, correctness properties focus on verifying that the migration is complete (no MUI dependencies remain), the public API is preserved (backward compatibility), and the build system produces valid outputs. These properties can be tested through static analysis of source code, type checking, and build verification.

### Property 1: Complete MUI Dependency Removal

*For any* source file in the Component_Library (src/**/*.ts, src/**/*.tsx), that file should contain zero import statements from @mui/material, @mui/icons-material, @mui/x-date-pickers, @emotion/react, or @emotion/styled.

**Validates: Requirements 1.1, 1.2, 1.3, 2.1, 2.2**

### Property 2: Example Suite MUI Removal

*For any* example file in the Example_Suite (examples/**/*.tsx, example-groups/**/*.tsx), that file should contain zero import statements from @mui/material, @mui/icons-material, or @emotion packages.

**Validates: Requirements 8.1**

### Property 3: Documentation Site MUI Removal

*For any* source file in the Documentation_Site (apps/material-react-table-docs/**/*.tsx, apps/material-react-table-docs/**/*.ts), that file should contain zero import statements from @mui/material, @mui/icons-material, or @emotion packages.

**Validates: Requirements 9.1**

### Property 4: Component Naming Convention Preservation

*For any* exported component from the Component_Library index.ts, if that export is a React component (not a hook, type, or utility), then its name should start with the prefix "MRT_".

**Validates: Requirements 1.8**

### Property 5: Public API Export Preservation

*For any* symbol (function, type, interface, component) that was exported from the Component_Library index.ts before migration, that same symbol should be exported after migration with the same name and type signature.

**Validates: Requirements 4.1**

### Property 6: Localization File Structure Preservation

*For any* locale file in the locales directory, that file should export an object with the same keys as the MRT_Localization interface, ensuring all 40+ language files maintain consistent structure.

**Validates: Requirements 6.1**

### Property 7: Example File Organization Preservation

*For any* example file that existed before migration, an example file with the same relative path and filename should exist after migration in the examples directory.

**Validates: Requirements 8.4**

### Property 8: Documentation Page Preservation

*For any* documentation page that existed before migration in the pages directory, a page file with the same relative path should exist after migration.

**Validates: Requirements 9.4**

### Property 9: Documentation URL Structure Preservation

*For any* route that was accessible before migration (extracted from pages directory structure), that same route should be accessible after migration with the same URL path.

**Validates: Requirements 9.6**

### Property 10: Dependency Configuration Correctness

*For the* package.json file in the Component_Library, it should contain zero dependencies or peerDependencies from @mui/* or @emotion/* packages, and should contain lucide-react and required shadcn/ui dependencies.

**Validates: Requirements 7.1, 7.2, 12.1-12.9**

### Property 11: Bundle Size Compliance

*For any* production build of the Component_Library, the CJS bundle size should be ≤ 55KB gzipped and the ESM bundle size should be ≤ 51KB gzipped.

**Validates: Requirements 7.5, 11.7**

### Property 12: JSDoc Documentation Completeness

*For any* exported function, hook, or component from the Component_Library index.ts, that export should have a JSDoc comment describing its purpose and parameters.

**Validates: Requirements 10.7**

### Property 13: Storybook Story Preservation

*For any* component file (MRT_*.tsx) in the Component_Library, a corresponding Storybook story file (*.stories.tsx) should exist in the stories directory.

**Validates: Requirements 11.1**

## Error Handling

### Migration Error Scenarios

**1. Missing shadcn/ui Component Equivalent**

When a MUI component has no direct shadcn/ui equivalent:
- **Detection**: During component mapping phase, identify MUI components without matches
- **Handling**: Create custom component using Radix UI primitives + Tailwind
- **Example**: MUI's `Autocomplete` → Custom component with `Popover` + `Command` + `Input`
- **Fallback**: Document as known limitation if custom implementation is not feasible

**2. Incompatible Prop Interface**

When shadcn/ui component props don't match MUI props:
- **Detection**: TypeScript compilation errors when replacing components
- **Handling**: Create adapter layer that maps MUI prop names to shadcn/ui equivalents
- **Example**: MUI `variant="contained"` → shadcn `variant="default"`
- **Preservation**: Maintain MUI prop names in public API, translate internally

**3. Styling Conversion Complexity**

When Emotion styles are too complex for direct Tailwind conversion:
- **Detection**: Dynamic styles with complex calculations or theme dependencies
- **Handling**: Use `cn()` utility with conditional classes or CSS variables
- **Example**: Complex hover states → Multiple Tailwind classes with group modifiers
- **Fallback**: Use inline styles for truly dynamic values (rare cases)

**4. Theme Customization Incompatibility**

When user's MUI theme customization can't map to Tailwind:
- **Detection**: User provides MUI theme object that references MUI-specific features
- **Handling**: Provide migration helper that converts common MUI theme patterns
- **Documentation**: Document unsupported theme features in migration guide
- **Workaround**: Provide Tailwind config examples for common customizations

**5. Icon Mapping Gaps**

When MUI icon has no semantic lucide-react equivalent:
- **Detection**: During icon mapping phase, identify unmapped icons
- **Handling**: Choose closest semantic match and document in migration guide
- **Example**: MUI `DragIndicator` → lucide `GripVertical`
- **Override**: Allow users to provide custom icon components

**6. Date Picker Feature Gaps**

When react-day-picker doesn't support MUI date picker features:
- **Detection**: Feature comparison during integration
- **Handling**: Implement missing features using react-day-picker's customization
- **Example**: Date range presets → Custom preset buttons above calendar
- **Fallback**: Document feature differences in migration guide

**7. Build Configuration Errors**

When Rollup fails to bundle Tailwind styles correctly:
- **Detection**: Build errors or missing styles in output
- **Handling**: Adjust PostCSS configuration and Rollup plugin order
- **Validation**: Verify styles are included in bundle via size check
- **Testing**: Test bundle in isolated environment

**8. TypeScript Type Errors**

When shadcn/ui component types conflict with existing code:
- **Detection**: TypeScript compilation errors
- **Handling**: Create type adapters or use type assertions where safe
- **Example**: Generic type parameter mismatches → Add type constraints
- **Validation**: Ensure strict mode still passes

**9. SSR Hydration Errors**

When shadcn/ui components cause hydration mismatches:
- **Detection**: Console warnings in Next.js development
- **Handling**: Wrap client-only components with dynamic imports
- **Example**: Components using `window` → `dynamic(() => import(...), { ssr: false })`
- **Testing**: Test in Next.js app with SSR enabled

**10. Bundle Size Exceeds Limits**

When migrated bundle exceeds size limits:
- **Detection**: size-limit check fails during build
- **Handling**: Analyze bundle, identify large dependencies, optimize imports
- **Example**: Tree-shake unused lucide icons, lazy load heavy components
- **Fallback**: Adjust size limits if increase is justified

### Error Recovery Strategies

**Rollback Strategy**:
- Maintain git branches for each migration phase
- Tag stable points for easy rollback
- Keep MUI version in separate branch until migration validated

**Incremental Migration**:
- Migrate components in isolated groups (body, head, toolbar, etc.)
- Test each group before proceeding
- Maintain working build at each step

**Validation Checkpoints**:
- After each component group: Run Storybook, verify visual appearance
- After styling migration: Run visual regression tests
- After API changes: Run type checking and example builds
- Before release: Full integration test suite

## Testing Strategy

### Dual Testing Approach

The migration requires both **unit tests** and **property-based tests** to ensure correctness:

**Unit Tests** focus on:
- Specific component replacements work correctly
- Edge cases in component prop mapping
- Error conditions in migration helpers
- Integration between migrated components
- Visual regression for key components

**Property Tests** focus on:
- Universal properties across all source files (no MUI imports)
- API preservation across all exports
- File structure preservation across all examples/docs
- Bundle size compliance across all builds
- Naming conventions across all components

### Property-Based Testing Configuration

**Library**: fast-check (JavaScript/TypeScript property-based testing)

**Configuration**:
- Minimum 100 iterations per property test
- Each test references its design document property
- Tag format: `Feature: mui-to-shadcn-migration, Property {number}: {property_text}`

**Example Property Test**:
```typescript
import fc from 'fast-check';
import { describe, it } from 'vitest';
import { getAllSourceFiles, parseImports } from './test-utils';

describe('Feature: mui-to-shadcn-migration, Property 1: Complete MUI Dependency Removal', () => {
  it('should have zero MUI imports in any source file', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...getAllSourceFiles('src')),
        (filePath) => {
          const imports = parseImports(filePath);
          const muiImports = imports.filter(imp =>
            imp.startsWith('@mui/') || imp.startsWith('@emotion/')
          );
          return muiImports.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing Strategy

**Component Replacement Tests**:
```typescript
describe('MRT_Button component', () => {
  it('should render with default variant', () => {
    render(<MRT_Button>Click me</MRT_Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle icon placement with startIcon prop', () => {
    render(<MRT_Button startIcon={<Search />}>Search</MRT_Button>);
    // Verify icon appears before text
  });

  it('should apply custom className', () => {
    render(<MRT_Button className="custom-class">Click</MRT_Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
```

**API Preservation Tests**:
```typescript
describe('Public API preservation', () => {
  it('should export useMaterialReactTable hook', () => {
    expect(typeof useMaterialReactTable).toBe('function');
  });

  it('should export MaterialReactTable component', () => {
    expect(typeof MaterialReactTable).toBe('function');
  });

  it('should maintain backward compatible prop names', () => {
    const table = useMaterialReactTable({
      columns: [],
      data: [],
      muiTableProps: { className: 'test' }, // Old prop name
    });
    // Verify prop is accepted and applied
  });
});
```

**Build Verification Tests**:
```typescript
describe('Build system', () => {
  it('should produce CJS bundle', () => {
    expect(fs.existsSync('dist/index.cjs')).toBe(true);
  });

  it('should produce ESM bundle', () => {
    expect(fs.existsSync('dist/index.mjs')).toBe(true);
  });

  it('should generate TypeScript declarations', () => {
    expect(fs.existsSync('dist/index.d.ts')).toBe(true);
  });

  it('should build locale files separately', () => {
    expect(fs.existsSync('locales/en.js')).toBe(true);
  });
});
```

**Visual Regression Tests** (using Storybook + Chromatic or similar):
- Capture screenshots of all Storybook stories before migration
- After migration, compare screenshots to detect visual changes
- Flag any differences for manual review
- Accept intentional design changes, reject regressions

### Integration Testing Strategy

**Feature Parity Tests**:
For each of the 40+ features, create integration tests that:
1. Set up a table with the feature enabled
2. Interact with the feature (sort, filter, edit, etc.)
3. Verify the expected behavior occurs
4. Compare behavior to pre-migration baseline

**Example Integration Test**:
```typescript
describe('Sorting feature', () => {
  it('should sort column when header is clicked', async () => {
    const { container } = render(
      <MaterialReactTable
        columns={[{ accessorKey: 'name', header: 'Name' }]}
        data={[{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]}
        enableSorting
      />
    );

    const header = screen.getByText('Name');
    await userEvent.click(header);

    const cells = container.querySelectorAll('tbody td');
    expect(cells[0]).toHaveTextContent('Alice');
    expect(cells[1]).toHaveTextContent('Bob');
    expect(cells[2]).toHaveTextContent('Charlie');
  });
});
```

### Testing Checklist

**Pre-Migration Baseline**:
- [ ] Capture all Storybook screenshots
- [ ] Document current bundle sizes
- [ ] Export list of all public API symbols
- [ ] Record all example file paths
- [ ] Record all documentation page URLs

**During Migration**:
- [ ] Run property tests after each component group migration
- [ ] Run unit tests for each replaced component
- [ ] Verify Storybook stories still render
- [ ] Check TypeScript compilation passes
- [ ] Verify bundle builds successfully

**Post-Migration Validation**:
- [ ] All property tests pass (100 iterations each)
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Visual regression tests reviewed and approved
- [ ] Bundle size within limits
- [ ] Documentation site builds and deploys
- [ ] All examples run without errors
- [ ] TypeScript strict mode passes
- [ ] Linting and formatting pass
- [ ] SSR test app works without hydration errors

### Continuous Validation

**CI/CD Pipeline**:
1. **Lint & Format**: ESLint + Prettier checks
2. **Type Check**: TypeScript compilation in strict mode
3. **Property Tests**: Run all property-based tests (100 iterations)
4. **Unit Tests**: Run all unit tests with coverage
5. **Build**: Build library, examples, and docs
6. **Bundle Size**: Verify size limits with size-limit
7. **Visual Regression**: Compare Storybook screenshots (on main branch)
8. **Integration Tests**: Run feature parity tests

**Quality Gates**:
- All tests must pass
- Bundle size must be within limits
- TypeScript must compile without errors
- Code coverage must meet threshold (e.g., 80%)
- No visual regressions without approval

