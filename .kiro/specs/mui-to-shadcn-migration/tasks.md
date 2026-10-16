# Implementation Plan: MUI to shadcn/ui Migration

## Overview

This plan outlines the systematic migration of Material React Table from Material UI V6 to shadcn/ui with Tailwind CSS. The migration follows a phased approach: setup dependencies, migrate components by category, update styling, migrate examples and documentation, and validate the complete migration. Each phase builds incrementally to maintain a working codebase throughout the process.

## Tasks

- [x] 1. Setup shadcn/ui and Tailwind infrastructure
  - Install shadcn/ui CLI and initialize configuration
  - Install Tailwind CSS, PostCSS, and Autoprefixer
  - Create tailwind.config.ts with MRT design tokens (colors, spacing, typography)
  - Create postcss.config.js for Tailwind processing
  - Install lucide-react for icons
  - Install react-day-picker and date-fns for date picking
  - Install class-variance-authority, clsx, and tailwind-merge for utility functions
  - Update Rollup config to process Tailwind CSS with PostCSS plugin
  - Create src/lib/utils.ts with cn() utility function
  - _Requirements: 2.4, 7.2, 7.3, 12.2_

- [x] 2. Install core shadcn/ui components
  - [x] 2.1 Install base shadcn/ui components using CLI
    - Run `npx shadcn-ui@latest add button input select checkbox switch table tooltip dropdown-menu dialog alert separator popover command progress`
    - Verify components are created in src/components/ui/
    - _Requirements: 1.4, 14.1-14.13_
  
  - [x] 2.2 Write property test for shadcn component installation
    - **Property: Verify all required shadcn/ui components exist**
    - **Validates: Requirements 1.4**

- [x] 3. Create icon mapping and utilities
  - Create src/icons.ts with mapping from MUI icon names to lucide-react icons
  - Map all commonly used MUI icons to lucide equivalents (ArrowDownward→ArrowDown, FilterList→Filter, etc.)
  - Export icon components with consistent naming
  - Create utility function for dynamic icon selection
  - Document icon mapping in migration guide
  - _Requirements: 15.1, 15.4_

- [x] 4. Migrate table structure components (src/components/table/)
  - [x] 4.1 Migrate MRT_TableContainer component
    - Replace MUI TableContainer with div + Tailwind classes
    - Implement scrolling behavior with overflow utilities
    - Maintain maxHeight prop functionality
    - _Requirements: 1.7, 14.13_
  
  - [x] 4.2 Migrate MRT_TablePaper component
    - Replace MUI Paper with div + Tailwind border/shadow classes
    - Implement elevation variants using shadow utilities
    - Maintain theme integration for background colors
    - _Requirements: 1.7, 14.13_
  
  - [x] 4.3 Migrate MRT_Table component
    - Replace MUI Table with shadcn/ui Table component
    - Update className props to use Tailwind utilities
    - Maintain table layout and sizing props
    - _Requirements: 1.7, 14.1_
  
  - [x] 4.4 Migrate MRT_TableHead and MRT_TableBody components
    - Replace MUI TableHead/TableBody with shadcn/ui equivalents
    - Update styling to use Tailwind classes
    - _Requirements: 1.7, 14.1_
  
  - [x] 4.5 Migrate MRT_TableRow component
    - Replace MUI TableRow with shadcn/ui TableRow
    - Migrate hover, selected, and striped row styles to Tailwind
    - Implement conditional styling with cn() utility
    - _Requirements: 1.7, 14.1_
  
  - [ ]* 4.6 Write unit tests for table structure components
    - Test TableContainer scrolling behavior
    - Test TablePaper elevation variants
    - Test TableRow conditional styling
    - _Requirements: 1.7_

- [x] 5. Migrate table head components (src/components/head/)
  - [x] 5.1 Migrate MRT_TableHeadCell component
    - Replace MUI TableCell with shadcn/ui TableCell
    - Migrate padding, alignment, and border styles to Tailwind
    - Update sort indicator styling
    - _Requirements: 1.7, 14.1_
  
  - [x] 5.2 Migrate MRT_TableHeadCellFilterContainer component
    - Replace MUI Box with div + Tailwind flex utilities
    - Update filter input styling
    - _Requirements: 1.7_
  
  - [x] 5.3 Migrate MRT_TableHeadCellSortLabel component
    - Replace MUI TableSortLabel with custom component using shadcn Button
    - Implement sort icons using lucide-react (ArrowUp, ArrowDown)
    - Migrate hover and active states to Tailwind
    - _Requirements: 1.7, 15.1_
  
  - [ ]* 5.4 Write unit tests for table head components
    - Test sort label click behavior
    - Test filter container rendering
    - _Requirements: 1.7_

