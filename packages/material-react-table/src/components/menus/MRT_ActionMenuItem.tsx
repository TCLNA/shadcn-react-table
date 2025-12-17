import { type ReactNode } from 'react';
import IconButton from '@mui/material/IconButton';
import { Box, ListItemIcon, MenuItem, type MenuItemProps } from '../base-ui';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';

export interface MRT_ActionMenuItemProps<TData extends MRT_RowData>
  extends MenuItemProps {
  icon: ReactNode;
  label: string;
  onOpenSubMenu?: MenuItemProps['onClick'] | MenuItemProps['onMouseEnter'];
  table: MRT_TableInstance<TData>;
}

export const MRT_ActionMenuItem = <TData extends MRT_RowData>({
  icon,
  label,
  onOpenSubMenu,
  table,
  ...rest
}: MRT_ActionMenuItemProps<TData>) => {
  const {
    options: {
      icons: { ArrowRightIcon },
    },
  } = table;

  return (
    <MenuItem
      tabIndex={0}
      {...rest}
    >
      <Box>
        <ListItemIcon>{icon}</ListItemIcon>
        {label}
      </Box>
      {onOpenSubMenu && (
        <IconButton
          onClick={onOpenSubMenu as any}
          onMouseEnter={onOpenSubMenu as any}
          size="small"
          sx={{ p: 0 }}
        >
          <ArrowRightIcon />
        </IconButton>
      )}
    </MenuItem>
  );
};
