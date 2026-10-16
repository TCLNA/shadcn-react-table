# MRT_TableHeadCell Migration Notes

## Task 5.1: Migrate MRT_TableHeadCell component

### Changes Made

#### 1. Component Imports
- **Removed**: `Box` from `@mui/material/Box`
- **Removed**: `TableCell` and `TableCellProps` from `@mui/material/TableCell`
- **Removed**: `useTheme` from `@mui/material/styles`
- **Removed**: `Theme` type from `@mui/material/styles`
- **Added**: `TableHead` from `../ui/table` (shadcn/ui component)
- **Added**: `cn` utility from `../../lib/utils`

#### 2. Props Interface
- **Changed**: `MRT_TableHeadCellProps` now extends `React.ThHTMLAttributes<HTMLTableCellElement>` instead of `TableCellProps`
- This aligns with native HTML `<th>` element props

#### 3. Component Implementation

##### Removed MUI Theme Hook
- Removed `const theme = useTheme()` as we no longer use MUI theme
- Theme direction (RTL) handling removed (will be handled at app level with Tailwind)

##### Replaced TableCell with TableHead
- Changed from MUI `<TableCell>` to shadcn/ui `<TableHead>` component
- `<TableHead>` renders a native `<th>` element with Tailwind styling

##### Migrated Styling from sx prop to Tailwind Classes

**Padding Classes**:
- Compact density: `p-2` (0.5rem)
- Comfortable density: `p-3` or `p-4` (0.75rem or 1rem)
- Default density: `px-5 py-4` or `p-6` (1rem 1.25rem or 1.5rem)
- Padding bottom: `pb-0`, `pb-1.5`, or `pb-2.5`
- Padding top: `pt-1`, `pt-3`, or `pt-5`

**Alignment**:
- Group columns: `text-center`
- Default: `text-left`
- RTL handling removed (to be handled globally)

**Other Styles**:
- Font weight: `font-bold`
- Overflow: `overflow-visible`
- Vertical align: `align-top`
- User select: `select-none` (when multi-sort enabled)
- Flex direction: `flex flex-col` (for grid layout mode)

##### Dragging Border Styles
- **Before**: Returned CSS object with border properties
- **After**: Returns Tailwind class strings:
  - Resize border: `border-r-2 border-r-primary` or `border-l-2 border-l-primary`
  - Dragging: `border-x border-t border-dashed border-muted-foreground`
  - Hovered: `border-x-2 border-t-2 border-dashed border-primary`

##### Replaced Box with div
- All `<Box>` components replaced with `<div>` elements
- Applied Tailwind classes directly via `className` prop
- Used `cn()` utility for conditional class composition

**Content Container**:
```tsx
// Before: <Box sx={{ display: 'flex', alignItems: 'center', ... }}>
// After: <div className="flex items-center relative w-full">
```

**Labels Container**:
```tsx
// Before: <Box sx={{ display: 'flex', cursor: 'pointer', ... }}>
// After: <div className={cn("flex items-center", column.getCanSort() && "cursor-pointer")}>
```

**Content Wrapper**:
```tsx
// Before: <Box sx={{ textOverflow: 'ellipsis', overflow: 'hidden', ... }}>
// After: <div className={cn("text-ellipsis hover:overflow-clip", "overflow-hidden")}>
```

**Actions Container**:
```tsx
// Before: <Box sx={{ whiteSpace: 'nowrap' }}>
// After: <div className="whitespace-nowrap">
```

#### 4. Hover State Styling
- **Before**: Used nested sx selector `'& :hover': { '.MuiButtonBase-root': { opacity: 1 } }`
- **After**: Applied Tailwind class `hover:[&_.MuiButtonBase-root]:opacity-100`
- Note: Class name `.MuiButtonBase-root` retained for compatibility with child components

#### 5. Dynamic Styles
- Inline `style` prop still used for truly dynamic values:
  - `flexDirection` based on alignment
  - `justifyContent` based on column type
  - `paddingLeft` for centered headers
  - `minWidth` for content wrapper

#### 6. Common Cell Styles
- Still calls `getCommonMRTCellStyles()` utility (not migrated yet)
- This utility handles pinning, virtualization, and other advanced styling
- Will be migrated in future tasks

### Requirements Validated
- ✅ **Requirement 1.7**: Component Library uses shadcn/ui components
- ✅ **Requirement 14.1**: MUI TableCell replaced with shadcn/ui TableHead

### Testing Notes
- Component compiles without TypeScript errors
- Maintains all existing props and functionality
- Child components (FilterLabel, SortLabel, etc.) still need migration
- Visual testing required to verify Tailwind classes match MUI appearance

### Known Limitations
1. RTL (right-to-left) text direction handling removed - needs global Tailwind config
2. `getCommonMRTCellStyles()` still uses MUI theme - will be migrated separately
3. Child components still use MUI components - will be migrated in subsequent tasks

### Next Steps
- Task 5.2: Migrate MRT_TableHeadCellFilterContainer
- Task 5.3: Migrate MRT_TableHeadCellSortLabel
- Update `getCommonMRTCellStyles()` to use Tailwind
- Add unit tests for MRT_TableHeadCell