- [x] 6. Migrate table body components (src/components/body/)
  - [x] 6.1 Migrate MRT_TableBodyCell component
    - Replace MUI TableCell with shadcn/ui TableCell
    - Migrate cell padding and alignment to Tailwind
    - Update edit mode styling
    - _Requirements: 1.7, 14.1_
  
  - [x] 6.2 Migrate MRT_TableBodyRow component
    - Replace MUI TableRow with shadcn/ui TableRow
    - Implement row selection styling with Tailwind
    - Update hover and focus states
    - _Requirements: 1.7, 14.1_
  
  - [x] 6.3 Migrate MRT_TableDetailPanel component
    - Replace MUI Collapse with shadcn/ui Collapsible
    - Update expansion animation
    - Migrate panel styling to Tailwind
    - _Requirements: 1.7, 14.5_
  
  - [ ]* 6.4 Write unit tests for table body components
    - Test cell rendering with different data types
    - Test row selection styling
    - Test detail panel expansion
    - _Requirements: 1.7_

- [x] 7. Migrate button components (src/components/buttons/)
  - [x] 7.1 Create MRT_Button wrapper component
    - Wrap shadcn/ui Button with MRT-specific props
    - Add startIcon and endIcon prop support
    - Map MUI button variants to shadcn variants (contained→default, outlined→outline, text→ghost)
    - _Requirements: 1.7, 14.1_
  
  - [x] 7.2 Create MRT_IconButton wrapper component
    - Use shadcn/ui Button with variant="ghost" and size="icon"
    - Implement tooltip integration
    - Migrate icon sizing
    - _Requirements: 1.7, 14.8_
  
  - [x] 7.3 Migrate all button usage components
    - Update MRT_ExpandButton, MRT_CopyButton, MRT_ToggleFiltersButton, etc.
    - Replace MUI IconButton with MRT_IconButton
    - Update icon imports to lucide-react
    - _Requirements: 1.7, 15.1_
  
  - [ ]* 7.4 Write unit tests for button components
    - Test button variant mapping
    - Test icon placement (startIcon, endIcon)
    - Test disabled state
    - _Requirements: 1.7_

- [x] 8. Migrate input components (src/components/inputs/)
  - [x] 8.1 Migrate MRT_FilterTextField component
    - Replace MUI TextField with shadcn/ui Input
    - Add search icon using lucide-react
    - Implement clear button functionality
    - Migrate focus and error states to Tailwind
    - _Requirements: 1.7, 14.2, 15.1_
  
  - [x] 8.2 Migrate MRT_FilterRangeFields component
    - Replace MUI TextField with shadcn/ui Input
    - Update layout with Tailwind flex utilities
    - _Requirements: 1.7, 14.2_
  
  - [x] 8.3 Migrate MRT_SelectCheckbox component
    - Replace MUI Checkbox with shadcn/ui Checkbox
    - Update checked and indeterminate states
    - Migrate label styling to Tailwind
    - _Requirements: 1.7, 14.3_
  
  - [x] 8.4 Migrate MRT_FilterCheckbox component
    - Replace MUI Checkbox with shadcn/ui Checkbox
    - Update filter-specific styling
    - _Requirements: 1.7, 14.3_
  
  - [x] 8.5 Migrate MRT_EditCellTextField component
    - Replace MUI TextField with shadcn/ui Input
    - Implement inline editing styles
    - Handle validation states
    - _Requirements: 1.7, 14.2_
  
  - [ ]* 8.6 Write unit tests for input components
    - Test filter text input with clear button
    - Test checkbox checked/indeterminate states
    - Test edit cell validation
    - _Requirements: 1.7_

