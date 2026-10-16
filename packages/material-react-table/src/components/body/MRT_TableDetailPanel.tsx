import { type RefObject } from 'react';
import { TableCell, TableRow } from '../ui/table';
import { CollapsibleContent } from '../ui/collapsible';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_RowVirtualizer,
  type MRT_TableInstance,
  type MRT_VirtualItem,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { cn } from '@/lib/utils';

export interface MRT_TableDetailPanelProps<TData extends MRT_RowData>
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  parentRowRef: RefObject<HTMLTableRowElement | null>;
  row: MRT_Row<TData>;
  rowVirtualizer?: MRT_RowVirtualizer;
  staticRowIndex: number;
  table: MRT_TableInstance<TData>;
  virtualRow?: MRT_VirtualItem;
}

export const MRT_TableDetailPanel = <TData extends MRT_RowData>({
  parentRowRef,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
  ...rest
}: MRT_TableDetailPanelProps<TData>) => {
  const {
    getState,
    getVisibleLeafColumns,
    options: {
      layoutMode,
      mrtTheme: { baseBackgroundColor },
      muiDetailPanelProps,
      muiTableBodyRowProps,
      renderDetailPanel,
    },
  } = table;
  const { isLoading } = getState();

  const tableRowProps = parseFromValuesOrFunc(muiTableBodyRowProps, {
    isDetailPanel: true,
    row,
    staticRowIndex,
    table,
  });

  const tableCellProps = {
    ...parseFromValuesOrFunc(muiDetailPanelProps, {
      row,
      table,
    }),
    ...rest,
  };

  const DetailPanel = !isLoading && renderDetailPanel?.({ row, table });

  return (
    <TableRow
      className={cn(
        "Mui-TableBodyCell-DetailPanel",
        layoutMode?.startsWith('grid') && "flex",
        virtualRow && "absolute w-full",
        tableRowProps?.className
      )}
      data-index={renderDetailPanel ? staticRowIndex * 2 + 1 : staticRowIndex}
      ref={(node: HTMLTableRowElement) => {
        if (node) {
          rowVirtualizer?.measureElement?.(node);
        }
      }}
      style={{
        top: virtualRow
          ? `${parentRowRef.current?.getBoundingClientRect()?.height}px`
          : undefined,
        transform: virtualRow
          ? `translateY(${virtualRow?.start}px)`
          : undefined,
        ...tableRowProps?.style,
      }}
      {...tableRowProps}
    >
      <TableCell
        className={cn(
          "Mui-TableBodyCell-DetailPanel",
          layoutMode?.startsWith('grid') && "flex",
          "w-full border-b-0 transition-all duration-150 ease-in-out",
          !!DetailPanel && row.getIsExpanded() ? "py-4" : "py-0",
          !row.getIsExpanded() && "border-b-0",
          tableCellProps?.className
        )}
        colSpan={getVisibleLeafColumns().length}
        style={{
          backgroundColor: virtualRow ? baseBackgroundColor : undefined,
          ...tableCellProps?.style,
        }}
        {...tableCellProps}
      >
        {virtualRow ? (
          row.getIsExpanded() && DetailPanel
        ) : (
          <CollapsibleContent
            className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            forceMount={row.getIsExpanded() ? true : undefined}
          >
            {row.getIsExpanded() && DetailPanel}
          </CollapsibleContent>
        )}
      </TableCell>
    </TableRow>
  );
};
