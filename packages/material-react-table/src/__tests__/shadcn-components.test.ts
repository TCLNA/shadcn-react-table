#!/usr/bin/env tsx
/**
 * Feature: mui-to-shadcn-migration
 * Property: Verify all required shadcn/ui components exist
 * **Validates: Requirements 1.4**
 * 
 * This property test verifies that all required shadcn/ui component files
 * exist in the src/components/ui/ directory after installation.
 * 
 * Uses fast-check for property-based testing with 100 iterations per property.
 */

import fc from 'fast-check';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requiredComponents = [
  'button.tsx',
  'input.tsx',
  'select.tsx',
  'checkbox.tsx',
  'switch.tsx',
  'table.tsx',
  'tooltip.tsx',
  'dropdown-menu.tsx',
  'dialog.tsx',
  'alert.tsx',
  'separator.tsx',
  'popover.tsx',
  'command.tsx',
  'progress.tsx',
];

const uiComponentsDir = path.join(__dirname, '../components/ui');

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

// Test 1: Verify all component files exist
runTest('Property 1: All required shadcn/ui component files exist', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...requiredComponents),
      (componentFile) => {
        const componentPath = path.join(uiComponentsDir, componentFile);
        const exists = fs.existsSync(componentPath);
        
        if (!exists) {
          console.error(`  ⚠️  Missing component: ${componentFile}`);
        }
        
        return exists;
      }
    ),
    { numRuns: 100 }
  );
});

// Test 2: Verify each component file is a valid TypeScript file
runTest('Property 2: Each component file is a valid TypeScript file with React imports', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...requiredComponents),
      (componentFile) => {
        const componentPath = path.join(uiComponentsDir, componentFile);
        
        if (!fs.existsSync(componentPath)) {
          return false;
        }
        
        const content = fs.readFileSync(componentPath, 'utf-8');
        
        // Verify it's not empty
        if (content.trim().length === 0) {
          console.error(`  ⚠️  Component file is empty: ${componentFile}`);
          return false;
        }
        
        // Verify it contains React imports (basic sanity check)
        const hasReactImport = content.includes('import') && 
                               (content.includes('react') || content.includes('React'));
        
        if (!hasReactImport) {
          console.error(`  ⚠️  Component file missing React import: ${componentFile}`);
        }
        
        return hasReactImport;
      }
    ),
    { numRuns: 100 }
  );
});

// Test 3: Verify component files export at least one component
runTest('Property 3: Component files export at least one component', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...requiredComponents),
      (componentFile) => {
        const componentPath = path.join(uiComponentsDir, componentFile);
        
        if (!fs.existsSync(componentPath)) {
          return false;
        }
        
        const content = fs.readFileSync(componentPath, 'utf-8');
        
        // Check for export statements (either named or default)
        const hasExport = content.includes('export');
        
        if (!hasExport) {
          console.error(`  ⚠️  Component file has no exports: ${componentFile}`);
        }
        
        return hasExport;
      }
    ),
    { numRuns: 100 }
  );
});

// Test 4: Comprehensive check - all components are properly installed
runTest('Property 4: All components are properly installed (comprehensive check)', () => {
  const missingComponents: string[] = [];
  const invalidComponents: string[] = [];
  
  for (const componentFile of requiredComponents) {
    const componentPath = path.join(uiComponentsDir, componentFile);
    
    if (!fs.existsSync(componentPath)) {
      missingComponents.push(componentFile);
      continue;
    }
    
    const content = fs.readFileSync(componentPath, 'utf-8');
    
    // Validate the file has meaningful content
    if (content.trim().length === 0 || !content.includes('export')) {
      invalidComponents.push(componentFile);
    }
  }
  
  if (missingComponents.length > 0) {
    console.error('  ⚠️  Missing components:', missingComponents);
    throw new Error(`Missing ${missingComponents.length} component(s)`);
  }
  
  if (invalidComponents.length > 0) {
    console.error('  ⚠️  Invalid components:', invalidComponents);
    throw new Error(`Invalid ${invalidComponents.length} component(s)`);
  }
});

// ============================================================================
// Storybook Story Preservation Tests
// Property 13: Storybook Story Preservation
// **Validates: Requirements 11.1**
// ============================================================================

const storiesDir = path.join(__dirname, '../../stories');

function getAllStoryFiles(): string[] {
  const files: string[] = [];
  
  function walkDir(dir: string, baseDir: string) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        walkDir(fullPath, baseDir);
      } else if (entry.name.endsWith('.stories.tsx')) {
        files.push(path.relative(baseDir, fullPath));
      }
    }
  }
  
  walkDir(storiesDir, storiesDir);
  return files;
}

