import { ReactNode, useMemo, type MouseEvent } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
} from '../ui/dropdown-menu';
import { MRT_ActionMenuItem } from './MRT_ActionMenuItem';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_RowActionMenuProps<TData extends MRT_RowData> {
  anchorEl: HTMLElement | null;
  handleEdit: (event: MouseEvent) => void;
  row: MRT_Row<TData>;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  staticRowIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_RowActionMenu = <TData extends MRT_RowData>({
  anchorEl,
  handleEdit,
  row,
  setAnchorEl,
  staticRowIndex,
  table,
}: MRT_RowActionMenuProps<TData>) => {
  const {
    getState,
    options: {
      editDisplayMode,
      enableEditing,
      icons: { EditIcon },
      localization,
      renderRowActionMenuItems,
    },
  } = table;
  const { density: _density } = getState();

  const menuItems = useMemo(() => {
    const items: ReactNode[] = [];
    const editItem = parseFromValuesOrFunc(enableEditing, row) &&
      ['modal', 'row'].includes(editDisplayMode!) && (
        <MRT_ActionMenuItem
          key={'edit'}
          icon={<EditIcon />}
          label={localization.edit}
          onClick={handleEdit as any}
          table={table}
        />
      );
    if (editItem) items.push(editItem);
    const rowActionMenuItems = renderRowActionMenuItems?.({
      closeMenu: () => setAnchorEl(null),
      row,
      staticRowIndex,
      table,
    });
    if (rowActionMenuItems?.length) items.push(...rowActionMenuItems);
    return items;
  }, [renderRowActionMenuItems, row, staticRowIndex, table]);

  if (!menuItems.length) return null;

  return (
    <DropdownMenu open={!!anchorEl} onOpenChange={(open) => !open && setAnchorEl(null)}>
      <DropdownMenuContent 
        className="min-w-[160px]"
        align="start"
        onClick={(event) => event.stopPropagation()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {menuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
