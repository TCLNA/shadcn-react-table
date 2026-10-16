import {
  type DragEvent,
  type MouseEvent,
  type RefObject,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Skeleton } from '../ui/skeleton';
import { TableCell } from '../ui/table';
import { MRT_TableBodyCellValue } from './MRT_TableBodyCellValue';
import {
  type MRT_Cell,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import {
  isCellEditable,
  cellKeyboardShortcuts,
  openEditingCell,
} from '../../utils/cell.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_CopyButton } from '../buttons/MRT_CopyButton';
import { MRT_EditCellTextField } from '../inputs/MRT_EditCellTextField';
import { cn } from '../../lib/utils';

export interface MRT_TableBodyCellProps<TData extends MRT_RowData>
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  cell: MRT_Cell<TData>;
  numRows?: number;
  rowRef: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableBodyCell = <TData extends MRT_RowData>({
  cell,
  numRows,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  table,
  ...rest
}: MRT_TableBodyCellProps<TData>) => {
  const {
    getState,
    options: {
      columnResizeDirection,
      columnResizeMode,
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableClickToCopy,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableKeyboardShortcuts,
      layoutMode,
      mrtTheme: { draggingBorderColor },
      muiSkeletonProps,
      muiTableBodyCellProps,
    },
    setHoveredColumn,
  } = table;
  const {
    actionCell,
    columnSizingInfo,
    creatingRow,
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    hoveredColumn,
    hoveredRow,
    isLoading,
    showSkeletons,
  } = getState();
  const { column, row } = cell;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const args = { cell, column, row, table };
  const tableCellProps = {
    ...parseFromValuesOrFunc(muiTableBodyCellProps, args),
    ...parseFromValuesOrFunc(columnDef.muiTableBodyCellProps, args),
    ...rest,
  };

  const skeletonProps = parseFromValuesOrFunc(muiSkeletonProps, {
    cell,
    column,
    row,
    table,
  });

  const [skeletonWidth, setSkeletonWidth] = useState(100);
  useEffect(() => {
    if ((!isLoading && !showSkeletons) || skeletonWidth !== 100) return;
    const size = column.getSize();
    setSkeletonWidth(
      columnDefType === 'display'
        ? size / 2
        : Math.round(Math.random() * (size - size / 3) + size / 3),
    );
  }, [isLoading, showSkeletons]);

  const draggingBorders = useMemo(() => {
    const isDraggingColumn = draggingColumn?.id === column.id;
    const isHoveredColumn = hoveredColumn?.id === column.id;
    const isDraggingRow = draggingRow?.id === row.id;
    const isHoveredRow = hoveredRow?.id === row.id;
    const isFirstColumn = column.getIsFirstColumn();
    const isLastColumn = column.getIsLastColumn();
    const isLastRow = numRows && staticRowIndex === numRows - 1;
    const isResizingColumn = columnSizingInfo.isResizingColumn === column.id;
    const showResizeBorder =
      isResizingColumn && columnResizeMode === 'onChange';

    const borderColor = draggingBorderColor || 'hsl(var(--primary))';
    const borderStyle = showResizeBorder
      ? `2px solid ${borderColor}`
      : isDraggingColumn || isDraggingRow
        ? `1px dashed hsl(var(--muted-foreground))`
        : isHoveredColumn || isHoveredRow || isResizingColumn
          ? `2px dashed ${borderColor}`
          : undefined;

    if (showResizeBorder) {
      return columnResizeDirection === 'ltr'
        ? { borderRight: borderStyle }
        : { borderLeft: borderStyle };
    }

    return borderStyle
      ? {
          borderBottom:
            isDraggingRow || isHoveredRow || (isLastRow && !isResizingColumn)
              ? borderStyle
              : undefined,
          borderLeft:
            isDraggingColumn ||
            isHoveredColumn ||
            ((isDraggingRow || isHoveredRow) && isFirstColumn)
              ? borderStyle
              : undefined,
          borderRight:
            isDraggingColumn ||
            isHoveredColumn ||
            ((isDraggingRow || isHoveredRow) && isLastColumn)
              ? borderStyle
              : undefined,
          borderTop: isDraggingRow || isHoveredRow ? borderStyle : undefined,
        }
      : undefined;
  }, [
    columnSizingInfo.isResizingColumn,
    draggingColumn,
    draggingRow,
    hoveredColumn,
    hoveredRow,
    staticRowIndex,
  ]);

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  const isEditable = isCellEditable({ cell, table });

  const isEditing =
    isEditable &&
    !['custom', 'modal'].includes(editDisplayMode as string) &&
    (editDisplayMode === 'table' ||
      editingRow?.id === row.id ||
      editingCell?.id === cell.id) &&
    !row.getIsGrouped();

  const isCreating =
    isEditable && createDisplayMode === 'row' && creatingRow?.id === row.id;

  const showClickToCopyButton =
    (parseFromValuesOrFunc(enableClickToCopy, cell) === true ||
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) === true) &&
    !['context-menu', false].includes(
      // @ts-expect-error
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell),
    );

  const isRightClickable = parseFromValuesOrFunc(enableCellActions, cell);

  const cellValueProps = {
    cell,
    table,
    staticColumnIndex,
    staticRowIndex,
  };

  const handleDoubleClick = (event: MouseEvent<HTMLTableCellElement>) => {
    tableCellProps?.onDoubleClick?.(event);
    openEditingCell({ cell, table });
  };

  const handleDragEnter = (e: DragEvent<HTMLTableCellElement>) => {
    tableCellProps?.onDragEnter?.(e);
    if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
      setHoveredColumn(null);
    }
    if (enableColumnOrdering && draggingColumn) {
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

  const handleContextMenu = (e: MouseEvent<HTMLTableCellElement>) => {
    tableCellProps?.onContextMenu?.(e);
    if (isRightClickable) {
      e.preventDefault();
      table.setActionCell(cell);
      table.refs.actionCellRef.current = e.currentTarget;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
    tableCellProps?.onKeyDown?.(event);
    cellKeyboardShortcuts({
      cell,
      cellValue: cell.getValue<string>(),
      event,
      table,
    });
  };

  // Determine padding based on density
  const getPaddingClasses = () => {
    if (density === 'compact') {
      return columnDefType === 'display' ? 'px-2 py-0' : 'p-2';
    } else if (density === 'comfortable') {
      return columnDefType === 'display' ? 'px-3 py-2' : 'p-4';
    } else {
      return columnDefType === 'display' ? 'px-5 py-4' : 'p-6';
    }
  };

  // Determine cursor style
  const getCursorClass = () => {
    if (isRightClickable) return 'cursor-context-menu';
    if (isEditable && editDisplayMode === 'cell') return 'cursor-pointer';
    return '';
  };

  // Determine outline styles
  const getOutlineClasses = () => {
    const hasOutline =
      actionCell?.id === cell.id ||
      (editDisplayMode === 'cell' && isEditable) ||
      (editDisplayMode === 'table' && (isCreating || isEditing));
    
    return hasOutline ? 'outline outline-1 outline-muted-foreground -outline-offset-1' : '';
  };

  // Hover outline
  const getHoverClasses = () => {
    const shouldShowHoverOutline =
      actionCell?.id === cell.id ||
      (editDisplayMode === 'cell' && isEditable) ||
      (editDisplayMode === 'table' && (isCreating || isEditing));
    
    return shouldShowHoverOutline ? 'hover:outline hover:outline-1 hover:outline-muted-foreground hover:-outline-offset-1' : '';
  };

  return (
    <TableCell
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      {...tableCellProps}
      onKeyDown={handleKeyDown}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      style={{
        ...draggingBorders,
        ...(tableCellProps?.style || {}),
      }}
      className={cn(
        'relative overflow-hidden',
        getPaddingClasses(),
        getCursorClass(),
        getOutlineClasses(),
        getHoverClasses(),
        layoutMode?.startsWith('grid') && 'flex items-center',
        columnDefType !== 'display' && 'truncate',
        (row.getIsPinned() || density === 'compact') && 'whitespace-nowrap',
        density !== 'compact' && 'whitespace-normal',
        'focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-2',
        tableCellProps?.className,
      )}
    >
      {tableCellProps.children ?? (
        <>
          {cell.getIsPlaceholder() ? (
            (columnDef.PlaceholderCell?.({ cell, column, row, table }) ?? null)
          ) : showSkeletons !== false && (isLoading || showSkeletons) ? (
            <Skeleton
              className="h-5"
              style={{ width: `${skeletonWidth}px` }}
              {...skeletonProps}
            />
          ) : columnDefType === 'display' &&
            (['mrt-row-expand', 'mrt-row-numbers', 'mrt-row-select'].includes(
              column.id,
            ) ||
              !row.getIsGrouped()) ? (
            columnDef.Cell?.({
              cell,
              column,
              renderedCellValue: cell.renderValue() as any,
              row,
              rowRef,
              staticColumnIndex,
              staticRowIndex,
              table,
            })
          ) : isCreating || isEditing ? (
            <MRT_EditCellTextField cell={cell} table={table} />
          ) : showClickToCopyButton && columnDef.enableClickToCopy !== false ? (
            <MRT_CopyButton cell={cell} table={table}>
              <MRT_TableBodyCellValue {...cellValueProps} />
            </MRT_CopyButton>
          ) : (
            <MRT_TableBodyCellValue {...cellValueProps} />
          )}
          {cell.getIsGrouped() && !columnDef.GroupedCell && (
            <> ({row.subRows?.length})</>
          )}
        </>
      )}
    </TableCell>
  );
};

export const Memo_MRT_TableBodyCell = memo(
  MRT_TableBodyCell,
  (prev, next) => next.cell === prev.cell,
) as typeof MRT_TableBodyCell;
