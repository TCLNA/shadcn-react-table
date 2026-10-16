/**
 * Unit tests for icon mapping and utilities
 * 
 * Tests verify that:
 * - All required icons are mapped
 * - Icon utility functions work correctly
 * - Icon names maintain backward compatibility
 */

import { describe, it, expect } from 'vitest';
import { MRT_Default_Icons, getIcon, mergeIcons, type MRT_Icons } from '../icons';

describe('Icon Mapping', () => {
  it('should export all required default icons', () => {
    // Verify all expected icon names exist
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

    expectedIcons.forEach((iconName) => {
      expect(MRT_Default_Icons).toHaveProperty(iconName);
      expect(MRT_Default_Icons[iconName as keyof typeof MRT_Default_Icons]).toBeDefined();
    });
  });

  it('should have all icons as functions (React components)', () => {
    Object.values(MRT_Default_Icons).forEach((icon) => {
      expect(typeof icon).toBe('function');
    });
  });
});

describe('getIcon utility', () => {
  it('should return default icon when no custom icons provided', () => {
    const icon = getIcon('SearchIcon');
    expect(icon).toBe(MRT_Default_Icons.SearchIcon);
  });

  it('should return custom icon when provided', () => {
    const CustomIcon = () => null;
    const customIcons: Partial<MRT_Icons> = {
      SearchIcon: CustomIcon,
    };
    
    const icon = getIcon('SearchIcon', customIcons);
    expect(icon).toBe(CustomIcon);
  });

  it('should return default icon when custom icons object does not contain the requested icon', () => {
    const CustomIcon = () => null;
    const customIcons: Partial<MRT_Icons> = {
      FilterListIcon: CustomIcon,
    };
    
    const icon = getIcon('SearchIcon', customIcons);
    expect(icon).toBe(MRT_Default_Icons.SearchIcon);
  });
});

describe('mergeIcons utility', () => {
  it('should return all default icons when no custom icons provided', () => {
    const icons = mergeIcons();
    expect(icons).toEqual(MRT_Default_Icons);
  });

  it('should merge custom icons with defaults', () => {
    const CustomSearchIcon = () => null;
    const CustomFilterIcon = () => null;
    const customIcons: Partial<MRT_Icons> = {
      SearchIcon: CustomSearchIcon,
      FilterListIcon: CustomFilterIcon,
    };
    
    const icons = mergeIcons(customIcons);
    
    // Custom icons should be present
    expect(icons.SearchIcon).toBe(CustomSearchIcon);
    expect(icons.FilterListIcon).toBe(CustomFilterIcon);
    
    // Default icons should still be present
    expect(icons.SaveIcon).toBe(MRT_Default_Icons.SaveIcon);
    expect(icons.EditIcon).toBe(MRT_Default_Icons.EditIcon);
  });

  it('should override only specified icons', () => {
    const CustomIcon = () => null;
    const customIcons: Partial<MRT_Icons> = {
      SearchIcon: CustomIcon,
    };
    
    const icons = mergeIcons(customIcons);
    
    // Count should match (all defaults + overrides)
    const defaultCount = Object.keys(MRT_Default_Icons).length;
    const mergedCount = Object.keys(icons).length;
    expect(mergedCount).toBe(defaultCount);
  });
});

describe('Icon backward compatibility', () => {
  it('should maintain MUI icon naming convention', () => {
    // Verify that icon names follow the MUI pattern (ending with "Icon" or specific names)
    const iconNames = Object.keys(MRT_Default_Icons);
    
    iconNames.forEach((name) => {
      // Most icons should end with "Icon" or be specific names like "ContentCopy"
      const isValidName = name.endsWith('Icon') || name === 'ContentCopy';
      expect(isValidName).toBe(true);
    });
  });

  it('should map common MUI icons to lucide equivalents', () => {
    // Verify key mappings exist
    expect(MRT_Default_Icons.ArrowDownwardIcon).toBeDefined();
    expect(MRT_Default_Icons.ArrowUpwardIcon).toBeDefined();
    expect(MRT_Default_Icons.FilterListIcon).toBeDefined();
    expect(MRT_Default_Icons.SearchIcon).toBeDefined();
    expect(MRT_Default_Icons.EditIcon).toBeDefined();
    expect(MRT_Default_Icons.DeleteIcon).toBeDefined();
    expect(MRT_Default_Icons.MoreVertIcon).toBeDefined();
  });
});
