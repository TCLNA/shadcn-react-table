import * as React from 'react';
import { Button, type ButtonProps } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { cn } from '../../lib/utils';

/**
 * MRT_IconButton - Wrapper component for icon-only buttons with optional tooltip
 * 
 * This component extends the shadcn/ui Button configured for icon-only usage
 * with additional features for backward compatibility with MUI IconButton:
 * - Defaults to variant="ghost" and size="icon"
 * - Integrated tooltip support (most icon buttons have tooltips)
 * - Density-based sizing (compact, comfortable, default)
 * - Maintains MUI IconButton prop patterns
 */

export interface MRT_IconButtonProps extends Omit<ButtonProps, 'size'> {
  /**
   * Tooltip text to display on hover
   * If provided, the button will be wrapped in a Tooltip component
   */
  tooltip?: React.ReactNode;
  /**
   * Tooltip placement (side)
   */
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Button size - supports both shadcn/ui and MUI size conventions
   * - 'icon' (default): Standard icon button size (36px)
   * - 'small': Smaller icon button (32px)
   * - 'large': Larger icon button (40px)
   */
  size?: 'icon' | 'small' | 'large' | null;
  /**
   * Density mode for table context
   * - 'comfortable': Slightly larger (same as default)
   * - 'compact': Smaller buttons for dense tables
   * - 'spacious': Larger buttons (same as large)
   */
  density?: 'comfortable' | 'compact' | 'spacious';
}

export const MRT_IconButton = React.forwardRef<
  HTMLButtonElement,
  MRT_IconButtonProps
>(
  (
    {
      children,
      tooltip,
      tooltipPlacement = 'top',
      variant = 'ghost',
      size = 'icon',
      density,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Determine final size based on size prop or density
    const finalSize = React.useMemo(() => {
      if (density) {
        switch (density) {
          case 'compact':
            return 'small';
          case 'spacious':
            return 'large';
          case 'comfortable':
          default:
            return 'icon';
        }
      }
      return size;
    }, [size, density]);

    // Map size to Tailwind classes
    const sizeClasses = React.useMemo(() => {
      switch (finalSize) {
        case 'small':
          return 'h-8 w-8';
        case 'large':
          return 'h-10 w-10';
        case 'icon':
        default:
          return 'h-9 w-9';
      }
    }, [finalSize]);

    const button = (
      <Button
        ref={ref}
        variant={variant}
        size="icon"
        disabled={disabled}
        className={cn(sizeClasses, className)}
        {...props}
      >
        {children}
      </Button>
    );

    // Wrap in tooltip if tooltip prop is provided
    if (tooltip && !disabled) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side={tooltipPlacement}>
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // For disabled buttons with tooltips, wrap in span to allow tooltip to show
    if (tooltip && disabled) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">{button}</span>
            </TooltipTrigger>
            <TooltipContent side={tooltipPlacement}>
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  },
);

MRT_IconButton.displayName = 'MRT_IconButton';
