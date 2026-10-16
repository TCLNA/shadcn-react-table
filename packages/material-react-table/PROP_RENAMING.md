# MUI-Specific Prop Renaming

## Overview

As part of the migration from Material UI to shadcn/ui, all `mui*` prefixed props have been renamed to remove the "mui" prefix. The old prop names are still supported for backward compatibility but are marked as deprecated.

## Migration Status

✅ **Type Definitions Updated** - All prop types in `src/types.ts` have been updated with:
- New prop names (without `mui` prefix)
- Deprecated old prop names (with `@deprecated` JSDoc tags)
- Full backward compatibility maintained

✅ **Component Updates Started** - Key components updated:
- `MRT_Table` - Now supports both `tableProps` and `muiTableProps`
- `MRT_TableHeadCell` - Now supports both `tableHeadCellProps` and `muiTableHeadCellProps`

## Prop Name Mapping

### Column-Level Props (MRT_ColumnDef)

| Old Name (Deprecated) | New Name |
|----------------------|----------|
| `muiColumnActionsButtonProps` | `columnActionsButtonProps` |
| `muiColumnDragHandleProps` | `columnDragHandleProps` |
| `muiCopyButtonProps` | `copyButtonProps` |
| `muiEditTextFieldProps` | `editTextFieldProps` |
| `muiFilterAutocompleteProps` | `filterAutocompleteProps` |
| `muiFilterCheckboxProps` | `filterCheckboxProps` |
| `muiFilterDatePickerProps` | `filterDatePickerProps` |
| `muiFilterDateTimePickerProps` | `filterDateTimePickerProps` |
| `muiFilterSliderProps` | `filterSliderProps` |
| `muiFilterTextFieldProps` | `filterTextFieldProps` |
| `muiFilterTimePickerProps` | `filterTimePickerProps` |
| `muiTableBodyCellProps` | `tableBodyCellProps` |
| `muiTableFooterCellProps` | `tableFooterCellProps` |
| `muiTableHeadCellProps` | `tableHeadCellProps` |

### Table-Level Props (MRT_TableOptions)

| Old Name (Deprecated) | New Name |
|----------------------|----------|
| `muiBottomToolbarProps` | `bottomToolbarProps` |
| `muiCircularProgressProps` | `circularProgressProps` |
| `muiColumnActionsButtonProps` | `columnActionsButtonProps` |
| `muiColumnDragHandleProps` | `columnDragHandleProps` |
| `muiCopyButtonProps` | `copyButtonProps` |
| `muiCreateRowModalProps` | `createRowModalProps` |
| `muiDetailPanelProps` | `detailPanelProps` |
| `muiEditRowDialogProps` | `editRowDialogProps` |
| `muiEditTextFieldProps` | `editTextFieldProps` |
| `muiExpandAllButtonProps` | `expandAllButtonProps` |
| `muiExpandButtonProps` | `expandButtonProps` |
| `muiFilterAutocompleteProps` | `filterAutocompleteProps` |
| `muiFilterCheckboxProps` | `filterCheckboxProps` |
| `muiFilterDatePickerProps` | `filterDatePickerProps` |
| `muiFilterDateTimePickerProps` | `filterDateTimePickerProps` |
| `muiFilterSliderProps` | `filterSliderProps` |
| `muiFilterTextFieldProps` | `filterTextFieldProps` |
| `muiFilterTimePickerProps` | `filterTimePickerProps` |
| `muiLinearProgressProps` | `linearProgressProps` |
| `muiPaginationProps` | `paginationProps` |
| `muiRowDragHandleProps` | `rowDragHandleProps` |
| `muiSearchTextFieldProps` | `searchTextFieldProps` |
| `muiSelectAllCheckboxProps` | `selectAllCheckboxProps` |
| `muiSelectCheckboxProps` | `selectCheckboxProps` |
| `muiSkeletonProps` | `skeletonProps` |
| `muiTableBodyCellProps` | `tableBodyCellProps` |
| `muiTableBodyProps` | `tableBodyProps` |
| `muiTableBodyRowProps` | `tableBodyRowProps` |
| `muiTableContainerProps` | `tableContainerProps` |
| `muiTableFooterCellProps` | `tableFooterCellProps` |
| `muiTableFooterProps` | `tableFooterProps` |
| `muiTableFooterRowProps` | `tableFooterRowProps` |
| `muiTableHeadCellProps` | `tableHeadCellProps` |
| `muiTableHeadProps` | `tableHeadProps` |
| `muiTableHeadRowProps` | `tableHeadRowProps` |
| `muiTablePaperProps` | `tablePaperProps` |
| `muiTableProps` | `tableProps` |
| `muiToolbarAlertBannerChipProps` | `toolbarAlertBannerChipProps` |
| `muiToolbarAlertBannerProps` | `toolbarAlertBannerProps` |
| `muiTopToolbarProps` | `topToolbarProps` |