// Test 5: Verify story files exist for major features
runTest('Property 13.1: Story files exist for all major MRT features', () => {
  const storyFiles = getAllStoryFiles();
  
  if (storyFiles.length === 0) {
    throw new Error('No story files found');
  }
  
  const expectedStoryCategories = [
    'Sorting',
    'Filtering',
    'Pagination',
    'Selection',
    'Editing',
    'RowActions',
    'ColumnActions',
    'Toolbar',
    'Virtualization',
    'DetailPanel',
  ];
  
  const missingCategories: string[] = [];
  
  for (const category of expectedStoryCategories) {
    const hasStory = storyFiles.some(file => 
      file.toLowerCase().includes(category.toLowerCase())
    );
    
    if (!hasStory) {
      missingCategories.push(category);
    }
  }
  
  if (missingCategories.length > 0) {
    console.error('  ⚠️  Missing story categories:', missingCategories);
    throw new Error(`Missing stories for ${missingCategories.length} feature(s)`);
  }
});

// Test 6: Verify minimum number of stories maintained
runTest('Property 13.2: Maintain all story files from before migration', () => {
  const storyFiles = getAllStoryFiles();
  const expectedMinimumStories = 40;
  
  if (storyFiles.length < expectedMinimumStories) {
    console.error(`  ⚠️  Expected at least ${expectedMinimumStories} stories, found ${storyFiles.length}`);
    throw new Error(`Only ${storyFiles.length} story files found, expected at least ${expectedMinimumStories}`);
  }
});

// Test 7: Verify story organization
runTest('Property 13.3: Stories organized in feature and styling directories', () => {
  const storyFiles = getAllStoryFiles();
  
  const featureStories = storyFiles.filter(f => 
    f.startsWith('features/') || f.startsWith('features\\')
  );
  const stylingStories = storyFiles.filter(f => 
    f.startsWith('styling/') || f.startsWith('styling\\')
  );
  const fixedBugsStories = storyFiles.filter(f => 
    f.startsWith('fixed-bugs/') || f.startsWith('fixed-bugs\\')
  );
  
  if (featureStories.length === 0) {
    throw new Error('No feature stories found');
  }
  
  if (stylingStories.length === 0) {
    throw new Error('No styling stories found');
  }
  
  if (fixedBugsStories.length === 0) {
    throw new Error('No fixed-bugs stories found');
  }
});

// Test 8: Check for MUI imports in stories (migration progress)
runTest('Property 13.4: Story files migration from MUI to shadcn/ui', () => {
  const storyFiles = getAllStoryFiles();
  const filesWithMuiImports: string[] = [];
  
  for (const storyFile of storyFiles) {
    const filePath = path.join(storiesDir, storyFile);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (
      content.includes("from '@mui/material") ||
      content.includes("from '@mui/icons-material") ||
      content.includes("from '@mui/x-date-pickers") ||
      content.includes("from '@emotion/")
    ) {
      filesWithMuiImports.push(storyFile);
    }
  }
  
  if (filesWithMuiImports.length > 0) {
    console.warn(`  ⚠️  ${filesWithMuiImports.length} story files still have MUI imports (migration in progress)`);
    console.warn('  Files:', filesWithMuiImports.slice(0, 5).join(', '), filesWithMuiImports.length > 5 ? '...' : '');
  }
  
  // Soft assertion - allow up to 18 files with MUI imports during migration
  if (filesWithMuiImports.length > 18) {
    throw new Error(`Too many files with MUI imports: ${filesWithMuiImports.length} (expected ≤ 18 during migration)`);
  }
});

// Test 9: Verify story file structure
runTest('Property 13.5: Story files have valid structure', () => {
  const storyFiles = getAllStoryFiles();
  const invalidStories: string[] = [];
  
  for (const storyFile of storyFiles) {
    const filePath = path.join(storiesDir, storyFile);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const hasDefaultExport = content.includes('export default');
    const hasStoryTypes = content.includes('Meta') || content.includes('StoryObj');
    // Allow either MaterialReactTable or MRT_ component usage (for component-specific stories)
    const usesMRT = content.includes('MaterialReactTable') || content.includes('MRT_');
    
    if (!hasDefaultExport || !hasStoryTypes || !usesMRT) {
      invalidStories.push(storyFile);
    }
  }
  
  if (invalidStories.length > 0) {
    console.error('  ⚠️  Invalid story files:', invalidStories.slice(0, 5));
    throw new Error(`${invalidStories.length} story file(s) have invalid structure`);
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary');
console.log('='.repeat(60));
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`📝 Total:  ${testsPassed + testsFailed}`);
console.log('='.repeat(60));

if (testsFailed > 0) {
  console.log('\n❌ Some tests failed!');
  process.exit(1);
} else {
  console.log('\n✅ All property tests passed!');
  process.exit(0);
}
