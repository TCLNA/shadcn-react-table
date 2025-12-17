/**
 * Base UI Dialog wrapper with shadcn styling
 * Replaces @mui/material/Dialog
 */
import { Dialog as BaseDialog } from '@base-ui/react';
import { type ReactNode } from 'react';

export interface DialogProps {
  children: ReactNode;
  open: boolean;
  onClose: (event: any, reason: 'backdropClick' | 'escapeKeyDown') => void;
  fullWidth?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  [key: string]: any;
}

export interface DialogTitleProps {
  children: ReactNode;
  /** @deprecated sx prop is not supported in Base UI. Use className instead. */
  sx?: Record<string, any>;
  [key: string]: any;
}

export interface DialogContentProps {
  children: ReactNode;
  /** @deprecated sx prop is not supported in Base UI. Use className instead. */
  sx?: Record<string, any>;
  [key: string]: any;
}

export interface DialogActionsProps {
  children: ReactNode;
  /** @deprecated sx prop is not supported in Base UI. Use className instead. */
  sx?: Record<string, any>;
  [key: string]: any;
}

export const Dialog = ({
  children,
  open,
  onClose,
  fullWidth,
  maxWidth = 'sm',
  ...rest
}: DialogProps) => {
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose({}, 'backdropClick');
    }
  };

  const maxWidthClass = maxWidth
    ? {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
      }[maxWidth]
    : '';

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <BaseDialog.Root open={open} onOpenChange={handleOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="dialog-backdrop" />
        <BaseDialog.Popup
          className={`dialog-popup ${maxWidthClass} ${widthClass}`}
          {...rest}
        >
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
};

export const DialogTitle = ({ children, sx, ...rest }: DialogTitleProps) => {
  return (
    <div className="dialog-title" {...rest}>
      {children}
    </div>
  );
};

export const DialogContent = ({ children, sx, ...rest }: DialogContentProps) => {
  return (
    <div className="dialog-content" {...rest}>
      {children}
    </div>
  );
};

export const DialogActions = ({ children, sx, ...rest }: DialogActionsProps) => {
  return (
    <div className="dialog-actions" {...rest}>
      {children}
    </div>
  );
};

export default Dialog;
