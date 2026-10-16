# Button Components Migration Notes

## Overview
Successfully migrated all 13 button components from MUI to shadcn/ui with MRT wrapper components.

## Migration Date
2024-01-XX

## Components Migrated

### Simple Toggle Buttons (5 components)
1. **MRT_ToggleGlobalFilterButton** ✅
   - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
   - Removed manual tooltip wrapping (now integrated)
   - Removed `<span>` wrapper for disabled state
   - Icons: `SearchIcon`, `SearchOffIcon`

2. **MRT_ToggleFullScreenButton** ✅
   - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
   - Removed manual tooltip state management (`tooltipOpened`, `setTooltipOpened`)
   - Removed focus/blur/mouseEnter/mouseLeave handlers (handled by MRT_IconButton)
   - Icons: `FullscreenIcon`, `FullscreenExitIcon`

3. **MRT_ShowHideColumnsButton** ✅
   - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
   - Maintained menu anchor state management
   - Icons: `ViewColumnIcon`

4. **MRT_ToggleFiltersButton** ✅
   - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
   - Simple toggle between filter states
   - Icons: `FilterListIcon`, `FilterListOffIcon`

5. **MRT_ToggleDensePaddingButton** ✅
   - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
   - Cycles through density states (comfortable → compact → spacious)
   - Icons: `DensitySmallIcon`, `DensityMediumIcon`, `DensityLargeIcon`

### Row/Column Action Buttons (3 components)
6. **MRT_RowPinButton** ✅
   - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
   - Removed manual tooltip state management
   - Added `cn()` utility for className merging
   - Fixed size to `h-6 w-6` (24px) using Tailwind
   - Icons: `CloseIcon`, `PushPinIcon` (with rotation)

7. **MRT_GrabHandleButton** ✅
   - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
   - Converted MUI sx styles to Tailwind classes:
     - `cursor: grab` → `cursor-grab`
     - `cursor: grabbing` (active) → `active:cursor-grabbing`
     - `opacity` transitions → `opacity-50 hover:opacity-100`
     - `backgroundColor: transparent` → `hover:bg-transparent`
   - Maintained drag event handlers
   - Icons: `DragHandleIcon`

8. **MRT_ExpandAllButton** ✅
   - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
   - Removed `<span>` wrapper for disabled state
   - Converted density-based sizing to `density` prop
   - Converted margin-top to Tailwind: `-mt-1`
   - Maintained rotation animation for expand icon
   - Icons: `KeyboardDoubleArrowDownIcon`

### Expand Button (1 component)
9. **MRT_ExpandButton** ✅
   - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
   - Removed `useTheme` hook (no longer needed for RTL)
   - **RTL Handling Change**: Removed theme.direction check
     - Previous: Used `theme.direction === 'rtl'` to determine margin side
     - Current: Uses `positionExpandColumn` only
     - Note: RTL support may need to be handled at a higher level or via CSS
   - Converted density-based sizing to `density` prop
   - Maintained row depth indentation with inline styles
   - Icons: `ExpandMoreIcon` (with rotation)

### Layout Button (1 component)
10. **MRT_ColumnPinningButtons** ✅
    - Replaced `Box` with `div` + Tailwind classes
    - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
    - Converted layout styles:
      - `minWidth: '70px'` → `min-w-[70px]`
      - `textAlign: 'center'` → `text-center`
    - Removed `parseFromValuesOrFunc` for sx prop
    - Icons: `PushPinIcon` (with rotation for left/right)

### Copy Button (1 component)
11. **MRT_CopyButton** ✅
    - **Special Case**: Uses `MRT_Button` instead of `MRT_IconButton`
    - Replaced `Button` + `Tooltip` with `MRT_Button` + manual `Tooltip`
    - Converted MUI sx styles to Tailwind classes:
      - `backgroundColor: 'transparent'` → `bg-transparent`
      - `border: 'none'` → `border-none`
      - `color: 'inherit'` → `text-inherit`
      - `cursor: 'copy'` → `cursor-copy`
      - `fontFamily: 'inherit'` → `font-inherit`
      - `m: '-0.25rem'` → `-m-1`
      - `minWidth: 'unset'` → `min-w-0`
      - `py: 0` → `py-0`
      - `textAlign: 'inherit'` → `text-left`
    - Maintained clipboard copy functionality
    - Maintained copied state with 4-second timeout