- [x] 9. Migrate select and autocomplete components
  - [x] 9.1 Migrate MRT_FilterSelect component
    - Replace MUI Select with shadcn/ui Select
    - Update dropdown styling with Tailwind
    - Implement multi-select variant if needed
    - _Requirements: 1.7, 14.3_
  
  - [x] 9.2 Create custom autocomplete component
    - Build using shadcn/ui Command + Popover + Input
    - Implement search/filter functionality
    - Add keyboard navigation
    - Style with Tailwind
    - _Requirements: 1.7, 14.13_
  
  - [x] 9.3 Write unit tests for select components
    - Test select dropdown opening/closing
    - Test autocomplete search functionality
    - Test keyboard navigation
    - _Requirements: 1.7_

- [x] 10. Migrate menu components (src/components/menus/)
  - [x] 10.1 Migrate MRT_ColumnActionMenu component
    - Replace MUI Menu with shadcn/ui DropdownMenu
    - Update menu items with DropdownMenuItem
    - Migrate menu styling to Tailwind
    - _Requirements: 1.7, 14.5_
  
  - [x] 10.2 Migrate MRT_RowActionMenu component
    - Replace MUI Menu with shadcn/ui DropdownMenu
    - Update action items styling
    - Implement icon support with lucide-react
    - _Requirements: 1.7, 14.5, 15.1_
  
  - [x] 10.3 Migrate MRT_ShowHideColumnsMenu component
    - Replace MUI Menu with shadcn/ui DropdownMenu
    - Update checkbox items
    - Implement search functionality
    - _Requirements: 1.7, 14.5_
  
  - [x] 10.4 Write unit tests for menu components
    - Test menu opening/closing
    - Test menu item selection
    - Test column visibility toggling
    - _Requirements: 1.7_

- [x] 11. Migrate modal components (src/components/modals/)
  - [x] 11.1 Migrate MRT_EditRowModal component
    - Replace MUI Dialog with shadcn/ui Dialog
    - Update DialogTitle, DialogContent, DialogFooter
    - Migrate form styling to Tailwind
    - Update action buttons
    - _Requirements: 1.7, 14.6_
  
  - [x] 11.2 Write unit tests for modal components
    - Test modal opening/closing
    - Test form submission
    - Test cancel behavior
    - _Requirements: 1.7_

- [x] 12. Migrate toolbar components (src/components/toolbar/)
  - [x] 12.1 Migrate MRT_TopToolbar component
    - Replace MUI Toolbar with div + Tailwind flex utilities
    - Update spacing and alignment with Tailwind
    - Migrate background and border styles
    - _Requirements: 1.7, 14.10_
  
  - [x] 12.2 Migrate MRT_BottomToolbar component
    - Replace MUI Toolbar with div + Tailwind flex utilities
    - Update pagination controls styling
    - _Requirements: 1.7, 14.10_
  
  - [x] 12.3 Migrate MRT_ToolbarAlertBanner component
    - Replace MUI Alert with shadcn/ui Alert
    - Update alert variants (info, warning, error, success)
    - Migrate icon styling
    - _Requirements: 1.7, 14.12, 15.1_
  
  - [x] 12.4 Migrate MRT_TablePagination component
    - Replace MUI TablePagination with custom component
    - Use shadcn/ui Select for rows per page
    - Use shadcn/ui Button for navigation
    - Implement page info display
    - _Requirements: 1.7, 14.1_
  
  - [x] 12.5 Write unit tests for toolbar components
    - Test toolbar layout and spacing
    - Test alert banner variants
    - Test pagination controls
    - _Requirements: 1.7_

- [x] 13. Migrate feedback components
  - [x] 13.1 Migrate MRT_LinearProgressBar component
    - Replace MUI LinearProgress with shadcn/ui Progress
    - Update progress bar styling
    - Implement indeterminate state
    - _Requirements: 1.7, 14.11_
  
  - [x] 13.2 Migrate MRT_TableLoadingOverlay component
    - Create custom loading spinner or use shadcn/ui spinner
    - Replace MUI CircularProgress with lucide-react Loader2 icon
    - Update overlay styling with Tailwind
    - _Requirements: 1.7, 14.11, 15.1_
  
  - [x] 13.3 Write unit tests for feedback components
    - Test progress bar rendering
    - Test loading overlay display
    - _Requirements: 1.7_

