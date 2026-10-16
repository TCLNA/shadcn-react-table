import { useMemo } from 'react';
import { useMRT_ColumnVirtualizer } from '../../hooks/useMRT_ColumnVirtualizer';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseCSSVarId } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_TableBody, Memo_MRT_TableBody } from '../body/MRT_TableBody';
import { MRT_TableFooter } from '../footer/MRT_TableFooter';
import { MRT_TableHead } from '../head/MRT_TableHead';
import { cn } from '../../lib/utils';

export interface MRT_TableProps<TData extends MRT_RowData>
  extends React.HTMLAttributes<HTMLTableElement> {
  table: MRT_TableInstance<TData>;
}

export const MRT_Table = <TData extends MRT_RowData>({
  table,
  className,
  style,
  ...rest
}: MRT_TableProps<TData>) => {
  const {
    getFlatHeaders,
    getState,
    options: {
      columns,
      enableStickyHeader,
      enableTableFooter,
      enableTableHead,
      layoutMode,
      memoMode,
      muiTableProps,
      tableProps,
      renderCaption,
    },
  } = table;
  const { columnSizing, columnSizingInfo, columnVisibility, isFullScreen } =
    getState();

  // Support both old (muiTableProps) and new (tableProps) prop names for backward compatibility
  const resolvedTableProps = {
    ...parseFromValuesOrFunc(tableProps ?? muiTableProps, { table }),
    ...rest,
  };

  const Caption = parseFromValuesOrFunc(renderCaption, { table });

  const columnSizeVars = useMemo(() => {
    const headers = getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const colSize = header.getSize();
      colSizes[`--header-${parseCSSVarId(header.id)}-size`] = colSize;
      colSizes[`--col-${parseCSSVarId(header.column.id)}-size`] = colSize;
    }
    return colSizes;
  }, [columns, columnSizing, columnSizingInfo, columnVisibility]);

  const columnVirtualizer = useMRT_ColumnVirtualizer(table);

  const commonTableGroupProps = {
    columnVirtualizer,
    table,
  };

  // Determine if sticky header should be enabled
  const isStickyHeader = enableStickyHeader || isFullScreen;

  return (
    <table
      {...resolvedTableProps}
      className={cn(
        'w-full caption-bottom text-sm',
        'border-separate border-spacing-0',
        layoutMode?.startsWith('grid') && 'grid',
        'relative',
        isStickyHeader && '[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10',
        className,
        resolvedTableProps?.className
      )}
      style={{
        ...columnSizeVars,
        ...style,
        ...resolvedTableProps?.style,
      }}
    >
      {!!Caption && <caption className="mt-4 text-sm text-muted-foreground">{Caption}</caption>}
      {enableTableHead && <MRT_TableHead {...commonTableGroupProps} />}
      {memoMode === 'table-body' || columnSizingInfo.isResizingColumn ? (
        <Memo_MRT_TableBody {...commonTableGroupProps} />
      ) : (
        <MRT_TableBody {...commonTableGroupProps} />
      )}
      {enableTableFooter && <MRT_TableFooter {...commonTableGroupProps} />}
    </table>
  );
};