### Edit Action Buttons (1 component)
12. **MRT_EditActionButtons** ✅
    - Replaced `Box` with `div` + Tailwind classes
    - Replaced `Button` with `MRT_Button`
    - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
    - **CircularProgress Replacement**:
      - Added `CircularProgressIcon` (Loader2) to icons.ts
      - Replaced `<CircularProgress size={18} />` with `<CircularProgressIcon className="h-[18px] w-[18px] animate-spin" />`
    - Converted layout styles:
      - `display: 'flex'` → `flex`
      - `gap: '0.75rem'` → `gap-3`
    - Supports both `icon` and `text` variants
    - Icons: `CancelIcon`, `SaveIcon`, `CircularProgressIcon`

### Row Action Menu Button (1 component)
13. **MRT_ToggleRowActionMenuButton** ✅
    - Replaced `IconButton` + `Tooltip` with `MRT_IconButton`
    - Converted common styles from sx object to Tailwind classes:
      - `height: '2rem'` → `h-8`
      - `width: '2rem'` → `w-8`
      - `ml: '10px'` → `ml-2.5`
      - `opacity: 0.5` → `opacity-50`
      - `'&:hover': { opacity: 1 }` → `hover:opacity-100`
      - `transition: 'opacity 150ms'` → `transition-opacity duration-150`
    - Maintained complex conditional rendering logic
    - Integrates with `MRT_EditActionButtons` and `MRT_RowActionMenu`
    - Icons: `EditIcon`, `MoreHorizIcon`

## Key Changes Across All Components

### 1. Import Changes
**Before:**
```typescript
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
```

**After:**
```typescript
import { MRT_IconButton, type MRT_IconButtonProps } from './MRT_IconButton';
```

### 2. Tooltip Integration
**Before:**
```typescript
<Tooltip title={localization.someAction}>
  <IconButton onClick={handleClick}>
    <SomeIcon />
  </IconButton>
</Tooltip>
```

**After:**
```typescript
<MRT_IconButton 
  onClick={handleClick}
  tooltip={localization.someAction}
>
  <SomeIcon />
</MRT_IconButton>
```

### 3. Disabled State Handling
**Before (required span wrapper):**
```typescript
<Tooltip title="...">
  <span>
    <IconButton disabled={isDisabled}>
      <Icon />
    </IconButton>
  </span>
</Tooltip>
```

**After (handled internally):**
```typescript
<MRT_IconButton disabled={isDisabled} tooltip="...">
  <Icon />
</MRT_IconButton>
```

### 4. Size Handling
**Before:**
```typescript
<IconButton 
  size="small"
  sx={{ height: '24px', width: '24px' }}
>
```

**After:**
```typescript
<MRT_IconButton 
  size="small"
  className="h-6 w-6"
>
```

### 5. Density-Based Sizing
**Before:**
```typescript
sx={{
  height: density === 'compact' ? '1.75rem' : '2.25rem',
  width: density === 'compact' ? '1.75rem' : '2.25rem',
}}
```

**After:**
```typescript
density={density}
// MRT_IconButton handles sizing internally
```

### 6. Layout Components (Box → div)
**Before:**
```typescript
<Box sx={{ display: 'flex', gap: '0.75rem' }}>
  {children}
</Box>
```

**After:**
```typescript
<div className="flex gap-3">
  {children}
</div>
```

## Icons Added to icons.ts

Added `Loader2` from lucide-react as `CircularProgressIcon` for loading states:
```typescript
import { Loader2 } from 'lucide-react';

export const MRT_Default_Icons = {
  // ... other icons
  CircularProgressIcon: Loader2,
};
```

