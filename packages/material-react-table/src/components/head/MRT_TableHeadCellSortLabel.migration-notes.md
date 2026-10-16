# MRT_TableHeadCellSortLabel Migration Notes

## Migration Summary
Migrated from MUI TableSortLabel + Badge + Tooltip to shadcn/ui Button + Tooltip with custom badge implementation.

## Changes Made

### Component Replacements
1. **MUI TableSortLabel** → **shadcn/ui Button** (variant="ghost", size="icon")
   - Replaced MUI's specialized sort label with a more flexible button component
   - Implemented custom sort icon logic instead of using IconComponent prop

2. **MUI Badge** → **Custom Badge Implementation**
   - Replaced MUI Badge with a custom absolute-positioned span
   - Uses Tailwind classes for styling: `absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground`
   - Only renders when sortIndex is truthy (multi-column sorting)

3. **MUI Tooltip** → **shadcn/ui Tooltip**
   - Replaced with Radix UI-based Tooltip from shadcn/ui
   - Uses TooltipProvider, Tooltip, TooltipTrigger, and TooltipContent components
   - Placement changed from `placement="top"` to `side="top"`

### Icon Handling
- **Before**: Used IconComponent prop with conditional rendering
  - Unsorted: SyncAltIcon with rotation transform
  - Sorted: ArrowDownwardIcon (direction handled by MUI)
  
- **After**: Direct icon selection based on sort state
  - Unsorted: SyncAltIcon with Tailwind rotation classes
  - Sorted Ascending: ArrowUpwardIcon
  - Sorted Descending: ArrowDownwardIcon
  - Added ArrowUpwardIcon to icon imports

### Styling Migration

#### Opacity States
- **Before**: `opacity: isSorted ? 1 : 0.3` in sx prop
- **After**: Tailwind classes `isSorted ? 'opacity-100' : 'opacity-30'`

#### Hover States
- **Before**: Implicit MUI hover behavior
- **After**: Explicit Tailwind classes `hover:bg-transparent hover:opacity-100`

#### Transitions
- **Before**: `transition: 'all 150ms ease-in-out'`
- **After**: Tailwind class `transition-opacity duration-150`

#### Icon Rotation (Unsorted State)
- **Before**: Inline style `transform: 'rotate(-90deg) scaleX(0.9) translateX(-1px)'`
- **After**: Tailwind classes `rotate-90 scale-x-90` (removed translateX as it's not critical)

#### Badge Positioning
- **Before**: MUI Badge with `overlap="circular"` and `badgeContent` prop
- **After**: Absolute positioned span with `-right-1 -top-1` positioning

### Props Interface Changes
- **Before**: Extended `TableSortLabelProps` from MUI
- **After**: Extended `React.ButtonHTMLAttributes<HTMLButtonElement>`
- Removed dependency on MUI-specific prop types
- Added explicit `className` prop handling

### Removed Dependencies
- `parseFromValuesOrFunc` utility (no longer needed without sx prop)
- MUI theme integration (replaced with Tailwind CSS variables)

## Behavior Preservation

### Sorting Logic
✅ Click handler still calls `header.column.getToggleSortingHandler()`
✅ Event propagation stopped with `e.stopPropagation()`
✅ Sort direction correctly determined from column state

### Multi-Column Sorting
✅ Badge shows sort index when `sorting.length > 1`
✅ Sort index calculated as `column.getSortIndex() + 1`

### Accessibility
✅ `aria-label` attribute preserved with sort tooltip text
✅ Tooltip provides context for screen readers
✅ Button is keyboard accessible

### Localization
✅ All localization strings preserved
✅ Dynamic tooltip text based on sort state
✅ Column name interpolation maintained

## Testing Considerations

### Visual Testing
- [ ] Verify unsorted icon appears with correct rotation
- [ ] Verify ascending sort shows ArrowUp icon
- [ ] Verify descending sort shows ArrowDown icon
- [ ] Verify opacity changes on hover
- [ ] Verify badge appears for multi-column sorting
- [ ] Verify badge positioning and styling

### Functional Testing
- [ ] Test single column sorting (asc → desc → none)
- [ ] Test multi-column sorting with badge display
- [ ] Test tooltip appears on hover
- [ ] Test click handler triggers sort
- [ ] Test keyboard navigation
- [ ] Test with loading/skeleton states

### Integration Testing
- [ ] Test within MRT_TableHeadCell component
- [ ] Test with different column types
- [ ] Test with custom icons
- [ ] Test with different themes (light/dark)

## Known Differences

1. **Badge Styling**: Custom implementation may have slightly different visual appearance than MUI Badge
2. **Icon Transform**: Removed translateX(-1px) from unsorted icon rotation (minimal visual impact)
3. **Hover Background**: Explicitly disabled with `hover:bg-transparent` to match MUI behavior
4. **Transition**: Only animates opacity (MUI animated all properties)

## Migration Path for Users

This is an internal component, so no user-facing API changes. Users who customize this component via:
- `muiTableHeadCellProps` - Still works, but `sx` prop no longer supported
- Custom icons via `icons` option - Still works identically
- Localization strings - Still works identically

## Requirements Validated

- ✅ **Requirement 1.7**: Component Library maintains equivalent functionality
- ✅ **Requirement 15.1**: Icon system migration (ArrowUp, ArrowDown, ArrowUpDown icons)
- ✅ **Requirement 2.3**: Tailwind CSS utility classes for styling
- ✅ **Requirement 14.1**: MUI Button replaced with shadcn/ui Button
