# MRT_TableBodyCell Migration Notes

## Migration Summary
Migrated from MUI TableCell to shadcn/ui TableCell with Tailwind CSS styling.

## Changes Made

### 1. Component Imports
- **Removed**: `@mui/material/TableCell`, `@mui/material/Skeleton`, `@mui/material/styles/useTheme`
- **Added**: `../ui/table` (TableCell), `../ui/skeleton` (Skeleton), `../../lib/utils` (cn)

### 2. Props Interface
- Changed from `extends TableCellProps` to `extends React.TdHTMLAttributes<HTMLTableCellElement>`
- This maintains compatibility with standard HTML table cell attributes

### 3. Styling Migration

#### Padding (Density)
- **Compact**: `px-2 py-0` (display) or `p-2` (data)
- **Comfortable**: `px-3 py-2` (display) or `p-4` (data)
- **Default**: `px-5 py-4` (display) or `p-6` (data)

#### Cursor Styles
- Context menu: `cursor-context-menu`
- Editable cell: `cursor-pointer`
- Default: no class (inherits)

#### Outline Styles
- Active/editing: `outline outline-1 outline-muted-foreground -outline-offset-1`
- Hover: `hover:outline hover:outline-1 hover:outline-muted-foreground hover:-outline-offset-1`
- Focus: `focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-2`

#### Layout
- Grid mode: `flex items-center`
- Overflow: `overflow-hidden`
- Text overflow: `truncate` (for data columns)
- Whitespace: `whitespace-nowrap` (compact/pinned) or `whitespace-normal`

### 4. Dragging Borders
- Kept as inline styles since they're highly dynamic
- Uses CSS custom properties or fallback to `hsl(var(--primary))`
- Border colors: `hsl(var(--muted-foreground))` for dashed borders

### 5. Skeleton Component
- **MUI**: `<Skeleton animation="wave" height={20} width={skeletonWidth} />`
- **shadcn/ui**: `<Skeleton className="h-5" style={{ width: \`\${skeletonWidth}px\` }} />`
- Note: shadcn Skeleton has built-in pulse animation

### 6. Removed Dependencies
- No longer uses `useTheme()` hook
- No longer uses `getCommonMRTCellStyles()` utility
- Removed `sx` prop in favor of `className` and inline `style`

## Requirements Validated
- **1.7**: Component Library uses shadcn/ui components
- **14.1**: MUI TableCell replaced with shadcn/ui TableCell

## Testing Notes
- Test all density modes (compact, comfortable, default)
- Test edit mode styling (cell, table, modal)
- Test dragging/hovering borders
- Test skeleton loading states
- Test pinned columns
- Test keyboard navigation (tabIndex)
- Test context menu (right-click)
- Test double-click to edit
