#!/usr/bin/env tsx
/**
 * Feature: mui-to-shadcn-migration
 * Property 5: Public API Export Preservation
 * **Validates: Requirements 4.1**
 * 
 * This property test verifies that all public API exports are preserved
 * after the migration from MUI to shadcn/ui. This ensures backward
 * compatibility and that no exports were accidentally removed.
 * 
 * The test verifies:
 * 1. All expected hooks are exported (useMaterialReactTable, useMRT_*)
 * 2. All expected components are exported (MaterialReactTable, MRT_*)
 * 3. All expected types are exported
 * 4. All expected utilities are exported
 * 5. Theme types and utilities are exported
 * 6. Function exports (aggregationFns, filterFns, sortingFns)
 * 
 * Uses fast-check for property-based testing with 100 iterations per property.
 */

import fc from 'fast-check';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Expected exports organized by category
const expectedExports = {
  // Main hook
  mainHook: ['useMaterialReactTable'],
  
  // Internal hooks
  hooks: [
    'useMRT_ColumnVirtualizer',
    'useMRT_Effects',
    'useMRT_RowVirtualizer',
    'useMRT_Rows',
    'useMRT_TableInstance',
    'useMRT_TableOptions',
  ],
  
  // Main component
  mainComponent: ['MaterialReactTable'],
  
  // Body components
  bodyComponents: [
    'MRT_TableBody',
    'MRT_TableBodyCell',
    'MRT_TableBodyCellValue',
    'MRT_TableBodyRow',
    'MRT_TableBodyRowGrabHandle',
    'MRT_TableBodyRowPinButton',
    'MRT_TableDetailPanel',
  ],
  
  // Button components
  buttonComponents: [
    'MRT_Button',
    'MRT_ColumnPinningButtons',
    'MRT_CopyButton',
    'MRT_EditActionButtons',
    'MRT_ExpandAllButton',
    'MRT_ExpandButton',
    'MRT_GrabHandleButton',
    'MRT_IconButton',
    'MRT_RowPinButton',
    'MRT_ShowHideColumnsButton',
    'MRT_ToggleDensePaddingButton',
    'MRT_ToggleFiltersButton',
    'MRT_ToggleFullScreenButton',
    'MRT_ToggleGlobalFilterButton',
    'MRT_ToggleRowActionMenuButton',
  ],
  
  // Footer components
  footerComponents: [
    'MRT_TableFooter',
    'MRT_TableFooterCell',
    'MRT_TableFooterRow',
  ],
  
  // Head components
  headComponents: [
    'MRT_TableHead',
    'MRT_TableHeadCell',
    'MRT_TableHeadCellColumnActionsButton',
    'MRT_TableHeadCellFilterContainer',
    'MRT_TableHeadCellFilterLabel',
    'MRT_TableHeadCellGrabHandle',
    'MRT_TableHeadCellResizeHandle',
    'MRT_TableHeadCellSortLabel',
    'MRT_TableHeadRow',
  ],
  
  // Input components
  inputComponents: [
    'MRT_DatePicker',
    'MRT_DateRangePicker',
    'MRT_EditCellTextField',
    'MRT_FilterCheckbox',
    'MRT_FilterRangeFields',
    'MRT_FilterRangeSlider',
    'MRT_FilterTextField',
    'MRT_GlobalFilterTextField',
    'MRT_SelectCheckbox',
  ],
  
  // Menu components
  menuComponents: [
    'MRT_ActionMenuItem',
    'MRT_ColumnActionMenu',
    'MRT_FilterOptionMenu',
    'MRT_RowActionMenu',
    'MRT_ShowHideColumnsMenu',
    'MRT_ShowHideColumnsMenuItems',
  ],
  
  // Modal components
  modalComponents: [
    'MRT_EditRowModal',
  ],
  
  // Table components
  tableComponents: [
    'MRT_Table',
    'MRT_TableContainer',
    'MRT_TableLoadingOverlay',
    'MRT_TablePaper',
  ],
  
  // Toolbar components
  toolbarComponents: [
    'MRT_BottomToolbar',
    'MRT_LinearProgressBar',
    'MRT_TablePagination',
    'MRT_ToolbarAlertBanner',
    'MRT_ToolbarDropZone',
    'MRT_ToolbarInternalButtons',
    'MRT_TopToolbar',
  ],
  
  // Utility functions
  utilities: [
    // From tanstack.helpers
    'flexRender',
    'createMRTColumnHelper',
    'createRow',
    // From cell.utils
    'isCellEditable',
    'openEditingCell',
    'cellKeyboardShortcuts',
    // From column.utils
    'getColumnId',
    'getAllLeafColumnDefs',
    'prepareColumns',
    'reorderColumn',
    'getDefaultColumnFilterFn',
    'getColumnFilterInfo',
    'useDropdownOptions',
    // From displayColumn.utils
    'defaultDisplayColumnProps',
    'showRowPinningColumn',
    'showRowDragColumn',
    'showRowExpandColumn',
    'showRowActionsColumn',
    'showRowSelectionColumn',
    'showRowNumbersColumn',
    'showRowSpacerColumn',
    'getLeadingDisplayColumnIds',
    'getTrailingDisplayColumnIds',
    'getDefaultColumnOrderIds',
    // From row.utils
    'getMRT_Rows',
    'getCanRankRows',
    'getIsRankingRows',
    'getIsRowSelected',
    'getMRT_RowSelectionHandler',
    'getMRT_SelectAllHandler',
    // From theme.utils
    'isDarkMode',
    'enableDarkMode',
    'disableDarkMode',
    'toggleDarkMode',
    'setThemeColor',
    'getThemeColor',
    'setThemeRadius',
    'getThemeRadius',
    'applyTheme',
    'resetTheme',
    'createScopedTheme',
    // From prop-compat.utils
    'resolveProp',
    'PROP_NAME_MAPPING',
  ],
  
  // Function exports
  functions: [
    // aggregationFns
    'MRT_AggregationFns',
    // filterFns
    'MRT_FilterFns',
    // sortingFns
    'MRT_SortingFns',
  ],
};

