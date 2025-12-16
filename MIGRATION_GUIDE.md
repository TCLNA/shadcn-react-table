# Material UI to shadcn UI Migration Guide

## Overview
This document outlines the migration strategy from Material UI to shadcn UI for the React Table library. The migration affects approximately 126 files with over 6,000 lines of code.

## Completed Work

### Phase 1: Infrastructure ✅
- ✅ Added Tailwind CSS configuration
- ✅ Added PostCSS configuration
- ✅ Created global CSS with shadcn design tokens
- ✅ Created `cn()` utility function for class merging
- ✅ Updated package.json dependencies (removed MUI, added Radix UI and Lucide icons)
- ✅ Updated rollup.config.mjs to handle CSS and new dependencies
- ✅ Updated peer dependencies to require tailwindcss

### Phase 2: Icon Migration ✅
- ✅ Migrated all 34 MUI icons to Lucide React equivalents in `icons.ts`

### Phase 3: shadcn UI Components ✅
Created 17 complete shadcn UI components in `src/components/ui/`:
- ✅ button.tsx - Button component with variants
- ✅ checkbox.tsx - Checkbox with Radix UI
- ✅ input.tsx - Input field
- ✅ table.tsx - Table, TableHeader, TableBody, TableRow, TableCell, etc.
- ✅ tooltip.tsx - Tooltip with Radix UI
- ✅ dialog.tsx - Dialog/Modal with Radix UI
- ✅ dropdown-menu.tsx - DropdownMenu with Radix UI
- ✅ progress.tsx - Progress bar
- ✅ badge.tsx - Badge/Chip replacement
- ✅ select.tsx - Select dropdown with Radix UI
- ✅ slider.tsx - Slider with Radix UI
- ✅ radio-group.tsx - Radio button group
- ✅ label.tsx - Form label
- ✅ skeleton.tsx - Loading skeleton
- ✅ popover.tsx - Popover with Radix UI
- ✅ alert.tsx - Alert component
- ✅ card.tsx - Card/Paper replacement

## Migration Pattern

### Example: MRT_ExpandButton Migration

#### Before (MUI):
```tsx
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

<Tooltip title="Expand">
  <IconButton 
    sx={{ height: '2.25rem', width: '2.25rem' }}
    onClick={handleClick}
  >
    <ExpandMoreIcon />
  </IconButton>
</Tooltip>
```

#### After (shadcn):
```tsx
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';

<Tooltip>
  <TooltipTrigger asChild>
    <Button 
      variant="ghost" 
      size="icon"
      className="h-9 w-9"
      onClick={handleClick}
    >
      <ExpandMoreIcon className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>Expand</TooltipContent>
</Tooltip>
```

### Key Migration Patterns

#### 1. Component Replacements
| MUI Component | shadcn Equivalent | Notes |
|--------------|------------------|-------|
| `IconButton` | `Button` with `variant="ghost" size="icon"` | |
| `Button` | `Button` | Use variants: default, destructive, outline, secondary, ghost, link |
| `TextField` | `Input` | Simpler API |
| `Checkbox` | `Checkbox` | Uses Radix UI |
| `Radio` | `RadioGroup` + `RadioGroupItem` | Uses Radix UI |
| `Select` | `Select` + `SelectTrigger` + `SelectContent` + `SelectItem` | More verbose |
| `Tooltip` | `Tooltip` + `TooltipTrigger` + `TooltipContent` | Composition pattern |
| `Dialog` | `Dialog` + `DialogTrigger` + `DialogContent` + `DialogHeader` | Composition pattern |
| `Menu` / `MenuItem` | `DropdownMenu` + `DropdownMenuItem` | Uses Radix UI |
| `Paper` | `Card` | |
| `Box` | `div` with utility classes | |
| `Chip` | `Badge` | |
| `LinearProgress` / `CircularProgress` | `Progress` | Single component |
| `Skeleton` | `Skeleton` | |
| `TableContainer` / `Table` / etc. | `Table` + semantic sub-components | |

#### 2. Styling Migration
- **Remove**: `sx` prop, `styled()` components, `useTheme()` hook
- **Add**: Tailwind utility classes, `className` prop, `cn()` utility for conditional classes

**Before:**
```tsx
sx={{
  height: '2.25rem',
  width: '2.25rem',
  opacity: 0.5,
  '&:hover': { opacity: 1 }
}}
```

**After:**
```tsx
className="h-9 w-9 opacity-50 hover:opacity-100"
```

#### 3. Prop Name Changes
- `muiButtonProps` → `buttonProps` (remove `mui` prefix)
- `muiTableProps` → `tableProps`
- `muiCheckboxProps` → `checkboxProps`
- etc.

#### 4. Theme Migration
- Remove all `useTheme()` usage
- Remove `theme.palette.*` references
- Use CSS variables: `bg-primary`, `text-foreground`, `border-border`, etc.
- Use Tailwind color classes: `bg-blue-500`, `text-gray-700`, etc.

#### 5. Type Migration
Update `types.ts`:
- Remove: All MUI type imports (AlertProps, ButtonProps, etc. from @mui/material)
- Add: Custom type definitions or extend from Radix UI types
- Update: All `mui*Props` type definitions

## Remaining Work

### Files to Migrate (~110 files)

#### Button Components (13 files)
- [ ] MRT_ExpandButton.tsx (example completed: .migrated.tsx)
- [ ] MRT_CopyButton.tsx
- [ ] MRT_ToggleFiltersButton.tsx
- [ ] MRT_ShowHideColumnsButton.tsx
- [ ] MRT_ToggleGlobalFilterButton.tsx
- [ ] MRT_ColumnPinningButtons.tsx
- [ ] MRT_ToggleFullScreenButton.tsx
- [ ] MRT_RowPinButton.tsx
- [ ] MRT_EditActionButtons.tsx
- [ ] MRT_GrabHandleButton.tsx
- [ ] MRT_ToggleDensePaddingButton.tsx
- [ ] MRT_ExpandAllButton.tsx
- [ ] MRT_ToggleRowActionMenuButton.tsx

