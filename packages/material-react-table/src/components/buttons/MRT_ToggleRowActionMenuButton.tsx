import { type MouseEvent, useState } from 'react';
import { MRT_EditActionButtons } from './MRT_EditActionButtons';
import {
  type MRT_Cell,
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { MRT_IconButton, type MRT_IconButtonProps } from './MRT_IconButton';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_RowActionMenu } from '../menus/MRT_RowActionMenu';
import { cn } from '../../lib/utils';

const commonIconButtonClasses =
  'h-8 w-8 ml-2.5 opacity-50 hover:opacity-100 transition-opacity duration-150';

export interface MRT_ToggleRowActionMenuButtonProps<TData extends MRT_RowData>
  extends Omit<MRT_IconButtonProps, 'tooltip'> {
  cell: MRT_Cell<TData>;
  row: MRT_Row<TData>;
  staticRowIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleRowActionMenuButton = <TData extends MRT_RowData>({
  cell,
  row,
  staticRowIndex,
  table,
  ...rest
}: MRT_ToggleRowActionMenuButtonProps<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableEditing,
      icons: { EditIcon, MoreHorizIcon },
      localization,
      renderRowActionMenuItems,
      renderRowActions,
    },
    setEditingRow,
  } = table;

  const { creatingRow, editingRow } = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const showEditActionButtons =
    (isCreating && createDisplayMode === 'row') ||
    (isEditing && editDisplayMode === 'row');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenRowActionMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleStartEditMode = (event: MouseEvent) => {
    event.stopPropagation();
    setEditingRow({ ...row });
    setAnchorEl(null);
  };

  return (
    <>
      {renderRowActions && !showEditActionButtons ? (
        renderRowActions({ cell, row, staticRowIndex, table })
      ) : showEditActionButtons ? (
        <MRT_EditActionButtons row={row} table={table} />
      ) : !renderRowActionMenuItems &&
        parseFromValuesOrFunc(enableEditing, row) &&
        ['modal', 'row'].includes(editDisplayMode!) ? (
        <MRT_IconButton
          aria-label={localization.edit}
          onClick={handleStartEditMode}
          tooltip={localization.edit}
          tooltipPlacement="right"
          className={cn(commonIconButtonClasses, rest.className)}
          {...rest}
        >
          <EditIcon />
        </MRT_IconButton>
      ) : renderRowActionMenuItems?.({
          row,
          staticRowIndex,
          table,
        } as any)?.length ? (
        <>
          <MRT_IconButton
            aria-label={localization.rowActions}
            onClick={handleOpenRowActionMenu}
            size="small"
            tooltip={localization.rowActions}
            className={cn(commonIconButtonClasses, rest.className)}
            {...rest}
          >
            <MoreHorizIcon />
          </MRT_IconButton>
          <MRT_RowActionMenu
            anchorEl={anchorEl}
            handleEdit={handleStartEditMode}
            row={row}
            setAnchorEl={setAnchorEl}
            staticRowIndex={staticRowIndex}
            table={table}
          />
        </>
      ) : null}
    </>
  );
};