## Breaking Changes

### 1. RTL Support in MRT_ExpandButton
- **Previous**: Used `theme.direction === 'rtl'` from MUI theme
- **Current**: Only uses `positionExpandColumn` prop
- **Impact**: RTL layouts may need additional handling at application level
- **Recommendation**: Consider adding RTL detection via CSS or context

### 2. Prop Interface Changes
- All button components now extend `MRT_IconButtonProps` or `MRT_ButtonProps`
- Removed `IconButtonProps` from MUI
- Some components changed from `extends BoxProps` to simple props with `className`

### 3. Tooltip Placement
- **Previous**: Various placement props (`placement`, custom positioning)
- **Current**: Standardized to `tooltipPlacement` prop with values: `'top' | 'right' | 'bottom' | 'left'`

## Testing Recommendations

1. **Visual Testing**
   - Verify all button tooltips appear correctly
   - Check button sizing across density modes (compact, comfortable, spacious)
   - Test hover states and transitions
   - Verify icon rotations (expand, pin buttons)

2. **Functional Testing**
   - Test all toggle buttons (filters, search, fullscreen, density)
   - Test row/column pinning functionality
   - Test expand/collapse with nested rows
   - Test drag-and-drop with grab handle
   - Test edit mode with EditActionButtons
   - Test row action menu opening/closing

3. **Accessibility Testing**
   - Verify aria-labels are present
   - Test keyboard navigation
   - Test screen reader announcements
   - Verify disabled state tooltips work correctly

4. **Edge Cases**
   - Test buttons with very long tooltip text
   - Test rapid clicking/toggling
   - Test with custom icon overrides
   - Test in RTL layouts (especially expand button)

## Performance Notes

- Removed manual tooltip state management in several components (ToggleFullScreenButton, RowPinButton)
- Tooltip state is now handled internally by MRT_IconButton
- Reduced component complexity by removing MUI theme dependencies
- Tailwind classes are more performant than runtime sx prop evaluation

## Future Improvements

1. **RTL Support**: Consider adding RTL detection utility or context
2. **Icon Sizing**: Standardize icon sizing across all buttons
3. **Animation**: Consider adding more consistent transition animations
4. **Accessibility**: Add focus-visible styles for keyboard navigation
5. **Dark Mode**: Ensure all button states work well in dark mode

## Files Modified

1. `MRT_ToggleGlobalFilterButton.tsx`
2. `MRT_ToggleFullScreenButton.tsx`
3. `MRT_ShowHideColumnsButton.tsx`
4. `MRT_ToggleFiltersButton.tsx`
5. `MRT_ToggleDensePaddingButton.tsx`
6. `MRT_RowPinButton.tsx`
7. `MRT_GrabHandleButton.tsx`
8. `MRT_ExpandAllButton.tsx`
9. `MRT_ExpandButton.tsx`
10. `MRT_ColumnPinningButtons.tsx`
11. `MRT_CopyButton.tsx`
12. `MRT_EditActionButtons.tsx`
13. `MRT_ToggleRowActionMenuButton.tsx`
14. `icons.ts` (added CircularProgressIcon)

## Dependencies Removed

- `@mui/material/IconButton`
- `@mui/material/Button` (from button components)
- `@mui/material/Tooltip`
- `@mui/material/Box`
- `@mui/material/CircularProgress`
- `@mui/material/styles` (useTheme)

## Dependencies Added

- `lucide-react` (Loader2 icon)
- Internal: `MRT_IconButton`, `MRT_Button`
- Internal: `cn` utility from `lib/utils`

## Validation Status

✅ All 13 button components migrated
✅ All MUI imports removed
✅ All tooltips integrated
✅ All icons updated
✅ All layouts converted to Tailwind
✅ CircularProgress replaced with Loader2
✅ Box components replaced with div
✅ Migration notes documented