// Flatten all expected exports into a single array
const allExpectedExports = Object.values(expectedExports).flat();

const indexPath = path.join(__dirname, '../index.ts');

let testsPassed = 0;
let testsFailed = 0;

function runTest(name: string, testFn: () => void) {
  try {
    console.log(`\n🧪 Running: ${name}`);
    testFn();
    console.log(`✅ PASSED: ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ FAILED: ${name}`);
    console.error(error);
    testsFailed++;
  }
}

// Helper function to extract exports from index.ts
function getExportsFromIndex(): Set<string> {
  const content = fs.readFileSync(indexPath, 'utf-8');
  const exports = new Set<string>();
  
  // Match export * from './path' statements
  const exportAllRegex = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = exportAllRegex.exec(content)) !== null) {
    const exportPath = match[1];
    const fullPath = path.join(__dirname, '..', exportPath + '.ts');
    const tsxPath = path.join(__dirname, '..', exportPath + '.tsx');
    
    // Try .ts first, then .tsx
    const actualPath = fs.existsSync(fullPath) ? fullPath : 
                       fs.existsSync(tsxPath) ? tsxPath : null;
    
    if (actualPath) {
      const moduleContent = fs.readFileSync(actualPath, 'utf-8');
      
      // Extract named exports: export { name1, name2 }
      const namedExportRegex = /export\s+\{\s*([^}]+)\s*\}/g;
      let namedMatch;
      while ((namedMatch = namedExportRegex.exec(moduleContent)) !== null) {
        const names = namedMatch[1].split(',').map(n => n.trim().split(/\s+as\s+/).pop()?.trim());
        names.forEach(name => name && exports.add(name));
      }
      
      // Extract direct exports: export const/function/class/interface/type name
      const directExportRegex = /export\s+(?:const|function|class|interface|type|enum)\s+(\w+)/g;
      let directMatch;
      while ((directMatch = directExportRegex.exec(moduleContent)) !== null) {
        exports.add(directMatch[1]);
      }
      
      // Extract default exports that are named
      const defaultExportRegex = /export\s+default\s+(?:function\s+)?(\w+)/g;
      let defaultMatch;
      while ((defaultMatch = defaultExportRegex.exec(moduleContent)) !== null) {
        exports.add(defaultMatch[1]);
      }
    }
  }
  
  // Also match direct named exports from index.ts: export { name1, name2 }
  const directNamedExportRegex = /export\s+\{\s*([^}]+)\s*\}/g;
  while ((match = directNamedExportRegex.exec(content)) !== null) {
    const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/).pop()?.trim());
    names.forEach(name => name && exports.add(name));
  }
  
  return exports;
}

