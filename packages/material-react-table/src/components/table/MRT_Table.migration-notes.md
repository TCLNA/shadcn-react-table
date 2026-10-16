# MRT_Table Component Migration Notes

## Task: 4.3 Migrate MRT_Table component

### Requirements Validated
- **Requirement 1.7**: Component Library SHALL use shadcn/ui components for all UI elements
- **Requirement 14.1**: Component Library SHALL replace MUI Table with shadcn/ui Table

### Changes Made

#### 1. Import Changes
**Before:**
```typescript
import Table, { type TableProps } from '@mui/material/Table';
```

**After:**
```typescript
// Using native <table> element instead of shadcn/ui Table wrapper
// because MRT_TableContainer already handles the scrolling wrapper
import { cn } from '../../lib/utils';
```

#### 2. Props Interface Update
**Before:**
```typescript
export interface MRT_TableProps<TData extends MRT_RowData> extends TableProps {
  table: MRT_TableInstance<TData>;
}
```

**After:**
```typescript
export interface MRT_TableProps<TData extends MRT_RowData>
  extends React.HTMLAttributes<HTMLTableElement> {
  table: MRT_TableInstance<TData>;
}
```

#### 3. Component Implementation

**Key Changes:**
- Replaced MUI `<Table>` component with native `<table>` element
- Converted MUI's `sx` prop styling to Tailwind CSS utility classes
- Replaced `stickyHeader` prop with Tailwind classes: `[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10`
- Converted `borderCollapse: 'separate'` to `border-separate border-spacing-0`
- Converted `display: 'grid'` to `grid` class
- Converted `position: 'relative'` to `relative` class
- Used `cn()` utility for conditional class merging
- Styled caption with Tailwind classes: `mt-4 text-sm text-muted-foreground`

**Styling Mapping:**

| MUI Styling | Tailwind Classes |
|-------------|------------------|
| `stickyHeader={true}` | `[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10` |
| `sx={{ borderCollapse: 'separate' }}` | `border-separate border-spacing-0` |
| `sx={{ display: 'grid' }}` | `grid` |
| `sx={{ position: 'relative' }}` | `relative` |
| Default table width | `w-full` |
| Caption positioning | `caption-bottom` |
| Text size | `text-sm` |

### Preserved Functionality

1. **Column Sizing**: CSS variables for column sizes are still set via inline styles
2. **Layout Modes**: Grid layout mode is still supported via conditional class
3. **Sticky Header**: Works in both `enableStickyHeader` and `isFullScreen` modes
4. **Memoization**: Table body memoization logic unchanged
5. **Caption Rendering**: Custom caption rendering still supported
6. **Props Merging**: `muiTableProps` still merged with component props (backward compatibility)
7. **Custom Styling**: Custom `className` and `style` props still supported

### Design Decision: Native Table vs shadcn/ui Table

The shadcn/ui `Table` component includes a wrapper `<div>` with `overflow-auto`:

```typescript
const Table = ({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
```

However, MRT already has `MRT_TableContainer` which handles the scrolling wrapper. To avoid double-wrapping and maintain the existing architecture, we use a native `<table>` element directly with Tailwind classes, rather than the shadcn/ui `Table` component.

This approach:
- Avoids nested scroll containers
- Maintains existing container/table separation
- Keeps the component hierarchy clean
- Preserves all existing functionality

### Testing

A comprehensive unit test suite was created in `MRT_Table.test.tsx` covering:
- Native table element rendering
- Tailwind class application
- Sticky header functionality
- Layout mode handling
- Column size CSS variables
- Conditional rendering (head, body, footer)
- Memoization behavior
- Caption rendering
- Custom props (className, style)
- Props merging (muiTableProps)

### Backward Compatibility

- The `muiTableProps` option is still supported for backward compatibility
- All existing table options continue to work
- Component props interface extends standard HTML table attributes
- Custom className and style props are properly merged

### Next Steps

The following related components still need migration:
- Task 4.4: MRT_TableHead and MRT_TableBody components
- Task 4.5: MRT_TableRow component

These components will need similar migrations from MUI TableHead/TableBody/TableRow to shadcn/ui equivalents or native elements with Tailwind styling.
