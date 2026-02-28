import {
  DropdownMenu,
  DropdownMenuContent,
} from '../ui/dropdown-menu';
import { MRT_ActionMenuItem } from './MRT_ActionMenuItem';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { openEditingCell } from '../../utils/cell.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_CellActionMenuProps<TData extends MRT_RowData> {
  table: MRT_TableInstance<TData>;
}

export const MRT_CellActionMenu = <TData extends MRT_RowData>({
  table,
}: MRT_CellActionMenuProps<TData>) => {
  const {
    getState,
    options: {
      editDisplayMode,
      enableClickToCopy,
      enableEditing,
      icons: { ContentCopy, EditIcon },
      localization,
      mrtTheme: { menuBackgroundColor: _menuBackgroundColor },
      renderCellActionMenuItems,
    },
    refs: { actionCellRef },
  } = table;
  const { actionCell, density: _density } = getState();
  const cell = actionCell!;
  const { row } = cell;
  const { column } = cell;
  const { columnDef } = column;

  const handleClose = (...args: any[]) => {
    args[0]?.stopPropagation?.();
    table.setActionCell(null);
    actionCellRef.current = null;
  };

  const internalMenuItems = [
    (parseFromValuesOrFunc(enableClickToCopy, cell) === 'context-menu' ||
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) ===
        'context-menu') && (
      <MRT_ActionMenuItem
        icon={<ContentCopy />}
        key={'mrt-copy'}
        label={localization.copy}
        onClick={(event) => {
          event.stopPropagation();
          navigator.clipboard.writeText(cell.getValue() as string);
          handleClose();
        }}
        table={table}
      />
    ),
    parseFromValuesOrFunc(enableEditing, row) && editDisplayMode === 'cell' && (
      <MRT_ActionMenuItem
        icon={<EditIcon />}
        key={'mrt-edit'}
        label={localization.edit}
        onClick={() => {
          openEditingCell({ cell, table });
          handleClose();
        }}
        table={table}
      />
    ),
  ].filter(Boolean);

  const renderActionProps = {
    cell,
    closeMenu: handleClose,
    column,
    internalMenuItems,
    row,
    table,
  };

  const menuItems =
    columnDef.renderCellActionMenuItems?.(renderActionProps) ??
    renderCellActionMenuItems?.(renderActionProps);

  return (
    (!!menuItems?.length || !!internalMenuItems?.length) && (
      <DropdownMenu open={!!cell} onOpenChange={(open) => !open && handleClose()}>
        <DropdownMenuContent 
          className="min-w-[200px]"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
          onClick={(event) => event.stopPropagation()}
        >
          {menuItems ?? internalMenuItems}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};
