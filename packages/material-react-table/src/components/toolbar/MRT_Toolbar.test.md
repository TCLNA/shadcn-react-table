# Toolbar Components Unit Tests

## Overview

This test suite provides comprehensive unit tests for the toolbar components in Material React Table:
- `MRT_TopToolbar`
- `MRT_BottomToolbar`
- `MRT_ToolbarAlertBanner`
- `MRT_TablePagination`

## Test Coverage

### MRT_TopToolbar Tests

**Layout and Spacing:**
- ✅ Renders with default layout (grid, items-start, min-h-[3.5rem])
- ✅ Applies fullscreen positioning (sticky top-0) when isFullScreen is true
- ✅ Renders global filter when enabled and positioned left
- ✅ Renders global filter when enabled and positioned right
- ✅ Renders toolbar internal buttons when enabled
- ✅ Renders custom actions when provided via renderTopToolbarCustomActions
- ✅ Renders pagination when enabled and positioned top
- ✅ Renders alert banner when positioned top
- ✅ Applies custom className from muiTopToolbarProps

### MRT_BottomToolbar Tests

**Layout and Spacing:**
- ✅ Renders with default layout (grid, items-start, min-h-[3.5rem])
- ✅ Applies fullscreen positioning (fixed bottom-0) when isFullScreen is true
- ✅ Renders pagination when enabled and positioned bottom
- ✅ Renders alert banner when positioned bottom
- ✅ Renders custom actions when provided via renderBottomToolbarCustomActions
- ✅ Applies custom className from muiBottomToolbarProps
- ✅ Applies shadow styling (inset top shadow)

### MRT_ToolbarAlertBanner Tests

**Alert Banner Variants:**
- ✅ Renders with default variant
- ✅ Renders with destructive variant
- ✅ Displays custom title
- ✅ Displays custom children content
- ✅ Shows selected row count when rows are selected
- ✅ Shows clear selection button when rows are selected
- ✅ Shows grouping information when columns are grouped
- ✅ Renders select checkbox when enableSelectAll and head-overlay position
- ✅ Applies custom className
- ✅ Collapsible based on showAlertBanner state
- ✅ Opens collapsible when showAlertBanner is true

### MRT_TablePagination Tests

**Pagination Controls:**
- ✅ Renders pagination with default settings
- ✅ Displays correct page info text (e.g., "1-10 of 100")
- ✅ Calls nextPage when next button is clicked
- ✅ Calls previousPage when previous button is clicked
- ✅ Calls firstPage when first page button is clicked
- ✅ Calls lastPage when last page button is clicked
- ✅ Disables back buttons on first page
- ✅ Disables forward buttons on last page
- ✅ Renders rows per page selector
- ✅ Hides rows per page selector when showRowsPerPage is false
- ✅ Calls setPageSize when page size is changed
- ✅ Renders custom rowsPerPageOptions
- ✅ Disables all controls when disabled prop is true
- ✅ Applies custom className
- ✅ Shows first/last buttons when more than 2 pages
- ✅ Does not render when paginationDisplayMode is not default
- ✅ Handles zero rows correctly
- ✅ Formats numbers according to localization

## Test Structure

### Mocking Strategy

The tests use comprehensive mocking for:
- **UI Components**: Alert, Collapsible, Select, Button, IconButton
- **Child Components**: LinearProgressBar, ToolbarDropZone, ToolbarInternalButtons, GlobalFilterTextField, SelectCheckbox
- **Hooks**: useMediaQuery (mocked to return false by default)

### Mock Table Instance

A `createMockTable` helper function creates a mock table instance with:
- State management (pagination, selection, grouping, etc.)
- Navigation methods (firstPage, previousPage, nextPage, lastPage)
- Data methods (getRowCount, getPageCount, setPageSize)
- Options (localization, feature flags, custom props)
- Refs (topToolbarRef, bottomToolbarRef, tablePaperRef)

### Test Data

Uses a simple `TestData` interface:
```typescript
interface TestData extends MRT_RowData {
  id: number;
  name: string;
  email: string;
}
```

## Running the Tests

To run these tests with vitest:

```bash
npx vitest run src/components/toolbar/MRT_Toolbar.test.tsx
```

Or to run in watch mode:

```bash
npx vitest watch src/components/toolbar/MRT_Toolbar.test.tsx
```

## Requirements Validation

These tests validate **Requirement 1.7** from the MUI to shadcn/ui migration spec:
- Toolbar components maintain equivalent functionality
- Layout and spacing work correctly with Tailwind classes
- Alert banner variants render properly
- Pagination controls function as expected
- User interactions trigger appropriate callbacks

## Notes

- Tests follow the same pattern as `MRT_EditRowModal.test.tsx`
- All tests use `@testing-library/react` for rendering and queries
- User interactions are tested with `@testing-library/user-event`
- Mocks are cleared after each test to prevent test pollution
- TypeScript strict mode is maintained throughout