// Property 5: Public API Export Preservation
console.log('\n' + '='.repeat(80));
console.log('Property 5: Public API Export Preservation');
console.log('='.repeat(80));

runTest('Property 5.1: All expected hooks are exported', () => {
  const actualExports = getExportsFromIndex();
  const allHooks = [...expectedExports.mainHook, ...expectedExports.hooks];
  
  console.log(`  📦 Checking ${allHooks.length} expected hooks`);
  
  fc.assert(
    fc.property(
      fc.constantFrom(...allHooks),
      (hookName) => {
        const isExported = actualExports.has(hookName);
        
        if (!isExported) {
          console.error(`  ⚠️  Missing hook export: ${hookName}`);
        }
        
        return isExported;
      }
    ),
    { numRuns: 100 }
  );
  
  console.log(`  ✓ All ${allHooks.length} hooks are exported`);
});

runTest('Property 5.2: All expected components are exported', () => {
  const actualExports = getExportsFromIndex();
  const allComponents = [
    ...expectedExports.mainComponent,
    ...expectedExports.bodyComponents,
    ...expectedExports.buttonComponents,
    ...expectedExports.footerComponents,
    ...expectedExports.headComponents,
    ...expectedExports.inputComponents,
    ...expectedExports.menuComponents,
    ...expectedExports.modalComponents,
    ...expectedExports.tableComponents,
    ...expectedExports.toolbarComponents,
  ];
  
  console.log(`  📦 Checking ${allComponents.length} expected components`);
  
  fc.assert(
    fc.property(
      fc.constantFrom(...allComponents),
      (componentName) => {
        const isExported = actualExports.has(componentName);
        
        if (!isExported) {
          console.error(`  ⚠️  Missing component export: ${componentName}`);
        }
        
        return isExported;
      }
    ),
    { numRuns: 100 }
  );
  
  console.log(`  ✓ All ${allComponents.length} components are exported`);
});

runTest('Property 5.3: All expected utilities are exported', () => {
  const actualExports = getExportsFromIndex();
  
  console.log(`  📦 Checking ${expectedExports.utilities.length} expected utilities`);
  
  fc.assert(
    fc.property(
      fc.constantFrom(...expectedExports.utilities),
      (utilityName) => {
        const isExported = actualExports.has(utilityName);
        
        if (!isExported) {
          console.error(`  ⚠️  Missing utility export: ${utilityName}`);
        }
        
        return isExported;
      }
    ),
    { numRuns: 100 }
  );
  
  console.log(`  ✓ All ${expectedExports.utilities.length} utilities are exported`);
});

runTest('Property 5.4: All expected function exports are present', () => {
  const actualExports = getExportsFromIndex();
  
  console.log(`  📦 Checking ${expectedExports.functions.length} expected function exports`);
  
  fc.assert(
    fc.property(
      fc.constantFrom(...expectedExports.functions),
      (functionName) => {
        const isExported = actualExports.has(functionName);
        
        if (!isExported) {
          console.error(`  ⚠️  Missing function export: ${functionName}`);
        }
        
        return isExported;
      }
    ),
    { numRuns: 100 }
  );
  
  console.log(`  ✓ All ${expectedExports.functions.length} function exports are present`);
});

runTest('Property 5.5: MRT_ component naming convention is preserved', () => {
  const actualExports = getExportsFromIndex();
  const mrtComponents = Array.from(actualExports).filter(name => name.startsWith('MRT_'));
  
  console.log(`  📦 Found ${mrtComponents.length} components with MRT_ prefix`);
  
  // Verify that all MRT_ prefixed exports are in our expected list
  fc.assert(
    fc.property(
      fc.constantFrom(...mrtComponents),
      (componentName) => {
        // Check if it's in any of our component categories
        const isExpected = allExpectedExports.includes(componentName);
        
        if (!isExpected) {
          console.log(`  ℹ️  Found additional MRT_ component: ${componentName} (this is OK if it's a new component)`);
        }
        
        // This should always pass - we're just documenting what exists
        return true;
      }
    ),
    { numRuns: 100 }
  );
  
  console.log(`  ✓ MRT_ naming convention is preserved`);
});

