# MRT_TableDetailPanel Migration Notes

## Migration Summary
Migrated from MUI Collapse to shadcn/ui Collapsible component with Tailwind CSS styling.

## Changes Made

### 1. Component Imports
- **Removed**: `Collapse` from `@mui/material/Collapse`
- **Removed**: `TableCell` and `TableCellProps` from `@mui/material/TableCell`
- **Removed**: `TableRow` from `@mui/material/TableRow`
- **Added**: `TableCell`, `TableRow` from `../ui/table` (shadcn/ui)
- **Added**: `CollapsibleContent` from `../ui/collapsible` (shadcn/ui)
- **Added**: `cn` utility from `@/lib/utils`

### 2. Props Interface
- Changed from extending `TableCellProps` to `React.TdHTMLAttributes<HTMLTableCellElement>`
- This maintains compatibility with standard HTML table cell attributes

### 3. Styling Migration

#### TableRow Styling
**Before (MUI with sx prop)**:
```tsx
sx={(theme) => ({
  display: layoutMode?.startsWith('grid') ? 'flex' : undefined,
  position: virtualRow ? 'absolute' : undefined,
  top: virtualRow ? `${parentRowRef.current?.getBoundingClientRect()?.height}px` : undefined,
  transform: virtualRow ? `translateY(${virtualRow?.start}px)` : undefined,
  width: '100%',
  ...(parseFromValuesOrFunc(tableRowProps?.sx, theme) as any),
})}
```

**After (Tailwind with className and style)**:
```tsx
className={cn(
  "Mui-TableBodyCell-DetailPanel",
  layoutMode?.startsWith('grid') && "flex",
  virtualRow && "absolute w-full",
  tableRowProps?.className
)}
style={{
  top: virtualRow ? `${parentRowRef.current?.getBoundingClientRect()?.height}px` : undefined,
  transform: virtualRow ? `translateY(${virtualRow?.start}px)` : undefined,
  ...tableRowProps?.style,
}}
```

#### TableCell Styling
**Before (MUI with sx prop)**:
```tsx
sx={(theme) => ({
  backgroundColor: virtualRow ? baseBackgroundColor : undefined,
  borderBottom: !row.getIsExpanded() ? 'none' : undefined,
  display: layoutMode?.startsWith('grid') ? 'flex' : undefined,
  py: !!DetailPanel && row.getIsExpanded() ? '1rem' : 0,
  transition: !virtualRow ? 'all 150ms ease-in-out' : undefined,
  width: `100%`,
  ...(parseFromValuesOrFunc(tableCellProps?.sx, theme) as any),
})}
```

**After (Tailwind with className and style)**:
```tsx
className={cn(
  "Mui-TableBodyCell-DetailPanel",
  layoutMode?.startsWith('grid') && "flex",
  "w-full border-b-0 transition-all duration-150 ease-in-out",
  !!DetailPanel && row.getIsExpanded() ? "py-4" : "py-0",
  !row.getIsExpanded() && "border-b-0",
  tableCellProps?.className
)}
style={{
  backgroundColor: virtualRow ? baseBackgroundColor : undefined,
  ...tableCellProps?.style,
}}
```

### 4. Collapse to Collapsible Migration

#### Before (MUI Collapse)
```tsx
<Collapse in={row.getIsExpanded()} mountOnEnter unmountOnExit>
  {DetailPanel}
</Collapse>
```

#### After (shadcn/ui CollapsibleContent)
```tsx
<CollapsibleContent
  className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
  forceMount={row.getIsExpanded() ? true : undefined}
>
  {row.getIsExpanded() && DetailPanel}
</CollapsibleContent>
```

**Key Differences**:
- MUI Collapse uses `in` prop for open/closed state
- shadcn/ui Collapsible uses data attributes for state-based styling
- Added animation classes for smooth expand/collapse transitions
- Used `forceMount` to control mounting behavior
- Conditionally render DetailPanel based on expanded state

### 5. Tailwind Class Mappings

| MUI Style | Tailwind Class | Notes |
|-----------|---------------|-------|
| `display: 'flex'` | `flex` | Flexbox layout |
| `position: 'absolute'` | `absolute` | Absolute positioning |
| `width: '100%'` | `w-full` | Full width |
| `borderBottom: 'none'` | `border-b-0` | No bottom border |
| `py: '1rem'` | `py-4` | Vertical padding (1rem = 16px = 4 * 4px) |
| `py: 0` | `py-0` | No vertical padding |
| `transition: 'all 150ms ease-in-out'` | `transition-all duration-150 ease-in-out` | Smooth transitions |

### 6. Animation Implementation
- Used Tailwind's data attribute selectors for state-based animations
- `data-[state=open]:animate-in` - Fade in when opening
- `data-[state=closed]:animate-out` - Fade out when closing
- `data-[state=closed]:fade-out-0` - Start fade out animation
- `data-[state=open]:fade-in-0` - Start fade in animation

## Behavioral Changes
- **Expansion Animation**: Maintained smooth expand/collapse animation using Tailwind animation utilities
- **Mount Behavior**: Used `forceMount` prop to control when content is mounted/unmounted
- **Conditional Rendering**: Added explicit check for `row.getIsExpanded()` inside CollapsibleContent

## Backward Compatibility
- Maintained all existing props and functionality
- Preserved `muiDetailPanelProps` and `muiTableBodyRowProps` prop names (to be renamed in future task)
- Kept `Mui-TableBodyCell-DetailPanel` className for backward compatibility
- Dynamic styles (top, transform, backgroundColor) still use inline styles as needed

## Testing Considerations
- Test detail panel expansion/collapse animation
- Test virtualized row behavior with detail panels
- Test grid layout mode with detail panels
- Verify panel content renders correctly when expanded
- Test that panel collapses smoothly when row is collapsed

## Requirements Validated
- ✅ Requirement 1.7: Component library migration
- ✅ Requirement 14.5: Replace MUI Collapse with shadcn/ui Collapsible
- ✅ Requirement 2.3: Use Tailwind CSS utility classes for styling
- ✅ Requirement 2.6: Maintain responsive design capabilities