- [x] 14. Migrate date picker integration
  - [x] 14.1 Create MRT_DatePicker component
    - Build using react-day-picker + shadcn/ui Calendar
    - Wrap in Popover with Input trigger
    - Format dates using date-fns
    - Style with Tailwind
    - _Requirements: 16.1, 16.2_
  
  - [x] 14.2 Create MRT_DateRangePicker component
    - Implement date range selection
    - Add preset buttons (Today, Last 7 days, etc.)
    - Style consistently with single date picker
    - _Requirements: 16.3_
  
  - [x] 14.3 Integrate date pickers into filter components
    - Update MRT_FilterDatePicker to use new component
    - Update MRT_FilterDateRangePicker to use new component
    - _Requirements: 16.2, 16.3_
  
  - [x] 14.4 Write unit tests for date picker components
    - Test date selection
    - Test date range selection
    - Test preset buttons
    - _Requirements: 16.1-16.3_

- [x] 15. Update theme system and styling utilities
  - [x] 15.1 Create theme configuration system
    - Define MRTThemeConfig interface
    - Create default theme values in tailwind.config.ts
    - Implement theme extension mechanism
    - Document theme customization API
    - _Requirements: 3.1, 3.2, 3.4_
  
  - [x] 15.2 Create CSS variable system for dynamic theming
    - Define CSS variables for colors in global CSS
    - Implement light/dark mode variable switching
    - Update Tailwind config to use CSS variables
    - _Requirements: 3.2, 3.3_
  
  - [x] 15.3 Migrate src/styles/ utilities
    - Update or remove Emotion-based utilities
    - Create Tailwind-based utility functions
    - Update theme helper functions
    - _Requirements: 2.3, 2.5_
  
  - [x] 15.4 Write unit tests for theme system
    - Test theme merging
    - Test CSS variable application
    - Test dark mode switching
    - _Requirements: 3.1-3.4_

- [x] 16. Update public API and prop interfaces
  - [x] 16.1 Rename MUI-specific props
    - Rename muiTableProps to tableProps
    - Rename muiTableHeadCellProps to tableHeadCellProps
    - Rename all mui* prefixed props
    - Maintain backward compatibility with deprecated prop names
    - _Requirements: 4.4, 4.6_
  
  - [x] 16.2 Update type definitions in src/types.ts
    - Update component prop types to reference shadcn/ui components
    - Maintain generic type parameters
    - Update JSDoc comments
    - _Requirements: 4.2, 10.2, 10.7_
  
  - [x] 16.3 Update src/index.ts exports
    - Verify all exports are maintained
    - Add deprecation notices for renamed props
    - Export new theme types
    - _Requirements: 4.1, 10.3_
  
  - [x] 16.4 Write property test for API preservation
    - **Property 5: Public API Export Preservation**
    - **Validates: Requirements 4.1**

