/**
 * Base UI component wrappers with shadcn styling
 * These components provide a compatibility layer between MUI and Base UI
 */

export { Menu, MenuItem, Box, ListItemIcon } from './Menu';
export type { MenuProps, MenuItemProps } from './Menu';

export { Dialog, DialogTitle, DialogContent, DialogActions } from './Dialog';
export type {
  DialogProps,
  DialogTitleProps,
  DialogContentProps,
  DialogActionsProps,
} from './Dialog';

export { Tooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';

export { Popover } from './Popover';
export type { PopoverProps } from './Popover';
