import { type DragEvent, useMemo, useCallback } from 'react';
import { TableHead } from '../ui/table';
import { MRT_TableHeadCellColumnActionsButton } from './MRT_TableHeadCellColumnActionsButton';
import { MRT_TableHeadCellFilterContainer } from './MRT_TableHeadCellFilterContainer';
import { MRT_TableHeadCellFilterLabel } from './MRT_TableHeadCellFilterLabel';
import { MRT_TableHeadCellGrabHandle } from './MRT_TableHeadCellGrabHandle';
import { MRT_TableHeadCellResizeHandle } from './MRT_TableHeadCellResizeHandle';
import { MRT_TableHeadCellSortLabel } from './MRT_TableHeadCellSortLabel';
import {
  type MRT_ColumnVirtualizer,
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { cellKeyboardShortcuts } from '../../utils/cell.utils';
import { cn } from '../../lib/utils';

export interface MRT_TableHeadCellProps<TData extends MRT_RowData>
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  columnVirtualizer?: MRT_ColumnVirtualizer;
  header: MRT_Header<TData>;
  staticColumnIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCell = <TData extends MRT_RowData>({
  columnVirtualizer,
  header,
  staticColumnIndex,
  table,
  ...rest
}: MRT_TableHeadCellProps<TData>) => {
  const {
    getState,
    options: {
      columnFilterDisplayMode,
      columnResizeDirection,
      columnResizeMode,
      enableKeyboardShortcuts,
      enableColumnActions,
      enableColumnDragging,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableMultiSort,
      layoutMode,
      mrtTheme: { draggingBorderColor },
      muiTableHeadCellProps,
      tableHeadCellProps,
    },
    refs: { tableHeadCellRefs },
    setHoveredColumn,
  } = table;
  const {
    columnSizingInfo,
    density,
    draggingColumn,
    grouping,
    hoveredColumn,
    showColumnFilters,
  } = getState();
  const { column } = header;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const tableCellProps = {
    ...parseFromValuesOrFunc(tableHeadCellProps ?? muiTableHeadCellProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.tableHeadCellProps ?? columnDef.muiTableHeadCellProps, {
      column,
      table,
    }),
    ...rest,
  };

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  const showColumnActions =
    (enableColumnActions || columnDef.enableColumnActions) &&
    columnDef.enableColumnActions !== false;

  const showDragHandle =
    enableColumnDragging !== false &&
    columnDef.enableColumnDragging !== false &&
    (enableColumnDragging ||
      (enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
      (enableGrouping &&
        columnDef.enableGrouping !== false &&
        !grouping.includes(column.id)));

  const headerPL = useMemo(() => {
    let pl = 0;
    if (column.getCanSort()) pl += 1;
    if (showColumnActions) pl += 1.75;
    if (showDragHandle) pl += 1.5;
    return pl;
  }, [showColumnActions, showDragHandle]);

  const draggingBorders = useMemo(() => {
    const showResizeBorder =
      columnSizingInfo.isResizingColumn === column.id &&
      columnResizeMode === 'onChange' &&
      !header.subHeaders.length;

    // draggingBorderColor used by className-based border styling below
    
    if (showResizeBorder) {
      return columnResizeDirection === 'ltr'
        ? 'border-r-2 border-r-primary'
        : 'border-l-2 border-l-primary';
    }
    
    if (draggingColumn?.id === column.id) {
      return 'border-x border-t border-dashed border-muted-foreground';
    }
    
    if (hoveredColumn?.id === column.id) {
      return 'border-x-2 border-t-2 border-dashed border-primary';
    }
    
    return '';
  }, [draggingColumn, hoveredColumn, columnSizingInfo.isResizingColumn, columnResizeDirection, draggingBorderColor]);

  const handleDragEnter = (_e: DragEvent) => {
    if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
      setHoveredColumn(null);
    }
    if (enableColumnOrdering && draggingColumn && columnDefType !== 'group') {
      setHoveredColumn(
        columnDef.enableColumnOrdering !== false ? column : null,
      );
    }
  };

  const handleDragOver = (e: DragEvent) => {
    if (columnDef.enableColumnOrdering !== false) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
    tableCellProps?.onKeyDown?.(event);
    cellKeyboardShortcuts({
      event,
      cellValue: header.column.columnDef.header,
      table,
      header,
    });
  };

  const handleRef = useCallback(
    (node: HTMLTableCellElement) => {
      if (node) {
        if (tableHeadCellRefs.current) {
          tableHeadCellRefs.current[column.id] = node;
        }
        if (columnDefType !== 'group') {
          columnVirtualizer?.measureElement?.(node);
        }
      }
    },
    [column.id, columnDefType, columnVirtualizer, tableHeadCellRefs],
  );

  const HeaderElement =
    parseFromValuesOrFunc(columnDef.Header, {
      column,
      header,
      table,
    }) ?? columnDef.header;

  // Calculate padding based on density
  const getPaddingClasses = () => {
    if (density === 'compact') {
      return 'p-2';
    } else if (density === 'comfortable') {
      return columnDefType === 'display' ? 'p-3' : 'p-4';
    } else {
      return columnDefType === 'display' ? 'px-5 py-4' : 'p-6';
    }
  };

  const getPaddingBottomClasses = () => {
    if (columnDefType === 'display') {
      return 'pb-0';
    } else if (showColumnFilters || density === 'compact') {
      return 'pb-1.5';
    } else {
      return 'pb-2.5';
    }
  };

  const getPaddingTopClasses = () => {
    if (columnDefType === 'group' || density === 'compact') {
      return 'pt-1';
    } else if (density === 'comfortable') {
      return 'pt-3';
    } else {
      return 'pt-5';
    }
  };

  const getAlignmentClass = () => {
    if (columnDefType === 'group') {
      return 'text-center';
    }
    return 'text-left';
  };

  return (
    <TableHead
      aria-sort={
        column.getIsSorted()
          ? column.getIsSorted() === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
      colSpan={header.colSpan}
      data-can-sort={column.getCanSort() || undefined}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      data-sort={column.getIsSorted() || undefined}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      ref={handleRef}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      {...tableCellProps}
      onKeyDown={handleKeyDown}
      className={cn(
        'font-bold overflow-visible align-top',
        getPaddingClasses(),
        getPaddingBottomClasses(),
        getPaddingTopClasses(),
        getAlignmentClass(),
        draggingBorders,
        layoutMode?.startsWith('grid') && 'flex flex-col',
        enableMultiSort && column.getCanSort() && 'select-none',
        'hover:[&_.MuiButtonBase-root]:opacity-100',
        tableCellProps.className
      )}
      style={{
        ...tableCellProps.style,
      }}
    >
      {header.isPlaceholder
        ? null
        : (tableCellProps.children ?? (
            <div
              className="Mui-TableHeadCell-Content flex items-center relative w-full"
              style={{
                flexDirection: tableCellProps?.align === 'right' ? 'row-reverse' : 'row',
                justifyContent:
                  columnDefType === 'group' ||
                  tableCellProps?.align === 'center'
                    ? 'center'
                    : column.getCanResize()
                      ? 'space-between'
                      : 'flex-start',
              }}
            >
              <div
                className={cn(
                  "Mui-TableHeadCell-Content-Labels flex items-center",
                  column.getCanSort() && columnDefType !== 'group' && 'cursor-pointer',
                  columnDefType === 'data' && 'overflow-hidden'
                )}
                onClick={column.getToggleSortingHandler()}
                style={{
                  flexDirection: tableCellProps?.align === 'right' ? 'row-reverse' : 'row',
                  paddingLeft: tableCellProps?.align === 'center' ? `${headerPL}rem` : undefined,
                }}
              >
                <div
                  className={cn(
                    "Mui-TableHeadCell-Content-Wrapper text-ellipsis hover:overflow-clip",
                    columnDefType === 'data' && 'overflow-hidden',
                    (columnDef.header?.length ?? 0) < 20 ? 'whitespace-nowrap' : 'whitespace-normal'
                  )}
                  style={{
                    minWidth: `${Math.min(columnDef.header?.length ?? 0, 4)}ch`,
                  }}
                >
                  {HeaderElement}
                </div>
                {column.getCanFilter() && (
                  <MRT_TableHeadCellFilterLabel header={header} table={table} />
                )}
                {column.getCanSort() && (
                  <MRT_TableHeadCellSortLabel header={header} table={table} />
                )}
              </div>
              {columnDefType !== 'group' && (
                <div
                  className="Mui-TableHeadCell-Content-Actions whitespace-nowrap"
                >
                  {showDragHandle && (
                    <MRT_TableHeadCellGrabHandle
                      column={column}
                      table={table}
                      tableHeadCellRef={{
                        current: tableHeadCellRefs.current?.[column.id]!,
                      }}
                    />
                  )}
                  {showColumnActions && (
                    <MRT_TableHeadCellColumnActionsButton
                      header={header}
                      table={table}
                    />
                  )}
                </div>
              )}
              {column.getCanResize() && (
                <MRT_TableHeadCellResizeHandle header={header} table={table} />
              )}
            </div>
          ))}
      {columnFilterDisplayMode === 'subheader' && column.getCanFilter() && (
        <MRT_TableHeadCellFilterContainer header={header} table={table} />
      )}
    </TableHead>
  );
};
