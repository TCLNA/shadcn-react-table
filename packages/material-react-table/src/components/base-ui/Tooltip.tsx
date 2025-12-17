/**
 * Base UI Tooltip wrapper with shadcn styling
 * Replaces @mui/material/Tooltip
 */
import * as BaseTooltip from '@base-ui/react/Tooltip';
import { type ReactElement, type ReactNode } from 'react';

export interface TooltipProps {
  children: ReactElement;
  title: ReactNode;
  placement?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'left-start'
    | 'left-end'
    | 'right-start'
    | 'right-end';
  arrow?: boolean;
  enterDelay?: number;
  leaveDelay?: number;
  disableInteractive?: boolean;
  [key: string]: any;
}

export const Tooltip = ({
  children,
  title,
  placement = 'top',
  arrow,
  enterDelay = 100,
  leaveDelay = 0,
  disableInteractive,
  ...rest
}: TooltipProps) => {
  // Convert MUI placement to Base UI side/align
  const [side, align] = placement.split('-') as [
    'top' | 'bottom' | 'left' | 'right',
    'start' | 'end' | undefined,
  ];

  if (!title) {
    return children;
  }

  return (
    <BaseTooltip.Provider delay={enterDelay} closeDelay={leaveDelay}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger asChild>{children}</BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side={side} align={align || 'center'}>
            <BaseTooltip.Popup className="tooltip-popup" {...rest}>
              {title}
              {arrow && <BaseTooltip.Arrow className="tooltip-arrow" />}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
};

export default Tooltip;
