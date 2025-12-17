/**
 * Base UI Menu wrapper with shadcn styling
 * Replaces @mui/material/Menu
 */
import { Menu as BaseMenu } from '@base-ui/react';
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
    /** @deprecated sx prop is not supported in Base UI. Styling is handled via CSS classes. */
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
  /** @deprecated sx prop is not supported in Base UI. Use className instead. */
  sx?: Record<string, any> | ((theme: any) => Record<string, any>);
  tabIndex?: number;
  value?: any;
  /** @deprecated disableRipple is not applicable in Base UI */
  disableRipple?: boolean;
  ref?: any;
  [key: string]: any;
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
}: MenuProps) => {
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
      
      // Position the menu relative to the anchor element
      positioner.style.position = 'fixed';
      positioner.style.top = `${top}px`;
      positioner.style.left = `${left}px`;
      positioner.style.zIndex = '50';
    }
  }, [open, anchorEl, anchorOrigin, transformOrigin]);

  if (!open) return null;

  return (
    <BaseMenu.Root open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
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
  style,
  ...rest
}: {
  children?: ReactNode;
  /** @deprecated sx prop is not supported in Base UI. Use style or className instead. */
  sx?: Record<string, any>;
  style?: React.CSSProperties;
  [key: string]: any;
}) => {
  return <div style={style} {...rest}>{children}</div>;
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
