/**
 * Base UI Popover wrapper with shadcn styling
 * Replaces @mui/material/Popover
 */
import { Popover as BasePopover } from '@base-ui/react';
import { type ReactNode, useEffect, useRef } from 'react';

export interface PopoverProps {
  anchorEl: HTMLElement | null;
  children: ReactNode;
  open: boolean;
  onClose: (event?: any) => void;
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
      
      // Calculate position based on anchorOrigin
      let top = rect.top;
      let left = rect.left;
      
      if (anchorOrigin) {
        switch (anchorOrigin.vertical) {
          case 'top':
            top = rect.top;
            break;
          case 'center':
            top = rect.top + rect.height / 2;
            break;
          case 'bottom':
            top = rect.bottom;
            break;
        }
        
        switch (anchorOrigin.horizontal) {
          case 'left':
            left = rect.left;
            break;
          case 'center':
            left = rect.left + rect.width / 2;
            break;
          case 'right':
            left = rect.right;
            break;
        }
      } else {
        // Default: bottom-left
        top = rect.bottom;
        left = rect.left;
      }
      
      // Position the popover relative to the anchor element
      positioner.style.position = 'fixed';
      positioner.style.top = `${top}px`;
      positioner.style.left = `${left}px`;
      positioner.style.zIndex = '50';
    }
  }, [open, anchorEl, anchorOrigin, transformOrigin]);

  if (!open) return null;

  return (
    <BasePopover.Root open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
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
