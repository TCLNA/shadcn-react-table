#!/usr/bin/env tsx
/**
 * Feature: mui-to-shadcn-migration
 * Property 1: Complete MUI Dependency Removal
 * Property 10: Dependency Configuration Correctness
 * **Validates: Requirements 1.1-1.3, 2.1-2.2, 7.1, 7.2, 12.1-12.9**
 * 
 * This property test verifies that:
 * 1. All source files contain zero imports from @mui/* or @emotion/* packages
 * 2. package.json contains zero @mui/* or @emotion/* packages in dependencies/peerDependencies
 * 3. package.json contains required shadcn/ui dependencies (lucide-react, tailwindcss, etc.)
 * 
 * Uses fast-check for property-based testing with 100 iterations per property.
 */

import fc from 'fast-check';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all TypeScript/TSX files in src directory
function getAllSourceFiles(dir: string): string[] {
  const files: string[] = [];
  
  function traverse(currentPath: string) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules, dist, and test directories
        if (!['node_modules', 'dist', '.next', 'storybook-static'].includes(entry.name)) {
          traverse(fullPath);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        // Skip test files for source code checks
        if (!entry.name.includes('.test.') && !entry.name.includes('.spec.')) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Parse imports from a file
function parseImports(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const imports: string[] = [];
  
  // Match import statements: import ... from 'package'
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  // Also match require statements: require('package')
  const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = requireRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

// Check if an import is from MUI or Emotion
function isMUIOrEmotionImport(importPath: string): boolean {
  return (
    importPath.startsWith('@mui/') ||
    importPath.startsWith('@emotion/')
  );
}

const srcDir = path.join(__dirname, '..');
const packageJsonPath = path.join(__dirname, '../../package.json');

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

// Property 1: Complete MUI Dependency Removal
console.log('\n' + '='.repeat(80));
console.log('Property 1: Complete MUI Dependency Removal');
console.log('='.repeat(80));

runTest('Property 1.1: No MUI or Emotion imports in any source file', () => {
  const sourceFiles = getAllSourceFiles(srcDir);
  
  if (sourceFiles.length === 0) {
    throw new Error('No source files found to test');
  }
  
  console.log(`  📁 Found ${sourceFiles.length} source files to check`);
  
  fc.assert(
    fc.property(
      fc.constantFrom(...sourceFiles),
      (filePath) => {
        const imports = parseImports(filePath);
        const muiEmotionImports = imports.filter(isMUIOrEmotionImport);
        
        if (muiEmotionImports.length > 0) {
          const relativePath = path.relative(srcDir, filePath);
          console.error(`  ⚠️  Found MUI/Emotion imports in ${relativePath}:`);
          muiEmotionImports.forEach(imp => console.error(`      - ${imp}`));
        }
        
        return muiEmotionImports.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});

runTest('Property 1.2: Comprehensive check - all source files are MUI/Emotion free', () => {
  const sourceFiles = getAllSourceFiles(srcDir);
  const filesWithMUIImports: Array<{ file: string; imports: string[] }> = [];
  
  for (const filePath of sourceFiles) {
    const imports = parseImports(filePath);
    const muiEmotionImports = imports.filter(isMUIOrEmotionImport);
    
    if (muiEmotionImports.length > 0) {
      const relativePath = path.relative(srcDir, filePath);
      filesWithMUIImports.push({
        file: relativePath,
        imports: muiEmotionImports,
      });
    }
  }
  
  if (filesWithMUIImports.length > 0) {
    console.error(`  ⚠️  Found ${filesWithMUIImports.length} file(s) with MUI/Emotion imports:`);
    filesWithMUIImports.forEach(({ file, imports }) => {
      console.error(`      ${file}:`);
      imports.forEach(imp => console.error(`        - ${imp}`));
    });
    throw new Error(`${filesWithMUIImports.length} file(s) still contain MUI/Emotion imports`);
  }
  
  console.log(`  ✓ All ${sourceFiles.length} source files are MUI/Emotion free`);
});

// Property 10: Dependency Configuration Correctness
console.log('\n' + '='.repeat(80));
console.log('Property 10: Dependency Configuration Correctness');
console.log('='.repeat(80));

runTest('Property 10.1: package.json contains zero @mui/* packages', () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
    ...packageJson.devDependencies,
  };
  
  const muiPackages = Object.keys(allDeps).filter(pkg => pkg.startsWith('@mui/'));
  
  if (muiPackages.length > 0) {
    console.error('  ⚠️  Found @mui/* packages in package.json:');
    muiPackages.forEach(pkg => console.error(`      - ${pkg}`));
  }
  
  if (muiPackages.length !== 0) {
    throw new Error(`Found ${muiPackages.length} @mui/* package(s) in package.json`);
  }
  
  console.log('  ✓ No @mui/* packages found in dependencies, peerDependencies, or devDependencies');
});

runTest('Property 10.2: package.json contains zero @emotion/* packages', () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
    ...packageJson.devDependencies,
  };
  
  const emotionPackages = Object.keys(allDeps).filter(pkg => pkg.startsWith('@emotion/'));
  
  if (emotionPackages.length > 0) {
    console.error('  ⚠️  Found @emotion/* packages in package.json:');
    emotionPackages.forEach(pkg => console.error(`      - ${pkg}`));
  }
  
  if (emotionPackages.length !== 0) {
    throw new Error(`Found ${emotionPackages.length} @emotion/* package(s) in package.json`);
  }
  
  console.log('  ✓ No @emotion/* packages found in dependencies, peerDependencies, or devDependencies');
});

runTest('Property 10.3: package.json contains tailwindcss in peerDependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  if (!packageJson.peerDependencies?.tailwindcss) {
    throw new Error('tailwindcss not found in peerDependencies');
  }
  
  console.log(`  ✓ tailwindcss found in peerDependencies: ${packageJson.peerDependencies.tailwindcss}`);
});