- [x] 17. Remove MUI and Emotion dependencies
  - [x] 17.1 Remove all MUI imports from src/
    - Search and replace @mui/material imports
    - Search and replace @mui/icons-material imports
    - Search and replace @mui/x-date-pickers imports
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 17.2 Remove all Emotion imports from src/
    - Search and replace @emotion/react imports
    - Search and replace @emotion/styled imports
    - Remove styled component definitions
    - _Requirements: 2.1, 2.2_
  
  - [x] 17.3 Update package.json dependencies
    - Remove @mui/* packages from dependencies and peerDependencies
    - Remove @emotion/* packages from dependencies and peerDependencies
    - Add tailwindcss to peerDependencies
    - Add lucide-react to dependencies
    - _Requirements: 7.1, 7.2, 12.1-12.9_
  
  - [x] 17.4 Write property tests for dependency removal
    - **Property 1: Complete MUI Dependency Removal**
    - **Property 10: Dependency Configuration Correctness**
    - **Validates: Requirements 1.1-1.3, 2.1-2.2, 7.1, 7.2, 12.1-12.9**

- [x] 18. Checkpoint - Ensure library builds and core tests pass
  - Run `pnpm lib:build` and verify successful build
  - Run TypeScript type checking with `tsc --noEmit`
  - Run linting with `pnpm lint`
  - Run property tests for dependency removal and API preservation
  - Verify Storybook starts without errors
  - Ask the user if questions arise

- [x] 19. Migrate Storybook stories
  - [x] 19.1 Update Storybook configuration for Tailwind
    - Add Tailwind CSS import to .storybook/preview.tsx
    - Configure PostCSS in Storybook
    - Update theme decorator if needed
    - _Requirements: 20.2_
  
  - [x] 19.2 Update all story files in stories/
    - Replace MUI component usage with shadcn/ui
    - Update styling examples to use Tailwind
    - Verify all stories render correctly
    - _Requirements: 11.1_
  
  - [x] 19.3 Write property test for Storybook story preservation
    - **Property 13: Storybook Story Preservation**
    - **Validates: Requirements 11.1**

- [ ] 20. Migrate example suite (apps/material-react-table-docs/examples/)
  - [~] 20.1 Migrate basic examples
    - Update examples/basic/ files
    - Replace MUI imports with shadcn/ui
    - Update custom styling to Tailwind
    - _Requirements: 8.1, 8.2_
  
  - [~] 20.2 Migrate advanced examples
    - Update examples/advanced/ files
    - Replace MUI components
    - Update complex styling patterns
    - _Requirements: 8.1, 8.2_
  
  - [~] 20.3 Migrate editing/CRUD examples
    - Update examples/editing-crud-*/ files
    - Replace form components with shadcn/ui
    - Update modal and dialog usage
    - _Requirements: 8.1, 8.2_
  
  - [~] 20.4 Migrate localization examples
    - Update examples/localization-i18n-*/ files
    - Verify locale integration still works
    - _Requirements: 8.1, 8.2_
  
  - [~] 20.5 Migrate remaining example categories
    - Update all other example directories
    - Ensure consistent styling across examples
    - _Requirements: 8.1, 8.2_
  
  - [~] 20.6 Write property tests for example suite
    - **Property 2: Example Suite MUI Removal**
    - **Property 7: Example File Organization Preservation**
    - **Validates: Requirements 8.1, 8.4**

- [ ] 21. Migrate documentation site (apps/material-react-table-docs/)
  - [~] 21.1 Setup Tailwind in documentation site
    - Install Tailwind CSS in docs package
    - Create tailwind.config.ts for docs
    - Add Tailwind directives to global CSS
    - Configure dark mode
    - _Requirements: 9.3, 9.7_
  
  - [~] 21.2 Migrate documentation site components
    - Update components/navigation/ to use shadcn/ui
    - Update components/mdx/ to use shadcn/ui
    - Update components/prop-tables/ styling
    - _Requirements: 9.2_
  
  - [~] 21.3 Update documentation site pages
    - Update pages/docs/ MDX files
    - Update pages/api/ files
    - Update homepage and blog pages
    - Remove MUI theme provider
    - _Requirements: 9.4_
  
  - [~] 21.4 Update documentation site styling
    - Migrate styles/ to Tailwind
    - Update global styles
    - Implement dark mode toggle
    - _Requirements: 9.3, 9.7_
  
  - [~] 21.5 Write property tests for documentation site
    - **Property 3: Documentation Site MUI Removal**
    - **Property 8: Documentation Page Preservation**
    - **Property 9: Documentation URL Structure Preservation**
    - **Validates: Requirements 9.1, 9.4, 9.6**

- [ ] 22. Create migration guide documentation
  - [~] 22.1 Create migration guide page
    - Create pages/docs/guides/migrating-to-shadcn.mdx
    - Document breaking changes
    - Document prop renames (mui* → regular names)
    - _Requirements: 13.1, 13.2_
  
  - [~] 22.2 Document theme migration
    - Provide MUI theme → Tailwind config examples
    - Document CSS variable usage
    - Show dark mode setup
    - _Requirements: 13.4_
  
  - [~] 22.3 Document styling migration
    - Show Emotion → Tailwind conversion examples
    - Document className customization patterns
    - Provide common styling recipes
    - _Requirements: 13.5_
  
  - [~] 22.4 Create migration checklist
    - List all migration steps for users
    - Provide code snippets for common scenarios
    - Link to relevant documentation sections
    - _Requirements: 13.6_
  
  - [~] 22.5 Document icon mapping
    - Create table of MUI icon → lucide-react mappings
    - Show how to override icons
    - _Requirements: 15.4_

