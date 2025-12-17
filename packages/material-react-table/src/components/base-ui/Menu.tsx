/**
 * Base UI Menu wrapper with shadcn styling
 * Replaces @mui/material/Menu
 */
import * as BaseMenu from '@base-ui/react/Menu';
import { type ReactNode, useEffect, useRef } from 'react';

export interface MenuProps {
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
  disableScrollLock?: boolean;
  MenuListProps?: {
    dense?: boolean;
    sx?: Record<string, any>;
  };
}

export interface MenuItemProps {
  children: ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  selected?: boolean;
  divider?: boolean;
  sx?: Record<string, any>;
  tabIndex?: number;
  value?: any;
}

export const Menu = ({
  anchorEl,
  children,
  open,
  onClose,
  anchorOrigin,
  transformOrigin,
  disableScrollLock,
  MenuListProps,
  ...rest
}: MenuProps) => {
  const positionerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && anchorEl && positionerRef.current) {
      const rect = anchorEl.getBoundingClientRect();
      const positioner = positionerRef.current;
      
      // Position the menu relative to the anchor element
      positioner.style.position = 'fixed';
      positioner.style.top = `${rect.bottom}px`;
      positioner.style.left = `${rect.left}px`;
      positioner.style.zIndex = '50';
    }
  }, [open, anchorEl, anchorOrigin, transformOrigin]);

  if (!open) return null;

  return (
    <BaseMenu.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <div ref={positionerRef}>
        <BaseMenu.Popup className={`menu-popup ${MenuListProps?.dense ? 'dense' : ''}`}>
          {children}
        </BaseMenu.Popup>
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
    </BaseMenu.Root>
  );
};

export const MenuItem = ({
  children,
  onClick,
  onMouseEnter,
  disabled,
  selected,
  divider,
  sx,
  tabIndex,
  value,
  ...rest
}: MenuItemProps) => {
  const className = `menu-item ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`;
  
  return (
    <>
      <div
        className={className}
        onClick={disabled ? undefined : onClick}
        onMouseEnter={disabled ? undefined : onMouseEnter}
        role="menuitem"
        tabIndex={disabled ? -1 : tabIndex ?? 0}
        aria-disabled={disabled}
        data-disabled={disabled ? 'true' : undefined}
        data-value={value}
        {...rest}
      >
        {children}
      </div>
      {divider && <div className="menu-separator" role="separator" />}
    </>
  );
};

// Additional components for compatibility
export const Box = ({
  children,
  sx,
  ...rest
}: {
  children: ReactNode;
  sx?: Record<string, any>;
  [key: string]: any;
}) => {
  return <div {...rest}>{children}</div>;
};

export const ListItemIcon = ({
  children,
  ...rest
}: {
  children: ReactNode;
  [key: string]: any;
}) => {
  return (
    <span style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }} {...rest}>
      {children}
    </span>
  );
};

export default Menu;
