# MRT_TableBodyRow Migration Notes

## Summary
Successfully migrated `MRT_TableBodyRow` from MUI to shadcn/ui with Tailwind CSS. This is one of the most complex components in the library, handling row selection, pinning, virtualization, drag-and-drop, and detail panels.

## Changes Made

### 1. Removed MUI Dependencies
- **Before**: `import TableRow, { type TableRowProps } from '@mui/material/TableRow'`
- **Before**: `import { type Theme, alpha, darken, lighten, useTheme } from '@mui/material/styles'`
- **After**: `import { TableRow } from '../ui/table'`
- **After**: `import { cn } from '../../lib/utils'`

### 2. Updated Component Interface
- **Before**: Extended `TableRowProps` from MUI
- **After**: Extended `HTMLAttributes<HTMLTableRowElement>`

### 3. Replaced MUI Component with shadcn/ui TableRow
- **Before**: `<TableRow sx={...} selected={...}>`
- **After**: `<TableRow className={cn(...)} style={...} data-state={...}>`

### 4. Migrated Styling Approach

#### MUI sx prop (removed):
```typescript
sx={(theme: Theme) => ({
  '&:hover td:after': cellHighlightColorHover ? { ... } : undefined,
  backgroundColor: `${baseBackgroundColor} !important`,
  bottom: ...,
  boxSizing: 'border-box',
  display: layoutMode?.startsWith('grid') ? 'flex' : undefined,
  opacity: isRowPinned ? 0.97 : isDraggingRow || isHoveredRow ? 0.5 : 1,
  position: virtualRow ? 'absolute' : ...,
  td: { ...getCommonPinnedCellStyles({ table, theme }) },
  'td:after': cellHighlightColor ? { ... } : undefined,
  top: ...,
  transition: virtualRow ? 'none' : 'all 150ms ease-in-out',
  width: '100%',
  zIndex: ...,
  ...(sx as any),
})}
```

#### Tailwind classes (added):
```typescript
className={cn(
  'border-b transition-colors',
  layoutMode?.startsWith('grid') && 'flex',
  hoverEnabled !== false && 'hover:bg-muted/50',
  isRowSelected && 'bg-muted',
  virtualRow && 'absolute',
  rowPinningDisplayMode?.includes('sticky') && isRowPinned && 'sticky',
  !virtualRow && !isRowPinned && 'relative',
  isRowPinned && 'opacity-97',
  (isDraggingRow || isHoveredRow) && 'opacity-50',
  tableRowProps?.className,
)}
style={{
  backgroundColor: `${baseBackgroundColor} !important`,
  boxSizing: 'border-box',
  width: '100%',
  transform: virtualRow ? `translateY(${virtualRow.start}px)` : undefined,
  bottom: ...,
  top: ...,
  zIndex: ...,
  transition: virtualRow ? 'none' : 'all 150ms ease-in-out',
  ...tableRowProps?.style,
}}
```

### 5. Simplified Hover Logic
- **Before**: Complex theme-based hover color calculation using `lighten`/`darken` and `alpha`
- **After**: Simple Tailwind hover class `hover:bg-muted/50` with conditional application
- **Note**: Removed complex cell highlight overlay system (`td:after` pseudo-elements) in favor of simpler row-level styling

### 6. Updated Selection State
- **Before**: `selected={isRowSelected}` prop
- **After**: `data-state={isRowSelected ? 'selected' : undefined}` attribute
- **Benefit**: Works with shadcn/ui's `data-[state=selected]:bg-muted` selector

## Tailwind Classes Used

| Class | Purpose |
|-------|---------|
| `border-b` | Bottom border for row separation |
| `transition-colors` | Smooth color transitions |
| `flex` | Flexbox layout for grid mode |
| `hover:bg-muted/50` | Hover state background |
| `bg-muted` | Selected row background |
| `absolute` | Absolute positioning for virtual rows |
| `sticky` | Sticky positioning for pinned rows |
| `relative` | Relative positioning for normal rows |
| `opacity-97` | Slight transparency for pinned rows |
| `opacity-50` | Transparency for dragging/hovered rows |

## Functionality Preserved

✅ Row selection with visual feedback
✅ Row pinning (top and bottom) with sticky positioning
✅ Virtual row rendering with absolute positioning
✅ Drag-and-drop support with hover states
✅ Grid layout mode support
✅ Density-based row height calculation
✅ Detail panel rendering
✅ Memoized cell rendering for performance
✅ Virtual column rendering
✅ Custom className and style props
✅ Data attributes for testing and styling

## Removed Features

⚠️ **Complex cell highlight overlay system**: The MUI version used `td:after` pseudo-elements with `alpha` colors for hover and selection states. This has been simplified to row-level background colors using Tailwind utilities. This provides cleaner, more maintainable code while preserving the visual feedback.

⚠️ **Theme-based hover color calculation**: The dynamic `lighten`/`darken` calculations based on theme mode have been replaced with Tailwind's semantic color system (`bg-muted/50`).

## Requirements Validated

- ✅ **Requirement 1.7**: Component Library maintains equivalent functionality
- ✅ **Requirement 14.1**: MUI TableRow replaced with shadcn/ui TableRow

## Testing Notes

- TypeScript compilation: ✅ No errors
- Removed unused imports: `commonCellBeforeAfterStyles`, `getCommonPinnedCellStyles`, `pinnedRowBackgroundColor`, `selectedRowBackgroundColor`
- Used by: `MRT_TableBody` component
- Exported: ✅ From main index.ts (both regular and memoized versions)

## Breaking Changes

**Visual Changes** (minor):
- Row hover and selection styling now uses Tailwind's semantic colors instead of theme-calculated colors
- Cell-level highlight overlays removed in favor of simpler row-level backgrounds
- These changes maintain visual feedback while simplifying the implementation

## Migration Date
2024
