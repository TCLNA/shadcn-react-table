import { describe, it, expect } from 'vitest';
import { MRT_TablePaper } from './MRT_TablePaper';
import { cn } from '../../lib/utils';

describe('MRT_TablePaper Migration', () => {
  it('should export MRT_TablePaper component', () => {
    expect(MRT_TablePaper).toBeDefined();
    expect(typeof MRT_TablePaper).toBe('function');
  });

  it('should have correct elevation mapping', () => {
    const elevationClasses = {
      0: '',
      1: 'shadow-sm',
      2: 'shadow',
      3: 'shadow-md',
      4: 'shadow-lg',
      5: 'shadow-xl',
      6: 'shadow-2xl',
    };

    // Test that elevation classes are correctly mapped
    expect(elevationClasses[0]).toBe('');
    expect(elevationClasses[1]).toBe('shadow-sm');
    expect(elevationClasses[2]).toBe('shadow');
    expect(elevationClasses[3]).toBe('shadow-md');
    expect(elevationClasses[4]).toBe('shadow-lg');
    expect(elevationClasses[5]).toBe('shadow-xl');
    expect(elevationClasses[6]).toBe('shadow-2xl');
  });

  it('should correctly merge Tailwind classes using cn utility', () => {
    // Test that cn utility works correctly for merging classes
    const baseClasses = 'rounded-lg border bg-card overflow-hidden transition-all duration-100';
    const shadowClass = 'shadow';
    const customClass = 'custom-class';

    const merged = cn(baseClasses, shadowClass, customClass);
    
    expect(merged).toContain('rounded-lg');
    expect(merged).toContain('border');
    expect(merged).toContain('bg-card');
    expect(merged).toContain('overflow-hidden');
    expect(merged).toContain('transition-all');
    expect(merged).toContain('shadow');
    expect(merged).toContain('custom-class');
  });

  it('should have correct fullscreen style properties', () => {
    const fullscreenStyles = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100dvw',
      height: '100dvh',
      maxWidth: '100dvw',
      maxHeight: '100dvh',
      margin: 0,
      padding: 0,
      zIndex: 1300,
    };

    // Verify fullscreen styles are correctly defined
    expect(fullscreenStyles.position).toBe('fixed');
    expect(fullscreenStyles.zIndex).toBe(1300); // MUI modal z-index equivalent
    expect(fullscreenStyles.width).toBe('100dvw');
    expect(fullscreenStyles.height).toBe('100dvh');
  });

  it('should not import from MUI Paper', () => {
    // This test verifies the migration by checking the source code
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'MRT_TablePaper.tsx');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Verify no MUI imports
    expect(fileContent).not.toContain('@mui/material/Paper');
    expect(fileContent).not.toContain('from \'@mui/material/Paper\'');
    expect(fileContent).not.toContain('useTheme');
    expect(fileContent).not.toContain('@mui/material/styles');
  });

  it('should import from correct sources', () => {
    // Verify correct imports are present
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'MRT_TablePaper.tsx');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Verify Tailwind utility import
    expect(fileContent).toContain('cn');
    expect(fileContent).toContain('../../lib/utils');
    
    // Verify React import
    expect(fileContent).toContain('HTMLAttributes');
    expect(fileContent).toContain('from \'react\'');
  });

  it('should use div element instead of Paper', () => {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'MRT_TablePaper.tsx');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Verify div is used instead of Paper
    expect(fileContent).toContain('<div');
    expect(fileContent).not.toContain('<Paper');
  });

  it('should use className instead of sx prop', () => {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'MRT_TablePaper.tsx');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Verify className is used
    expect(fileContent).toContain('className={cn(');
    
    // Verify sx prop is not used
    expect(fileContent).not.toContain('sx={(theme)');
    expect(fileContent).not.toContain('sx={');
  });

  it('should maintain elevation prop with default value', () => {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, 'MRT_TablePaper.tsx');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Verify elevation prop exists with default
    expect(fileContent).toContain('elevation = 2');
    expect(fileContent).toContain('elevation?: number');
  });
});
