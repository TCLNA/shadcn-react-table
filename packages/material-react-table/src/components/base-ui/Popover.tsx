/**
 * Base UI Popover wrapper with shadcn styling
 * Replaces @mui/material/Popover
 */
import * as BasePopover from '@base-ui/react/Popover';
import { type ReactNode, useEffect, useRef } from 'react';

export interface PopoverProps {
  anchorEl: HTMLElement | null;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  anchorOrigin?: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
  };
  transformOrigin?: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
  };
  [key: string]: any;
}

export const Popover = ({
  anchorEl,
  children,
  open,
  onClose,
  anchorOrigin,
  transformOrigin,
  ...rest
}: PopoverProps) => {
  const positionerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && anchorEl && positionerRef.current) {
      const rect = anchorEl.getBoundingClientRect();
      const positioner = positionerRef.current;
      
      // Position the popover relative to the anchor element
      positioner.style.position = 'fixed';
      positioner.style.top = `${rect.bottom}px`;
      positioner.style.left = `${rect.left}px`;
      positioner.style.zIndex = '50';
    }
  }, [open, anchorEl, anchorOrigin, transformOrigin]);

  if (!open) return null;

  return (
    <BasePopover.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <div ref={positionerRef}>
        <BasePopover.Popup className="popover-popup" {...rest}>
          {children}
        </BasePopover.Popup>
      </div>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            background: 'transparent',
          }}
        />
      )}
    </BasePopover.Root>
  );
};

export default Popover;
