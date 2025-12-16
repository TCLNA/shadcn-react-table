import { Card } from '../ui/card';
import { cn } from '../../lib/utils';
import { MRT_TableContainer } from './MRT_TableContainer';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_BottomToolbar } from '../toolbar/MRT_BottomToolbar';
import { MRT_TopToolbar } from '../toolbar/MRT_TopToolbar';

export interface MRT_TablePaperProps<TData extends MRT_RowData> {
  table: MRT_TableInstance<TData>;
  className?: string;
  style?: React.CSSProperties;
}

export const MRT_TablePaper = <TData extends MRT_RowData>({
  table,
  className,
  style,
}: MRT_TablePaperProps<TData>) => {
  const {
    getState,
    options: {
      enableBottomToolbar,
      enableTopToolbar,
      tablePaperProps,
      renderBottomToolbar,
      renderTopToolbar,
    },
    refs: { tablePaperRef },
  } = table;
  const { isFullScreen } = getState();

  const paperProps = parseFromValuesOrFunc(tablePaperProps, { table });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      table.setIsFullScreen(false);
    }
    paperProps?.onKeyDown?.(e);
  };

  return (
    <Card
      ref={(ref: HTMLDivElement) => {
        tablePaperRef.current = ref;
        if (paperProps?.ref) {
          //@ts-expect-error
          paperProps.ref.current = ref;
        }
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        'overflow-hidden transition-all duration-100 ease-in-out',
        'bg-card shadow-md',
        isFullScreen &&
          'fixed inset-0 z-50 m-0 h-screen max-h-screen max-w-full w-screen p-0',
        className,
        paperProps?.className
      )}
      style={{
        ...style,
        ...paperProps?.style,
      }}
    >
      {enableTopToolbar &&
        (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? (
          <MRT_TopToolbar table={table} />
        ))}
      <MRT_TableContainer table={table} />
      {enableBottomToolbar &&
        (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
          <MRT_BottomToolbar table={table} />
        ))}
    </Card>
  );
};