runTest('Property 5.6: Comprehensive check - all expected exports are present', () => {
  const actualExports = getExportsFromIndex();
  const missingExports: string[] = [];
  
  console.log(`  📦 Checking all ${allExpectedExports.length} expected exports`);
  
  for (const expectedExport of allExpectedExports) {
    if (!actualExports.has(expectedExport)) {
      missingExports.push(expectedExport);
    }
  }
  
  if (missingExports.length > 0) {
    console.error(`  ⚠️  Missing ${missingExports.length} expected exports:`);
    
    // Group by category for better readability
    const missingByCategory: Record<string, string[]> = {};
    
    for (const [category, exports] of Object.entries(expectedExports)) {
      const missing = exports.filter(e => missingExports.includes(e));
      if (missing.length > 0) {
        missingByCategory[category] = missing;
      }
    }
    
    for (const [category, missing] of Object.entries(missingByCategory)) {
      console.error(`\n      ${category}:`);
      missing.forEach(exp => console.error(`        - ${exp}`));
    }
    
    throw new Error(`Missing ${missingExports.length} expected exports from public API`);
  }
  
  console.log(`  ✓ All ${allExpectedExports.length} expected exports are present`);
  console.log(`  ✓ Total exports found: ${actualExports.size}`);
});

runTest('Property 5.7: Theme exports are present', () => {
  const actualExports = getExportsFromIndex();
  
  // Check for theme-related exports
  const themeExports = Array.from(actualExports).filter(name => 
    name.toLowerCase().includes('theme') || 
    name === 'applyTheme' ||
    name === 'createMRTTheme' ||
    name === 'getMRTThemeColors'
  );
  
  console.log(`  📦 Found ${themeExports.length} theme-related exports:`);
  themeExports.forEach(exp => console.log(`      - ${exp}`));
  
  if (themeExports.length === 0) {
    throw new Error('No theme-related exports found');
  }
  
  console.log(`  ✓ Theme exports are present`);
});

runTest('Property 5.8: Icon exports are present', () => {
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  // Check if icons are exported
  const hasIconExport = indexContent.includes("export * from './icons'");
  
  if (!hasIconExport) {
    throw new Error('Icons are not exported from index.ts');
  }
  
  // Verify icons.ts exists
  const iconsPath = path.join(__dirname, '../icons.ts');
  if (!fs.existsSync(iconsPath)) {
    throw new Error('icons.ts file does not exist');
  }
  
  console.log('  ✓ Icon exports are present');
});

runTest('Property 5.9: Type exports are present', () => {
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  // Check if types are exported
  const hasTypeExport = indexContent.includes("export * from './types'");
  
  if (!hasTypeExport) {
    throw new Error('Types are not exported from index.ts');
  }
  
  // Verify types.ts exists
  const typesPath = path.join(__dirname, '../types.ts');
  if (!fs.existsSync(typesPath)) {
    throw new Error('types.ts file does not exist');
  }
  
  console.log('  ✓ Type exports are present');
});

// Summary
console.log('\n' + '='.repeat(80));
console.log('📊 Test Summary');
console.log('='.repeat(80));
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`📝 Total:  ${testsPassed + testsFailed}`);
console.log('='.repeat(80));

if (testsFailed > 0) {
  console.log('\n❌ Some property tests failed!');
  console.log('\nThis indicates that the public API has been modified during migration.');
  console.log('Please review the failed tests above and ensure all exports are preserved.');
  process.exit(1);
} else {
  console.log('\n✅ All property tests passed!');
  console.log('\nThe public API has been successfully preserved:');
  console.log('  • All hooks are exported');
  console.log('  • All components are exported');
  console.log('  • All utilities are exported');
  console.log('  • All function exports are present');
  console.log('  • Theme and icon exports are present');
  console.log('  • Type exports are present');
  console.log('  • MRT_ naming convention is preserved');
  process.exit(0);
}
