import { type HTMLAttributes } from 'react';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { cn } from '../../lib/utils';
import { MRT_ShowHideColumnsButton } from '../buttons/MRT_ShowHideColumnsButton';
import { MRT_ToggleDensePaddingButton } from '../buttons/MRT_ToggleDensePaddingButton';
import { MRT_ToggleFiltersButton } from '../buttons/MRT_ToggleFiltersButton';
import { MRT_ToggleFullScreenButton } from '../buttons/MRT_ToggleFullScreenButton';
import { MRT_ToggleGlobalFilterButton } from '../buttons/MRT_ToggleGlobalFilterButton';

export interface MRT_ToolbarInternalButtonsProps<TData extends MRT_RowData>
  extends HTMLAttributes<HTMLDivElement> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToolbarInternalButtons = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToolbarInternalButtonsProps<TData>) => {
  const {
    options: {
      columnFilterDisplayMode,
      enableColumnFilters,
      enableColumnOrdering,
      enableColumnPinning,
      enableDensityToggle,
      enableFilters,
      enableFullScreenToggle,
      enableGlobalFilter,
      enableHiding,
      initialState,
      renderToolbarInternalActions,
    },
  } = table;

  return (
    <div
      {...rest}
      className={cn(
        'flex items-center z-[3]',
        rest?.className,
      )}
    >
      {renderToolbarInternalActions?.({
        table,
      }) ?? (
        <>
          {enableFilters &&
            enableGlobalFilter &&
            !initialState?.showGlobalFilter && (
              <MRT_ToggleGlobalFilterButton table={table} />
            )}
          {enableFilters &&
            enableColumnFilters &&
            columnFilterDisplayMode !== 'popover' && (
              <MRT_ToggleFiltersButton table={table} />
            )}
          {(enableHiding || enableColumnOrdering || enableColumnPinning) && (
            <MRT_ShowHideColumnsButton table={table} />
          )}
          {enableDensityToggle && (
            <MRT_ToggleDensePaddingButton table={table} />
          )}
          {enableFullScreenToggle && (
            <MRT_ToggleFullScreenButton table={table} />
          )}
        </>
      )}
    </div>
  );
};