runTest('Property 10.4: package.json contains lucide-react in dependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  if (!packageJson.dependencies?.['lucide-react']) {
    throw new Error('lucide-react not found in dependencies');
  }
  
  console.log(`  ✓ lucide-react found in dependencies: ${packageJson.dependencies['lucide-react']}`);
});

runTest('Property 10.5: package.json contains required shadcn/ui dependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const requiredDeps = [
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
  ];
  
  const missingDeps: string[] = [];
  
  for (const dep of requiredDeps) {
    if (!packageJson.dependencies?.[dep]) {
      missingDeps.push(dep);
    }
  }
  
  if (missingDeps.length > 0) {
    console.error('  ⚠️  Missing required dependencies:');
    missingDeps.forEach(dep => console.error(`      - ${dep}`));
    throw new Error(`Missing ${missingDeps.length} required shadcn/ui dependencies`);
  }
  
  console.log('  ✓ All required shadcn/ui dependencies found:');
  requiredDeps.forEach(dep => {
    console.log(`      - ${dep}: ${packageJson.dependencies[dep]}`);
  });
});

runTest('Property 10.6: package.json contains required Radix UI dependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const requiredRadixDeps = [
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-popover',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-tooltip',
  ];
  
  const missingDeps: string[] = [];
  
  for (const dep of requiredRadixDeps) {
    if (!packageJson.dependencies?.[dep]) {
      missingDeps.push(dep);
    }
  }
  
  if (missingDeps.length > 0) {
    console.error('  ⚠️  Missing required Radix UI dependencies:');
    missingDeps.forEach(dep => console.error(`      - ${dep}`));
    throw new Error(`Missing ${missingDeps.length} required Radix UI dependencies`);
  }
  
  console.log(`  ✓ All ${requiredRadixDeps.length} required Radix UI dependencies found`);
});

runTest('Property 10.7: package.json contains date picker dependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const dateDeps = ['react-day-picker', 'date-fns'];
  const missingDeps: string[] = [];
  
  for (const dep of dateDeps) {
    if (!packageJson.dependencies?.[dep]) {
      missingDeps.push(dep);
    }
  }
  
  if (missingDeps.length > 0) {
    console.error('  ⚠️  Missing date picker dependencies:');
    missingDeps.forEach(dep => console.error(`      - ${dep}`));
    throw new Error(`Missing ${missingDeps.length} date picker dependencies`);
  }
  
  console.log('  ✓ Date picker dependencies found:');
  dateDeps.forEach(dep => {
    console.log(`      - ${dep}: ${packageJson.dependencies[dep]}`);
  });
});

runTest('Property 10.8: Property-based test - verify dependency consistency', () => {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const bannedPackages = [
    '@mui/material',
    '@mui/icons-material',
    '@mui/x-date-pickers',
    '@emotion/react',
    '@emotion/styled',
  ];
  
  fc.assert(
    fc.property(
      fc.constantFrom(...bannedPackages),
      (bannedPkg) => {
        const allDeps = {
          ...packageJson.dependencies,
          ...packageJson.peerDependencies,
          ...packageJson.devDependencies,
        };
        
        const found = bannedPkg in allDeps;
        
        if (found) {
          console.error(`  ⚠️  Banned package found: ${bannedPkg}`);
        }
        
        return !found;
      }
    ),
    { numRuns: 100 }
  );
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
  console.log('\nThis indicates that the MUI to shadcn/ui migration is not yet complete.');
  console.log('Please review the failed tests above and complete the migration steps.');
  process.exit(1);
} else {
  console.log('\n✅ All property tests passed!');
  console.log('\nThe dependency migration is complete:');
  console.log('  • All source files are free of MUI and Emotion imports');
  console.log('  • package.json has been properly updated with shadcn/ui dependencies');
  console.log('  • All required dependencies are present and correctly configured');
  process.exit(0);
}
