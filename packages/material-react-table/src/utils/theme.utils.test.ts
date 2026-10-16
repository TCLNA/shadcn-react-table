/**
 * Tests for Theme Utilities
 * 
 * These tests verify that the theme utility functions work correctly
 * for runtime theme customization.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isDarkMode,
  enableDarkMode,
  disableDarkMode,
  toggleDarkMode,
  setThemeColor,
  getThemeColor,
  setThemeRadius,
  getThemeRadius,
  applyTheme,
  resetTheme,
  createScopedTheme,
  hexToHSL,
  rgbToHSL,
} from './theme.utils';

describe('Theme Utilities', () => {
  // Mock document for testing
  beforeEach(() => {
    // Reset document state
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('style');
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('style');
    }
  });

  describe('Dark Mode', () => {
    it('should check if dark mode is enabled', () => {
      expect(isDarkMode()).toBe(false);
      
      document.documentElement.classList.add('dark');
      expect(isDarkMode()).toBe(true);
    });

    it('should enable dark mode', () => {
      enableDarkMode();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('should disable dark mode', () => {
      document.documentElement.classList.add('dark');
      disableDarkMode();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('should toggle dark mode', () => {
      expect(isDarkMode()).toBe(false);
      
      const result1 = toggleDarkMode();
      expect(result1).toBe(true);
      expect(isDarkMode()).toBe(true);
      
      const result2 = toggleDarkMode();
      expect(result2).toBe(false);
      expect(isDarkMode()).toBe(false);
    });
  });

  describe('Theme Colors', () => {
    it('should set theme color', () => {
      setThemeColor('primary', '221 83% 53%');
      
      const value = document.documentElement.style.getPropertyValue('--primary');
      expect(value).toBe('221 83% 53%');
    });

    it('should get theme color', () => {
      document.documentElement.style.setProperty('--primary', '221 83% 53%');
      
      const value = getThemeColor('primary');
      expect(value).toBe('221 83% 53%');
    });

    it('should set theme color on specific element', () => {
      const element = document.createElement('div');
      setThemeColor('primary', '221 83% 53%', element);
      
      const value = element.style.getPropertyValue('--primary');
      expect(value).toBe('221 83% 53%');
    });

    it('should get theme color from specific element', () => {
      const element = document.createElement('div');
      element.style.setProperty('--primary', '221 83% 53%');
      document.body.appendChild(element);
      
      const value = getThemeColor('primary', element);
      expect(value).toBe('221 83% 53%');
      
      document.body.removeChild(element);
    });
  });

  describe('Border Radius', () => {
    it('should set border radius', () => {
      setThemeRadius('1rem');
      
      const value = document.documentElement.style.getPropertyValue('--radius');
      expect(value).toBe('1rem');
    });

    it('should get border radius', () => {
      document.documentElement.style.setProperty('--radius', '1rem');
      
      const value = getThemeRadius();
      expect(value).toBe('1rem');
    });
  });

  describe('Apply Theme', () => {
    it('should apply multiple theme properties', () => {
      applyTheme({
        primary: '221 83% 53%',
        'primary-foreground': '210 40% 98%',
        radius: '1rem',
      });
      
      expect(document.documentElement.style.getPropertyValue('--primary')).toBe('221 83% 53%');
      expect(document.documentElement.style.getPropertyValue('--primary-foreground')).toBe('210 40% 98%');
      expect(document.documentElement.style.getPropertyValue('--radius')).toBe('1rem');
    });

    it('should apply theme to specific element', () => {
      const element = document.createElement('div');
      
      applyTheme({
        primary: '221 83% 53%',
        radius: '1rem',
      }, element);
      
      expect(element.style.getPropertyValue('--primary')).toBe('221 83% 53%');
      expect(element.style.getPropertyValue('--radius')).toBe('1rem');
    });
  });

  describe('Reset Theme', () => {
    it('should reset theme properties', () => {
      // Set some properties
      document.documentElement.style.setProperty('--primary', '221 83% 53%');
      document.documentElement.style.setProperty('--radius', '1rem');
      
      // Reset
      resetTheme();
      
      // Properties should be removed
      expect(document.documentElement.style.getPropertyValue('--primary')).toBe('');
      expect(document.documentElement.style.getPropertyValue('--radius')).toBe('');
    });

    it('should reset theme on specific element', () => {
      const element = document.createElement('div');
      element.style.setProperty('--primary', '221 83% 53%');
      element.style.setProperty('--radius', '1rem');
      
      resetTheme(element);
      
      expect(element.style.getPropertyValue('--primary')).toBe('');
      expect(element.style.getPropertyValue('--radius')).toBe('');
    });
  });

  describe('Color Conversion', () => {
    it('should convert hex to HSL', () => {
      // Blue color
      const hsl1 = hexToHSL('#3b82f6');
      expect(hsl1).toMatch(/^\d+ \d+% \d+%$/);
      
      // Red color
      const hsl2 = hexToHSL('#ef4444');
      expect(hsl2).toMatch(/^\d+ \d+% \d+%$/);
      
      // Green color
      const hsl3 = hexToHSL('#10b981');
      expect(hsl3).toMatch(/^\d+ \d+% \d+%$/);
    });

    it('should convert hex without # to HSL', () => {
      const hsl = hexToHSL('3b82f6');
      expect(hsl).toMatch(/^\d+ \d+% \d+%$/);
    });

    it('should convert RGB to HSL', () => {
      // Blue color (59, 130, 246)
      const hsl1 = rgbToHSL(59, 130, 246);
      expect(hsl1).toMatch(/^\d+ \d+% \d+%$/);
      
      // Red color (239, 68, 68)
      const hsl2 = rgbToHSL(239, 68, 68);
      expect(hsl2).toMatch(/^\d+ \d+% \d+%$/);
      
      // Green color (16, 185, 129)
      const hsl3 = rgbToHSL(16, 185, 129);
      expect(hsl3).toMatch(/^\d+ \d+% \d+%$/);
    });

    it('should convert black to HSL', () => {
      const hsl = rgbToHSL(0, 0, 0);
      expect(hsl).toBe('0 0% 0%');
    });

    it('should convert white to HSL', () => {
      const hsl = rgbToHSL(255, 255, 255);
      expect(hsl).toBe('0 0% 100%');
    });
  });

  describe('Scoped Theme', () => {
    it('should create scoped theme on element', () => {
      const element = document.createElement('div');
      
      const scopedTheme = createScopedTheme(element, {
        primary: '221 83% 53%',
        radius: '1rem',
      });
      
      expect(element.style.getPropertyValue('--primary')).toBe('221 83% 53%');
      expect(element.style.getPropertyValue('--radius')).toBe('1rem');
    });

    it('should apply new config to scoped theme', () => {
      const element = document.createElement('div');
      
      const scopedTheme = createScopedTheme(element, {
        primary: '221 83% 53%',
      });
      
      scopedTheme.apply({
        secondary: '210 40% 96%',
      });
      
      expect(element.style.getPropertyValue('--primary')).toBe('221 83% 53%');
      expect(element.style.getPropertyValue('--secondary')).toBe('210 40% 96%');
    });

    it('should reset scoped theme', () => {
      const element = document.createElement('div');
      
      const scopedTheme = createScopedTheme(element, {
        primary: '221 83% 53%',
        radius: '1rem',
      });
      
      scopedTheme.reset();
      
      expect(element.style.getPropertyValue('--primary')).toBe('');
      expect(element.style.getPropertyValue('--radius')).toBe('');
    });

    it('should get color from scoped theme', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      const scopedTheme = createScopedTheme(element, {
        primary: '221 83% 53%',
      });
      
      const value = scopedTheme.get('primary');
      expect(value).toBe('221 83% 53%');
      
      document.body.removeChild(element);
    });

    it('should set color on scoped theme', () => {
      const element = document.createElement('div');
      
      const scopedTheme = createScopedTheme(element, {});
      
      scopedTheme.set('primary', '221 83% 53%');
      
      expect(element.style.getPropertyValue('--primary')).toBe('221 83% 53%');
    });
  });
});