#### Input Components (7 files)
- [ ] MRT_SelectCheckbox.tsx
- [ ] MRT_FilterCheckbox.tsx
- [ ] MRT_FilterTextField.tsx
- [ ] MRT_GlobalFilterTextField.tsx
- [ ] MRT_EditCellTextField.tsx
- [ ] MRT_FilterRangeFields.tsx
- [ ] MRT_FilterRangeSlider.tsx

#### Table Structure (12 files)
- [ ] MRT_Table.tsx
- [ ] MRT_TableContainer.tsx
- [ ] MRT_TablePaper.tsx
- [ ] MRT_TableHead.tsx
- [ ] MRT_TableHeadRow.tsx
- [ ] MRT_TableHeadCell.tsx
- [ ] MRT_TableBody.tsx
- [ ] MRT_TableBodyRow.tsx
- [ ] MRT_TableBodyCell.tsx
- [ ] MRT_TableFooter.tsx
- [ ] MRT_TableFooterRow.tsx
- [ ] MRT_TableFooterCell.tsx

#### Menu & Dialog Components (8 files)
- [ ] MRT_ColumnActionMenu.tsx
- [ ] MRT_CellActionMenu.tsx
- [ ] MRT_RowActionMenu.tsx
- [ ] MRT_FilterOptionMenu.tsx
- [ ] MRT_ShowHideColumnsMenu.tsx
- [ ] MRT_ShowHideColumnsMenuItems.tsx
- [ ] MRT_ActionMenuItem.tsx
- [ ] MRT_EditRowModal.tsx

#### Toolbar Components (7 files)
- [ ] MRT_TopToolbar.tsx
- [ ] MRT_BottomToolbar.tsx
- [ ] MRT_ToolbarInternalButtons.tsx
- [ ] MRT_ToolbarAlertBanner.tsx
- [ ] MRT_LinearProgressBar.tsx
- [ ] MRT_TablePagination.tsx
- [ ] MRT_ToolbarDropZone.tsx

#### Head Support Components (~10 files)
- [ ] MRT_TableHeadCellColumnActionsButton.tsx
- [ ] MRT_TableHeadCellFilterContainer.tsx
- [ ] MRT_TableHeadCellFilterLabel.tsx
- [ ] MRT_TableHeadCellGrabHandle.tsx
- [ ] MRT_TableHeadCellResizeHandle.tsx
- [ ] MRT_TableHeadCellSortLabel.tsx

#### Body Support Components (~5 files)
- [ ] MRT_TableBodyCellValue.tsx
- [ ] MRT_TableBodyRowGrabHandle.tsx
- [ ] MRT_TableBodyRowPinButton.tsx
- [ ] MRT_TableDetailPanel.tsx
- [ ] MRT_TableLoadingOverlay.tsx

#### Core Files (~10 files)
- [ ] types.ts - Major refactor needed
- [ ] MaterialReactTable.tsx - Rename and migrate
- [ ] index.ts - Update exports
- [ ] style.utils.ts - Remove MUI theme utilities
- [ ] useMaterialReactTable.ts - Update hook
- [ ] useMRT_TableOptions.ts - Update options
- [ ] getMRT_RowExpandColumnDef.tsx - Update display columns

#### Hooks (~20 files in hooks/)
- [ ] Update all hooks that reference MUI types or theme

#### Functions (~10 files in fns/)
- [ ] Update any functions with MUI dependencies

#### Locales (~40 files)
- [ ] Update if any reference MUI-specific terms

## Implementation Strategy

### Recommended Approach

1. **Start with Leaf Components** (no internal dependencies)
   - Buttons
   - Inputs
   - Simple UI elements

2. **Move to Container Components**
   - Table structure components
   - Toolbars
   - Menus

3. **Update Core Types**
   - types.ts refactoring
   - Remove all MUI types
   - Add shadcn-compatible types

4. **Update Main Components**
   - MaterialReactTable.tsx
   - Main exports
   - Hooks

5. **Testing & Validation**
   - TypeScript compilation
   - Build process
   - Storybook stories
   - Example apps

### Automated Migration Opportunities

Consider creating scripts for:
- Replacing common import patterns
- Converting simple `sx` props to `className`
- Renaming prop interfaces
- Updating type imports

### Breaking Changes to Document

Users will need to:
1. Install Tailwind CSS in their projects
2. Update import paths if any
3. Update prop names (mui* → regular names)
4. Update custom styling (sx → className)
5. Replace any custom MUI theme integration

## Next Steps

1. **Immediate**: Migrate remaining button components using MRT_ExpandButton.migrated.tsx as template
2. **Short-term**: Migrate input and table structure components
3. **Mid-term**: Update core types and hooks
4. **Long-term**: Update documentation, examples, and tests

## Estimated Effort

- **Setup & Infrastructure**: ✅ Complete (~4 hours)
- **Icon Migration**: ✅ Complete (~1 hour)
- **shadcn Components**: ✅ Complete (~4 hours)
- **Component Migration**: 🔄 In Progress (~40-60 hours for 110 files)
- **Type System Update**: ⏳ Pending (~8-12 hours)
- **Testing & Validation**: ⏳ Pending (~12-16 hours)
- **Documentation**: ⏳ Pending (~4-6 hours)

**Total Estimated Time**: 75-100+ hours

This is a major architectural refactoring that transforms the entire library. Each component requires careful migration to maintain functionality while adopting shadcn patterns.
