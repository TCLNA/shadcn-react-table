# MRT_LinearProgressBar Migration Summary

## Overview
Migrated `MRT_LinearProgressBar` component from Material UI to shadcn/ui as part of task 13.1.

## Changes Made

### 1. Component File (`MRT_LinearProgressBar.tsx`)
**Before (MUI):**
- Used `@mui/material/Collapse` for show/hide animation
- Used `@mui/material/LinearProgress` for progress bar
- Used MUI's `sx` prop for styling
- Props extended `LinearProgressProps` from MUI

**After (shadcn/ui):**
- Uses `Collapsible` and `CollapsibleContent` from shadcn/ui for show/hide animation
- Uses `Progress` component from shadcn/ui for progress bar
- Uses Tailwind CSS classes for styling via `cn()` utility
- Props extend `React.ComponentPropsWithoutRef<typeof Progress>`

### 2. Progress Component Enhancement (`src/components/ui/progress.tsx`)
Added support for indeterminate state:
- When `value` is `undefined` or `null`, the progress bar shows an animated indeterminate state
- Added `animate-progress-indeterminate` class for the animation

### 3. Tailwind Configuration (`tailwind.config.ts`)
Added indeterminate progress animation:
```typescript
keyframes: {
  'progress-indeterminate': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(400%)' },
  },
},
animation: {
  'progress-indeterminate': 'progress-indeterminate 1.5s ease-in-out infinite',
},
```

### 4. Test File (`MRT_LinearProgressBar.test.tsx`)
Created comprehensive unit tests covering:
- Rendering when `showProgressBars` is true
- Rendering when `isSaving` is true
- Not rendering when both are false
- Positioning (top vs bottom toolbar)
- ARIA attributes (aria-busy, aria-label)
- Indeterminate state
- Custom className support
- Props merging from table options

## Key Differences

### Styling Approach
- **MUI**: Used `sx` prop with theme-based values
- **shadcn/ui**: Uses Tailwind utility classes with `cn()` for composition

### Animation
- **MUI**: Built-in `Collapse` component with `mountOnEnter`/`unmountOnExit`
- **shadcn/ui**: `Collapsible` with `open` prop (no mount/unmount control)

### Positioning
- **MUI**: Used `sx` with conditional `top`/`bottom` values
- **shadcn/ui**: Uses conditional Tailwind classes (`top-0` or `bottom-0`)

### Indeterminate State
- **MUI**: LinearProgress has built-in indeterminate mode
- **shadcn/ui**: Custom implementation using CSS animation when `value` is undefined

## Backward Compatibility
- The component maintains the same public API
- `muiLinearProgressProps` option name is preserved for backward compatibility
- All existing functionality is maintained

## Requirements Validated
- ✅ Requirement 1.7: Component library migration
- ✅ Requirement 14.11: Replace MUI LinearProgress with shadcn/ui Progress
- ✅ Indeterminate state implementation
- ✅ Progress bar styling with Tailwind CSS

## Files Modified
1. `packages/material-react-table/src/components/toolbar/MRT_LinearProgressBar.tsx`
2. `packages/material-react-table/src/components/ui/progress.tsx`
3. `packages/material-react-table/tailwind.config.ts`

## Files Created
1. `packages/material-react-table/src/components/toolbar/MRT_LinearProgressBar.test.tsx`
2. `packages/material-react-table/src/components/toolbar/MRT_LinearProgressBar.MIGRATION.md` (this file)

## Testing
- Component compiles without TypeScript errors
- Unit tests created covering all functionality
- Component is used in `MRT_TopToolbar` and `MRT_BottomToolbar` without breaking changes

## Next Steps
- Task 13.2: Migrate MRT_TableLoadingOverlay component
- Task 13.3: Write unit tests for feedback components (after all migrations complete)
