import { type HTMLAttributes } from 'react';
import { TableFooter } from '../ui/table';
import { MRT_TableFooterRow } from './MRT_TableFooterRow';
import {
  type MRT_ColumnVirtualizer,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { cn } from '../../lib/utils';

export interface MRT_TableFooterProps<TData extends MRT_RowData>
  extends HTMLAttributes<HTMLTableSectionElement> {
  columnVirtualizer?: MRT_ColumnVirtualizer;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableFooter = <TData extends MRT_RowData>({
  columnVirtualizer,
  table,
  ...rest
}: MRT_TableFooterProps<TData>) => {
  const {
    getState,
    options: { enableStickyFooter, layoutMode, muiTableFooterProps },
    refs: { tableFooterRef },
  } = table;
  const { isFullScreen } = getState();

  const tableFooterProps = {
    ...parseFromValuesOrFunc(muiTableFooterProps, {
      table,
    }),
    ...rest,
  };

  const stickFooter =
    (isFullScreen || enableStickyFooter) && enableStickyFooter !== false;

  const footerGroups = table.getFooterGroups();

  //if no footer cells at all, skip footer
  if (
    !footerGroups.some((footerGroup) =>
      footerGroup.headers?.some(
        (header) =>
          (typeof header.column.columnDef.footer === 'string' &&
            !!header.column.columnDef.footer) ||
          header.column.columnDef.Footer,
      ),
    )
  ) {
    return null;
  }

  return (
    <TableFooter
      {...tableFooterProps}
      ref={(ref: HTMLTableSectionElement) => {
        tableFooterRef.current = ref;
        if ((tableFooterProps as any)?.ref) {
          (tableFooterProps as any).ref.current = ref;
        }
      }}
      className={cn(
        stickFooter && 'sticky bottom-0 z-[1] opacity-[0.97]',
        stickFooter && 'border-t border-border',
        layoutMode?.startsWith('grid') && 'grid',
        tableFooterProps?.className,
      )}
      style={{
        position: stickFooter ? 'sticky' : 'relative',
        ...tableFooterProps?.style,
      }}
    >
      {footerGroups.map((footerGroup) => (
        <MRT_TableFooterRow
          columnVirtualizer={columnVirtualizer}
          footerGroup={footerGroup as any}
          key={footerGroup.id}
          table={table}
        />
      ))}
    </TableFooter>
  );
};
