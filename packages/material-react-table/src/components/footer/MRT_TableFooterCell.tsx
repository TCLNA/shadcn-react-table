import { TableCell } from '../ui/table';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { getCommonMRTCellStyles } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { cellKeyboardShortcuts } from '../../utils/cell.utils';
import { cn } from '../../lib/utils';

// TableCellProps type for compatibility
interface TableCellProps {
  align?: 'left' | 'center' | 'right';
  colSpan?: number;
  className?: string;
  children?: React.ReactNode;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTableCellElement>) => void;
}

// Default theme for compatibility
const defaultTheme = {
  direction: 'ltr' as 'ltr' | 'rtl',
  palette: {
    mode: 'light' as const,
    primary: { main: 'hsl(var(--primary))' },
    background: { default: 'hsl(var(--background))' },
    warning: { dark: 'hsl(var(--destructive))', light: 'hsl(var(--muted))' },
    grey: { 700: 'hsl(var(--muted-foreground))' },
    common: { white: 'hsl(var(--background))', black: 'hsl(var(--foreground))' },
  },
};

export interface MRT_TableFooterCellProps<TData extends MRT_RowData>
  extends TableCellProps {
  footer: MRT_Header<TData>;
  staticColumnIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableFooterCell = <TData extends MRT_RowData>({
  footer,
  staticColumnIndex,
  table,
  ...rest
}: MRT_TableFooterCellProps<TData>) => {
  const theme = defaultTheme;
  const {
    getState,
    options: {
      enableColumnPinning,
      muiTableFooterCellProps,
      enableKeyboardShortcuts,
    },
  } = table;
  const { density } = getState();
  const { column } = footer;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  const args = { column, table };
  const tableCellProps = {
    ...parseFromValuesOrFunc(muiTableFooterCellProps, args),
    ...parseFromValuesOrFunc(columnDef.muiTableFooterCellProps, args),
    ...rest,
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
    tableCellProps?.onKeyDown?.(event);
    cellKeyboardShortcuts({
      event,
      cellValue: footer.column.columnDef.footer,
      table,
    });
  };

  const padding =
    density === 'compact'
      ? '0.5rem'
      : density === 'comfortable'
        ? '1rem'
        : '1.5rem';

  return (
    <TableCell
      align={
        columnDefType === 'group'
          ? 'center'
          : theme.direction === 'rtl'
            ? 'right'
            : 'left'
      }
      colSpan={footer.colSpan}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      className={cn(
        "font-bold align-top",
        tableCellProps?.className
      )}
      style={{
        padding,
        ...getCommonMRTCellStyles({
          column,
          header: footer,
          table,
          tableCellProps,
          theme,
        }),
      }}
      {...tableCellProps}
      onKeyDown={handleKeyDown}
    >
      {tableCellProps.children ??
        (footer.isPlaceholder
          ? null
          : (parseFromValuesOrFunc(columnDef.Footer, {
              column,
              footer,
              table,
            }) ??
            columnDef.footer ??
            null))}
    </TableCell>
  );
};
