/**
 * Utility functions for handling backward compatibility with renamed props.
 * This file provides helpers to support both old (mui*) and new prop names.
 */

/**
 * Resolves a prop value, preferring the new prop name over the deprecated old one.
 * 
 * @param newProp - The new prop value (without mui prefix)
 * @param oldProp - The deprecated prop value (with mui prefix)
 * @returns The resolved prop value (new prop takes precedence if both are provided)
 * 
 * @example
 * const props = resolveProp(tableProps, muiTableProps);
 */
export function resolveProp<T>(newProp: T | undefined, oldProp: T | undefined): T | undefined {
  return newProp ?? oldProp;
}

/**
 * Map of old (mui*) prop names to new prop names for backward compatibility.
 * This is used for documentation and migration tooling.
 */
export const PROP_NAME_MAPPING = {
  // Column-level props
  muiColumnActionsButtonProps: 'columnActionsButtonProps',
  muiColumnDragHandleProps: 'columnDragHandleProps',
  muiCopyButtonProps: 'copyButtonProps',
  muiEditTextFieldProps: 'editTextFieldProps',
  muiFilterAutocompleteProps: 'filterAutocompleteProps',
  muiFilterCheckboxProps: 'filterCheckboxProps',
  muiFilterDatePickerProps: 'filterDatePickerProps',
  muiFilterDateTimePickerProps: 'filterDateTimePickerProps',
  muiFilterSliderProps: 'filterSliderProps',
  muiFilterTextFieldProps: 'filterTextFieldProps',
  muiFilterTimePickerProps: 'filterTimePickerProps',
  muiTableBodyCellProps: 'tableBodyCellProps',
  muiTableFooterCellProps: 'tableFooterCellProps',
  muiTableHeadCellProps: 'tableHeadCellProps',
  
  // Table-level props
  muiBottomToolbarProps: 'bottomToolbarProps',
  muiCircularProgressProps: 'circularProgressProps',
  muiCreateRowModalProps: 'createRowModalProps',
  muiDetailPanelProps: 'detailPanelProps',
  muiEditRowDialogProps: 'editRowDialogProps',
  muiExpandAllButtonProps: 'expandAllButtonProps',
  muiExpandButtonProps: 'expandButtonProps',
  muiLinearProgressProps: 'linearProgressProps',
  muiPaginationProps: 'paginationProps',
  muiRowDragHandleProps: 'rowDragHandleProps',
  muiSearchTextFieldProps: 'searchTextFieldProps',
  muiSelectAllCheckboxProps: 'selectAllCheckboxProps',
  muiSelectCheckboxProps: 'selectCheckboxProps',
  muiSkeletonProps: 'skeletonProps',
  muiTableBodyProps: 'tableBodyProps',
  muiTableBodyRowProps: 'tableBodyRowProps',
  muiTableContainerProps: 'tableContainerProps',
  muiTableFooterProps: 'tableFooterProps',
  muiTableFooterRowProps: 'tableFooterRowProps',
  muiTableHeadProps: 'tableHeadProps',
  muiTableHeadRowProps: 'tableHeadRowProps',
  muiTablePaperProps: 'tablePaperProps',
  muiTableProps: 'tableProps',
  muiToolbarAlertBannerChipProps: 'toolbarAlertBannerChipProps',
  muiToolbarAlertBannerProps: 'toolbarAlertBannerProps',
  muiTopToolbarProps: 'topToolbarProps',
} as const;

/**
 * Type for old (deprecated) prop names
 */
export type OldPropName = keyof typeof PROP_NAME_MAPPING;

/**
 * Type for new prop names
 */
export type NewPropName = typeof PROP_NAME_MAPPING[OldPropName];
