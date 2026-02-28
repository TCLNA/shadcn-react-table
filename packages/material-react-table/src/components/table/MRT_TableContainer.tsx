import { useEffect, useLayoutEffect, useState } from 'react';
import { MRT_Table } from './MRT_Table';
import { MRT_TableLoadingOverlay } from './MRT_TableLoadingOverlay';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_CellActionMenu } from '../menus/MRT_CellActionMenu';
import { MRT_EditRowModal } from '../modals/MRT_EditRowModal';
import { cn } from '../../lib/utils';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface MRT_TableContainerProps<TData extends MRT_RowData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: MRT_TableInstance<TData>;
  maxHeight?: string | number;
}

export const MRT_TableContainer = <TData extends MRT_RowData>({
  table,
  maxHeight,
  className,
  style,
  ...rest
}: MRT_TableContainerProps<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableStickyHeader,
      muiTableContainerProps,
    },
    refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
  } = table;
  const {
    actionCell,
    creatingRow,
    editingRow,
    isFullScreen,
    isLoading,
    showLoadingOverlay,
  } = getState();

  const loading =
    showLoadingOverlay !== false && (isLoading || showLoadingOverlay);

  const [totalToolbarHeight, setTotalToolbarHeight] = useState(0);

  const tableContainerProps = {
    ...parseFromValuesOrFunc(muiTableContainerProps, {
      table,
    }),
    ...rest,
  };

  useIsomorphicLayoutEffect(() => {
    const topToolbarHeight =
      typeof document !== 'undefined'
        ? (topToolbarRef.current?.offsetHeight ?? 0)
        : 0;

    const bottomToolbarHeight =
      typeof document !== 'undefined'
        ? (bottomToolbarRef?.current?.offsetHeight ?? 0)
        : 0;

    setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight);
  });

  const createModalOpen = createDisplayMode === 'modal' && creatingRow;
  const editModalOpen = editDisplayMode === 'modal' && editingRow;

  // Calculate maxHeight based on fullscreen and sticky header settings
  const computedMaxHeight = isFullScreen
    ? `calc(100vh - ${totalToolbarHeight}px)`
    : enableStickyHeader
    ? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)`
    : maxHeight;

  return (
    <div
      aria-busy={loading}
      aria-describedby={loading ? 'mrt-progress' : undefined}
      {...tableContainerProps}
      ref={(node: HTMLDivElement) => {
        if (node) {
          tableContainerRef.current = node;
          if ((tableContainerProps as any)?.ref) {
            (tableContainerProps as any).ref.current = node;
          }
        }
      }}
      className={cn(
        'relative w-full max-w-full overflow-auto',
        className,
        tableContainerProps?.className
      )}
      style={{
        maxHeight: computedMaxHeight,
        ...style,
        ...tableContainerProps?.style,
      }}
    >
      {loading ? <MRT_TableLoadingOverlay table={table} /> : null}
      <MRT_Table table={table} />
      {(createModalOpen || editModalOpen) && (
        <MRT_EditRowModal open table={table} />
      )}
      {enableCellActions && actionCell && <MRT_CellActionMenu table={table} />}
    </div>
  );
};