## Backward Compatibility

All old prop names continue to work and will be supported for the foreseeable future. However, they are marked as deprecated and will show deprecation warnings in TypeScript.

### Resolution Strategy

When both old and new prop names are provided, the new prop name takes precedence:

```typescript
// If both are provided, tableProps is used
const table = useMaterialReactTable({
  columns,
  data,
  tableProps: { className: 'new-class' },      // ✅ This is used
  muiTableProps: { className: 'old-class' },   // ⚠️ This is ignored
});
```

### Migration Example

**Before (deprecated but still works):**
```typescript
const table = useMaterialReactTable({
  columns,
  data,
  muiTableProps: {
    className: 'my-table',
  },
  muiTableHeadCellProps: {
    className: 'my-header-cell',
  },
});
```

**After (recommended):**
```typescript
const table = useMaterialReactTable({
  columns,
  data,
  tableProps: {
    className: 'my-table',
  },
  tableHeadCellProps: {
    className: 'my-header-cell',
  },
});
```

## Implementation Details

### Type Definitions

All prop types have been updated in `src/types.ts`:
1. New prop definitions added with JSDoc comments
2. Old prop definitions kept with `@deprecated` tags
3. Both old and new props have identical type signatures

### Component Updates

Components have been updated to support both prop names:

```typescript
// Example from MRT_Table.tsx
const resolvedTableProps = {
  ...parseFromValuesOrFunc(tableProps ?? muiTableProps, { table }),
  ...rest,
};
```

This pattern ensures:
- New prop name is preferred if provided
- Falls back to old prop name if new one is not provided
- Maintains full backward compatibility

### Utility Functions

A new utility file `src/utils/prop-compat.utils.ts` provides:
- `resolveProp()` function for prop resolution
- `PROP_NAME_MAPPING` constant for documentation and tooling
- Type definitions for old and new prop names

## Remaining Work

The following components still need to be updated to support both old and new prop names:

### Body Components
- `MRT_TableBodyCell` - `tableBodyCellProps`
- `MRT_TableBodyRow` - `tableBodyRowProps`
- `MRT_TableDetailPanel` - `detailPanelProps`

### Footer Components
- `MRT_TableFooterCell` - `tableFooterCellProps`
- `MRT_TableFooterRow` - `tableFooterRowProps`

### Head Components
- `MRT_TableHead` - `tableHeadProps`
- `MRT_TableHeadRow` - `tableHeadRowProps`

### Button Components
- All button components using `columnActionsButtonProps`, `copyButtonProps`, etc.

### Input Components
- Filter components using `filterTextFieldProps`, `filterCheckboxProps`, etc.
- Edit components using `editTextFieldProps`

### Toolbar Components
- `MRT_TopToolbar` - `topToolbarProps`
- `MRT_BottomToolbar` - `bottomToolbarProps`
- `MRT_ToolbarAlertBanner` - `toolbarAlertBannerProps`, `toolbarAlertBannerChipProps`
- `MRT_TablePagination` - `paginationProps`

### Other Components
- `MRT_TableContainer` - `tableContainerProps`
- `MRT_TablePaper` - `tablePaperProps`
- `MRT_LinearProgressBar` - `linearProgressProps`
- `MRT_TableLoadingOverlay` - `circularProgressProps`
- Modal/Dialog components - `createRowModalProps`, `editRowDialogProps`

## Testing

All existing tests should continue to pass as backward compatibility is maintained. New tests should use the new prop names.

## Documentation

User-facing documentation should be updated to:
1. Show new prop names in all examples
2. Add a migration guide explaining the prop renaming
3. Include a deprecation notice for old prop names
4. Provide a complete mapping table (as shown above)

## Timeline

- **Phase 1** (Current): Type definitions updated, backward compatibility added
- **Phase 2** (Next): Update all component implementations
- **Phase 3**: Update all examples and documentation
- **Phase 4**: Add deprecation warnings in console (optional)
- **Phase 5** (Future): Remove deprecated props in next major version
