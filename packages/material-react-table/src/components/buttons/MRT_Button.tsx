import * as React from 'react';
import { Button, type ButtonProps } from '../ui/button';
import { cn } from '../../lib/utils';

/**
 * MRT_Button - Wrapper component for shadcn/ui Button with MRT-specific enhancements
 * 
 * This component extends the shadcn/ui Button with additional props for backward
 * compatibility with MUI Button patterns, specifically:
 * - startIcon: Icon to display before the button text
 * - endIcon: Icon to display after the button text
 * - Variant mapping from MUI to shadcn/ui conventions
 */

export interface MRT_ButtonProps extends Omit<ButtonProps, 'variant'> {
  /**
   * Icon element to display before the button text
   */
  startIcon?: React.ReactNode;
  /**
   * Icon element to display after the button text
   */
  endIcon?: React.ReactNode;
  /**
   * Button variant - supports both MUI and shadcn/ui variant names
   * MUI variants are mapped to shadcn/ui equivalents:
   * - 'contained' → 'default'
   * - 'outlined' → 'outline'
   * - 'text' → 'ghost'
   */
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'contained'  // MUI compatibility
    | 'outlined'   // MUI compatibility
    | 'text'       // MUI compatibility
    | null;
}

export const MRT_Button = React.forwardRef<HTMLButtonElement, MRT_ButtonProps>(
  ({ 
    children, 
    startIcon, 
    endIcon, 
    variant = 'default',
    className,
    ...props 
  }, ref) => {
    // Map MUI variant names to shadcn/ui equivalents
    const mappedVariant = React.useMemo(() => {
      switch (variant) {
        case 'contained':
          return 'default';
        case 'outlined':
          return 'outline';
        case 'text':
          return 'ghost';
        case null:
        case undefined:
          return 'default';
        default:
          return variant as ButtonProps['variant'];
      }
    }, [variant]);

    return (
      <Button
        ref={ref}
        variant={mappedVariant}
        className={cn(
          // Add gap for icon spacing if icons are present
          (startIcon || endIcon) && 'gap-2',
          className
        )}
        {...props}
      >
        {startIcon && <span className="inline-flex items-center">{startIcon}</span>}
        {children}
        {endIcon && <span className="inline-flex items-center">{endIcon}</span>}
      </Button>
    );
  }
);

MRT_Button.displayName = 'MRT_Button';
