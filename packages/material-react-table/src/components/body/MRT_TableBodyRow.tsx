import { type DragEvent, type HTMLAttributes, memo, useMemo, useRef } from 'react';
import { type VirtualItem } from '@tanstack/react-virtual';
import { TableRow } from '../ui/table';
import { cn } from '../../lib/utils';
import { MRT_TableBodyCell, Memo_MRT_TableBodyCell } from './MRT_TableBodyCell';
import { MRT_TableDetailPanel } from './MRT_TableDetailPanel';
import {
  type MRT_Cell,
  type MRT_ColumnVirtualizer,
  type MRT_Row,
  type MRT_RowData,
  type MRT_RowVirtualizer,
  type MRT_TableInstance,
  type MRT_VirtualItem,
} from '../../types';
import { getIsRowSelected } from '../../utils/row.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_TableBodyRowProps<TData extends MRT_RowData>
  extends HTMLAttributes<HTMLTableRowElement> {
  columnVirtualizer?: MRT_ColumnVirtualizer;
  numRows?: number;
  pinnedRowIds?: string[];
  row: MRT_Row<TData>;
  rowVirtualizer?: MRT_RowVirtualizer;
  staticRowIndex: number;
  table: MRT_TableInstance<TData>;
  virtualRow?: VirtualItem;
}