- [ ] 23. Update build configuration and scripts
  - [~] 23.1 Verify Rollup configuration
    - Ensure PostCSS plugin is correctly configured
    - Verify Tailwind styles are bundled
    - Test tree-shaking of unused Tailwind classes
    - _Requirements: 7.3_
  
  - [~] 23.2 Verify locale build script
    - Run build-locales.mjs script
    - Verify locale files are generated correctly
    - Check output format and location
    - _Requirements: 6.4, 6.5, 7.7_
  
  - [~] 23.3 Update package.json scripts if needed
    - Verify all build scripts work
    - Update any MUI-specific scripts
    - _Requirements: 7.4_
  
  - [~] 23.4 Write property test for bundle size
    - **Property 11: Bundle Size Compliance**
    - **Validates: Requirements 7.5, 11.7**

- [ ] 24. Comprehensive testing and validation
  - [~] 24.1 Run all property-based tests
    - Execute all 13 property tests with 100 iterations each
    - Verify all tests pass
    - Fix any failures
    - _Requirements: All testable requirements_
  
  - [~] 24.2 Run unit test suite
    - Execute all unit tests
    - Verify coverage meets threshold
    - Fix any failures
    - _Requirements: 11.2_
  
  - [~] 24.3 Run integration tests
    - Test all 40+ features manually or with integration tests
    - Verify sorting, filtering, pagination work correctly
    - Test editing modes, row selection, expansion
    - Test virtualization, drag-and-drop
    - _Requirements: 5.1-5.10_
  
  - [~] 24.4 Perform visual regression testing
    - Compare Storybook screenshots before/after migration
    - Review and approve intentional visual changes
    - Fix unintended regressions
    - _Requirements: 11.1_
  
  - [~] 24.5 Test SSR compatibility
    - Build and run documentation site
    - Verify no hydration errors
    - Test in production mode
    - _Requirements: 19.1-19.5_
  
  - [~] 24.6 Verify TypeScript compilation
    - Run `tsc --noEmit` in strict mode
    - Verify zero errors
    - Check type inference works correctly
    - _Requirements: 10.1, 10.6_
  
  - [~] 24.7 Run linting and formatting
    - Run `pnpm lint` and fix any issues
    - Run `pnpm format` to ensure consistent formatting
    - _Requirements: 11.2, 11.3_
  
  - [~] 24.8 Verify bundle size
    - Run `pnpm size` to check bundle sizes
    - Ensure CJS ≤ 55KB and ESM ≤ 51KB gzipped
    - Optimize if needed
    - _Requirements: 7.5, 11.7_

- [ ] 25. Final checkpoint and documentation updates
  - [~] 25.1 Update README.md
    - Update installation instructions
    - Update peer dependency requirements
    - Add Tailwind CSS setup instructions
    - Update examples to show shadcn/ui usage
    - _Requirements: 12.9_
  
  - [~] 25.2 Update CHANGELOG.md
    - Document all breaking changes
    - List new features (Tailwind support, shadcn/ui)
    - List deprecated features (MUI-specific props)
    - Provide migration guide link
    - _Requirements: 13.1_
  
  - [~] 25.3 Update package.json metadata
    - Update description if needed
    - Update keywords (add "tailwind", "shadcn")
    - Update repository and homepage URLs
    - _Requirements: 12.9_
  
  - [~] 25.4 Create release notes
    - Summarize major changes
    - Highlight benefits (smaller bundle, modern styling)
    - Link to migration guide
    - Thank contributors
    - _Requirements: 13.1_
  
  - [~] 25.5 Final validation
    - Build library: `pnpm lib:build`
    - Build docs: `pnpm docs:build`
    - Build Storybook: `pnpm storybook:build`
    - Verify all builds succeed
    - Run all tests one final time
    - _Requirements: 11.5, 11.6_

- [~] 26. Final checkpoint - Ensure all tests pass
  - Ensure all property tests pass (100 iterations each)
  - Ensure all unit tests pass
  - Ensure all integration tests pass
  - Ensure bundle size is within limits
  - Ensure documentation site builds and deploys successfully
  - Ensure Storybook builds successfully
  - Ask the user if questions arise

## Notes

- Each task references specific requirements for traceability
- The migration is organized by component category to maintain working code at each step
- Checkpoints ensure validation before proceeding to next phase
- Property tests validate universal correctness properties across all files
- Unit tests validate specific component behavior and edge cases
- Integration tests validate feature parity with pre-migration version
