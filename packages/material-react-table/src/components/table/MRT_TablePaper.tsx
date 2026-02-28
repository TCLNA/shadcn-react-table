import { type HTMLAttributes } from 'react';
import { MRT_TableContainer } from './MRT_TableContainer';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_BottomToolbar } from '../toolbar/MRT_BottomToolbar';
import { MRT_TopToolbar } from '../toolbar/MRT_TopToolbar';
import { cn } from '../../lib/utils';

export interface MRT_TablePaperProps<TData extends MRT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  table: MRT_TableInstance<TData>;
  elevation?: number;
}

export const MRT_TablePaper = <TData extends MRT_RowData>({
  table,
  elevation = 2,
  className,
  style,
  ...rest
}: MRT_TablePaperProps<TData>) => {
  const {
    getState,
    options: {
      enableBottomToolbar,
      enableTopToolbar,
      mrtTheme: { baseBackgroundColor },
      muiTablePaperProps,
      renderBottomToolbar,
      renderTopToolbar,
    },
    refs: { tablePaperRef },
  } = table;
  const { isFullScreen } = getState();

  const paperProps = {
    ...parseFromValuesOrFunc(muiTablePaperProps, { table }),
    ...rest,
  };

  // Map elevation to Tailwind shadow classes
  const elevationClasses = {
    0: '',
    1: 'shadow-sm',
    2: 'shadow',
    3: 'shadow-md',
    4: 'shadow-lg',
    5: 'shadow-xl',
    6: 'shadow-2xl',
  };

  const shadowClass = elevationClasses[elevation as keyof typeof elevationClasses] || elevationClasses[2];

  return (
    <div
      onKeyDown={(e) => e.key === 'Escape' && table.setIsFullScreen(false)}
      {...paperProps}
      ref={(ref: HTMLDivElement) => {
        tablePaperRef.current = ref;
        if ((paperProps as any)?.ref) {
          (paperProps as any).ref.current = ref;
        }
      }}
      className={cn(
        'rounded-lg border bg-card overflow-hidden transition-all duration-100',
        shadowClass,
        className,
        paperProps?.className
      )}
      style={{
        backgroundColor: baseBackgroundColor,
        ...(isFullScreen
          ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100dvw',
              height: '100dvh',
              maxWidth: '100dvw',
              maxHeight: '100dvh',
              margin: 0,
              padding: 0,
              zIndex: 1300, // equivalent to MUI modal z-index
            }
          : {}),
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
    </div>
  );
};
