import { useMemo, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { MRT_Button } from '../buttons/MRT_Button';
import { MRT_ShowHideColumnsMenuItems } from './MRT_ShowHideColumnsMenuItems';
import {
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
  type MRT_VisibilityState
} from '../../types';
import { getDefaultColumnOrderIds } from '../../utils/displayColumn.utils';

export interface MRT_ShowHideColumnsMenuProps<TData extends MRT_RowData> {
  anchorEl: HTMLElement | null;
  isSubMenu?: boolean;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
  table: MRT_TableInstance<TData>;
}

export const MRT_ShowHideColumnsMenu = <TData extends MRT_RowData>({
  anchorEl,
  setAnchorEl,
  table,
}: MRT_ShowHideColumnsMenuProps<TData>) => {
  const {
    getAllColumns,
    getAllLeafColumns,
    getCenterLeafColumns,
    getIsAllColumnsVisible,
    getIsSomeColumnsPinned,
    getIsSomeColumnsVisible,
    getLeftLeafColumns,
    getRightLeafColumns,
    getState,
    initialState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
    },
  } = table;
  const { columnOrder, columnPinning, density: _density } = getState();

  const handleToggleAllColumns = (value?: boolean) => {
    const updates =
      getAllLeafColumns()
        .filter((column) => column.columnDef.enableHiding !== false)
        .reduce((acc, column) => {
          acc[column.id] = value ?? !column.getIsVisible()
          return acc;
        }, {} as MRT_VisibilityState);

    table.setColumnVisibility((old) => ({ ...old, ...updates }));
  };

  const allColumns = useMemo(() => {
    const columns = getAllColumns();
    if (
      columnOrder.length > 0 &&
      !columns.some((col) => col.columnDef.columnDefType === 'group')
    ) {
      return [
        ...getLeftLeafColumns(),
        ...Array.from(new Set(columnOrder)).map((colId) =>
          getCenterLeafColumns().find((col) => col?.id === colId),
        ),
        ...getRightLeafColumns(),
      ].filter(Boolean);
    }
    return columns;
  }, [
    columnOrder,
    columnPinning,
    getAllColumns(),
    getCenterLeafColumns(),
    getLeftLeafColumns(),
    getRightLeafColumns(),
  ]) as MRT_Column<TData>[];

  const isNestedColumns = allColumns.some(
    (col) => col.columnDef.columnDefType === 'group',
  );

  const hasColumnOrderChanged = useMemo(
    () =>
      columnOrder.length !== initialState.columnOrder.length ||
      !columnOrder.every(
        (column, index) => column === initialState.columnOrder[index],
      ),

    [columnOrder, initialState.columnOrder],
  );

  const [hoveredColumn, setHoveredColumn] = useState<MRT_Column<TData> | null>(
    null,
  );

  return (
    <DropdownMenu open={!!anchorEl} onOpenChange={(open) => !open && setAnchorEl(null)}>
      <DropdownMenuContent 
        className="min-w-[300px] max-h-[400px] overflow-y-auto"
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex justify-between gap-2 p-2 pt-0">
          {enableHiding && (
            <MRT_Button
              variant="ghost"
              size="sm"
              disabled={!getIsSomeColumnsVisible()}
              onClick={() => handleToggleAllColumns(false)}
            >
              {localization.hideAll}
            </MRT_Button>
          )}
          {enableColumnOrdering && (
            <MRT_Button
              variant="ghost"
              size="sm"
              onClick={() =>
                table.setColumnOrder(
                  getDefaultColumnOrderIds(table.options, true),
                )
              }
              disabled={!hasColumnOrderChanged}
            >
              {localization.resetOrder}
            </MRT_Button>
          )}
          {enableColumnPinning && (
            <MRT_Button
              variant="ghost"
              size="sm"
              disabled={!getIsSomeColumnsPinned()}
              onClick={() => table.resetColumnPinning(true)}
            >
              {localization.unpinAll}
            </MRT_Button>
          )}
          {enableHiding && (
            <MRT_Button
              variant="ghost"
              size="sm"
              disabled={getIsAllColumnsVisible()}
              onClick={() => handleToggleAllColumns(true)}
            >
              {localization.showAll}
            </MRT_Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {allColumns.map((column, index) => (
          <MRT_ShowHideColumnsMenuItems
            allColumns={allColumns}
            column={column}
            hoveredColumn={hoveredColumn}
            isNestedColumns={isNestedColumns}
            key={`${index}-${column.id}`}
            setHoveredColumn={setHoveredColumn}
            table={table}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
