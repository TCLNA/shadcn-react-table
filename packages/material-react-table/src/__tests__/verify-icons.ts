/**
 * Simple verification script for icon mapping
 * Run with: npx tsx src/__tests__/verify-icons.ts
 */

import { MRT_Default_Icons, getIcon, mergeIcons } from '../icons';

console.log('🔍 Verifying icon mapping...\n');

// Test 1: Check all icons are defined
console.log('✓ Test 1: Checking all icons are defined');
const expectedIcons = [
  'ArrowDownwardIcon',
  'ArrowUpwardIcon',
  'ArrowRightIcon',
  'ChevronLeftIcon',
  'ChevronRightIcon',
  'ExpandMoreIcon',
  'CancelIcon',
  'CloseIcon',
  'SaveIcon',
  'EditIcon',
  'DeleteIcon',
  'AddIcon',
  'RemoveIcon',
  'FilterListIcon',
  'FilterAltIcon',
  'FilterListOffIcon',
  'SearchIcon',
  'SearchOffIcon',
  'SortIcon',
  'SyncAltIcon',
  'VisibilityIcon',
  'VisibilityOffIcon',
  'ViewColumnIcon',
  'DensityLargeIcon',
  'DensityMediumIcon',
  'DensitySmallIcon',
  'DragHandleIcon',
  'DragIndicatorIcon',
  'FirstPageIcon',
  'LastPageIcon',
  'KeyboardDoubleArrowDownIcon',
  'FullscreenIcon',
  'FullscreenExitIcon',
  'MoreVertIcon',
  'MoreHorizIcon',
  'ContentCopy',
  'PushPinIcon',
  'RestartAltIcon',
  'ClearAllIcon',
  'DynamicFeedIcon',
];

let allIconsPresent = true;
expectedIcons.forEach((iconName) => {
  if (!MRT_Default_Icons[iconName as keyof typeof MRT_Default_Icons]) {
    console.error(`  ✗ Missing icon: ${iconName}`);
    allIconsPresent = false;
  }
});

if (allIconsPresent) {
  console.log(`  ✓ All ${expectedIcons.length} expected icons are present\n`);
} else {
  console.error('  ✗ Some icons are missing\n');
  process.exit(1);
}

// Test 2: Check all icons are valid React components
console.log('✓ Test 2: Checking all icons are valid React components');
let allAreComponents = true;
Object.entries(MRT_Default_Icons).forEach(([name, icon]) => {
  // lucide-react icons are forwardRef objects with $$typeof symbol
  const isValidComponent = typeof icon === 'function' || (typeof icon === 'object' && icon !== null);
  if (!isValidComponent) {
    console.error(`  ✗ ${name} is not a valid component`);
    allAreComponents = false;
  }
});

if (allAreComponents) {
  console.log(`  ✓ All icons are valid React components\n`);
} else {
  console.error('  ✗ Some icons are not valid components\n');
  process.exit(1);
}

// Test 3: Test getIcon utility
console.log('✓ Test 3: Testing getIcon utility');
const defaultIcon = getIcon('SearchIcon');
if (defaultIcon === MRT_Default_Icons.SearchIcon) {
  console.log('  ✓ getIcon returns default icon correctly');
} else {
  console.error('  ✗ getIcon failed to return default icon');
  process.exit(1);
}

const CustomIcon = () => null;
const customIcon = getIcon('SearchIcon', { SearchIcon: CustomIcon });
if (customIcon === CustomIcon) {
  console.log('  ✓ getIcon returns custom icon correctly\n');
} else {
  console.error('  ✗ getIcon failed to return custom icon\n');
  process.exit(1);
}

// Test 4: Test mergeIcons utility
console.log('✓ Test 4: Testing mergeIcons utility');
const merged = mergeIcons({ SearchIcon: CustomIcon });
if (merged.SearchIcon === CustomIcon && merged.SaveIcon === MRT_Default_Icons.SaveIcon) {
  console.log('  ✓ mergeIcons correctly merges custom and default icons\n');
} else {
  console.error('  ✗ mergeIcons failed to merge correctly\n');
  process.exit(1);
}

// Test 5: Check naming convention
console.log('✓ Test 5: Checking naming convention');
const iconNames = Object.keys(MRT_Default_Icons);
let allNamesValid = true;
iconNames.forEach((name) => {
  const isValidName = name.endsWith('Icon') || name === 'ContentCopy';
  if (!isValidName) {
    console.error(`  ✗ Invalid icon name: ${name}`);
    allNamesValid = false;
  }
});

if (allNamesValid) {
  console.log('  ✓ All icon names follow MUI naming convention\n');
} else {
  console.error('  ✗ Some icon names do not follow convention\n');
  process.exit(1);
}

console.log('✅ All icon mapping tests passed!');
console.log(`\n📊 Summary:`);
console.log(`   - Total icons: ${Object.keys(MRT_Default_Icons).length}`);
console.log(`   - All icons are valid React components`);
console.log(`   - Utility functions work correctly`);
console.log(`   - Naming convention is maintained`);