export const MRT_TableBodyRow = <TData extends MRT_RowData>({
  columnVirtualizer,
  numRows,
  pinnedRowIds,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
  ...rest
}: MRT_TableBodyRowProps<TData>) => {
  const {
    getState,
    options: {
      enableRowOrdering,
      enableRowPinning,
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      memoMode,
      mrtTheme: {
        baseBackgroundColor,
      },
      muiTableBodyRowProps,
      renderDetailPanel,
      rowPinningDisplayMode,
    },
    refs: { tableFooterRef, tableHeadRef },
    setHoveredRow,
  } = table;
  const {
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    hoveredRow,
    isFullScreen,
    rowPinning,
  } = getState();

  const visibleCells = row.getVisibleCells();

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  const isRowSelected = getIsRowSelected({ row, table });
  const isRowPinned = enableRowPinning && row.getIsPinned();
  const isDraggingRow = draggingRow?.id === row.id;
  const isHoveredRow = hoveredRow?.id === row.id;

  const tableRowProps = {
    ...parseFromValuesOrFunc(muiTableBodyRowProps, {
      row,
      staticRowIndex,
      table,
    }),
    ...rest,
  };

  const [bottomPinnedIndex, topPinnedIndex] = useMemo(() => {
    if (
      !enableRowPinning ||
      !rowPinningDisplayMode?.includes('sticky') ||
      !pinnedRowIds ||
      !row.getIsPinned()
    )
      return [];
    return [
      [...pinnedRowIds].reverse().indexOf(row.id),
      pinnedRowIds.indexOf(row.id),
    ];
  }, [pinnedRowIds, rowPinning]);

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) &&
      tableHeadRef.current?.clientHeight) ||
    0;
  const tableFooterHeight =
    (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0;

  const defaultRowHeight =
    density === 'compact' ? 37 : density === 'comfortable' ? 53 : 69;

  const customRowHeight =
    // @ts-expect-error - accessing style.height
    parseInt(tableRowProps?.style?.height, 10) || undefined;

  const rowHeight = customRowHeight || defaultRowHeight;

  const handleDragEnter = (_e: DragEvent) => {
    if (enableRowOrdering && draggingRow) {
      setHoveredRow(row);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const rowRef = useRef<HTMLTableRowElement | null>(null);

  // Determine if hover is enabled
  const hoverEnabled = tableRowProps?.onMouseEnter !== undefined || 
                       tableRowProps?.onMouseLeave !== undefined;

  return (
    <>
      <TableRow
        data-index={renderDetailPanel ? staticRowIndex * 2 : staticRowIndex}
        data-pinned={!!isRowPinned || undefined}
        data-selected={isRowSelected || undefined}
        data-state={isRowSelected ? 'selected' : undefined}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        ref={(node: HTMLTableRowElement) => {
          if (node) {
            rowRef.current = node;
            rowVirtualizer?.measureElement(node);
          }
        }}
        {...tableRowProps}
        className={cn(
          // Base styles
          'border-b transition-colors',
          // Layout mode
          layoutMode?.startsWith('grid') && 'flex',
          // Hover state - only apply if hover is not explicitly disabled
          hoverEnabled !== false && 'hover:bg-muted/50',
          // Selected state
          isRowSelected && 'bg-muted',
          // Positioning
          virtualRow && 'absolute',
          rowPinningDisplayMode?.includes('sticky') && isRowPinned && 'sticky',
          !virtualRow && !isRowPinned && 'relative',
          // Opacity for dragging/hovering
          isRowPinned && 'opacity-97',
          (isDraggingRow || isHoveredRow) && 'opacity-50',
          tableRowProps?.className,
        )}
        style={{
          backgroundColor: `${baseBackgroundColor} !important`,
          boxSizing: 'border-box',
          width: '100%',
          // Virtual row positioning
          transform: virtualRow ? `translateY(${virtualRow.start}px)` : undefined,
          // Pinned row positioning
          bottom:
            !virtualRow && bottomPinnedIndex !== undefined && isRowPinned
              ? `${
                  bottomPinnedIndex * rowHeight +
                  (enableStickyFooter ? tableFooterHeight - 1 : 0)
                }px`
              : undefined,
          top: virtualRow
            ? 0
            : topPinnedIndex !== undefined && isRowPinned
              ? `${
                  topPinnedIndex * rowHeight +
                  (enableStickyHeader || isFullScreen ? tableHeadHeight - 1 : 0)
                }px`
              : undefined,
          // Z-index for pinned rows
          zIndex:
            rowPinningDisplayMode?.includes('sticky') && isRowPinned ? 2 : 0,
          // Transition
          transition: virtualRow ? 'none' : 'all 150ms ease-in-out',
          ...tableRowProps?.style,
        }}
      >
        {virtualPaddingLeft ? (
          <td style={{ display: 'flex', width: virtualPaddingLeft }} />
        ) : null}
        {(virtualColumns ?? visibleCells).map(
          (cellOrVirtualCell, staticColumnIndex) => {
            let cell = cellOrVirtualCell as MRT_Cell<TData>;
            if (columnVirtualizer) {
              staticColumnIndex = (cellOrVirtualCell as MRT_VirtualItem).index;
              cell = visibleCells[staticColumnIndex];
            }
            const props = {
              cell,
              numRows,
              rowRef,
              staticColumnIndex,
              staticRowIndex,
              table,
            };
            const key = `${cell.id}-${staticRowIndex}`;
            return cell ? (
              memoMode === 'cells' &&
              cell.column.columnDef.columnDefType === 'data' &&
              !draggingColumn &&
              !draggingRow &&
              editingCell?.id !== cell.id &&
              editingRow?.id !== row.id ? (
                <Memo_MRT_TableBodyCell key={key} {...props} />
              ) : (
                <MRT_TableBodyCell key={key} {...props} />
              )
            ) : null;
          },
        )}
        {virtualPaddingRight ? (
          <td style={{ display: 'flex', width: virtualPaddingRight }} />
        ) : null}
      </TableRow>
      {renderDetailPanel && !row.getIsGrouped() && (
        <MRT_TableDetailPanel
          parentRowRef={rowRef}
          row={row}
          rowVirtualizer={rowVirtualizer}
          staticRowIndex={staticRowIndex}
          table={table}
          virtualRow={virtualRow}
        />
      )}
    </>
  );
};

export const Memo_MRT_TableBodyRow = memo(
  MRT_TableBodyRow,
  (prev, next) =>
    prev.row === next.row && prev.staticRowIndex === next.staticRowIndex,
) as typeof MRT_TableBodyRow;
