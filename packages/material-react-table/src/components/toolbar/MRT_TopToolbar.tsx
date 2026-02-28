import { MRT_LinearProgressBar } from './MRT_LinearProgressBar';
import { MRT_TablePagination } from './MRT_TablePagination';
import { MRT_ToolbarAlertBanner } from './MRT_ToolbarAlertBanner';
import { MRT_ToolbarDropZone } from './MRT_ToolbarDropZone';
import { MRT_ToolbarInternalButtons } from './MRT_ToolbarInternalButtons';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_GlobalFilterTextField } from '../inputs/MRT_GlobalFilterTextField';
import { cn } from '../../lib/utils';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export interface MRT_TopToolbarProps<TData extends MRT_RowData> {
  table: MRT_TableInstance<TData>;
}

export const MRT_TopToolbar = <TData extends MRT_RowData>({
  table,
}: MRT_TopToolbarProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilter,
      enablePagination,
      enableToolbarInternalActions,
      muiTopToolbarProps,
      positionGlobalFilter,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderTopToolbarCustomActions,
    },
    refs: { topToolbarRef },
  } = table;

  const { isFullScreen, showGlobalFilter } = getState();

  const isMobile = useMediaQuery('(max-width:720px)');
  const isTablet = useMediaQuery('(max-width:1024px)');

  const toolbarProps = parseFromValuesOrFunc(muiTopToolbarProps, { table });

  const stackAlertBanner =
    isMobile ||
    !!renderTopToolbarCustomActions ||
    (showGlobalFilter && isTablet);

  const globalFilterProps = {
    className: !isTablet ? 'z-[2]' : undefined,
    table,
  };

  return (
    <div
      {...toolbarProps}
      ref={(ref: HTMLDivElement) => {
        topToolbarRef.current = ref;
        if ((toolbarProps as any)?.ref) {
          (toolbarProps as any).ref.current = ref;
        }
      }}
      className={cn(
        // Common toolbar styles
        'grid items-start flex-wrap-reverse min-h-[3.5rem] overflow-hidden relative transition-all duration-150 ease-in-out z-[1]',
        // Background color from theme
        'bg-background',
        // Position styles
        isFullScreen ? 'sticky top-0' : 'relative',
        // Custom className from props
        toolbarProps?.className
      )}
      style={{
        backgroundColor: table.options.mrtTheme?.baseBackgroundColor,
        ...toolbarProps?.style,
      }}
    >
      {positionToolbarAlertBanner === 'top' && (
        <MRT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'top'].includes(positionToolbarDropZone ?? '') && (
        <MRT_ToolbarDropZone table={table} />
      )}
      <div
        className={cn(
          'flex items-start justify-between gap-2 p-2 w-full box-border',
          stackAlertBanner ? 'relative' : 'absolute right-0 top-0'
        )}
      >
        {enableGlobalFilter && positionGlobalFilter === 'left' && (
          <MRT_GlobalFilterTextField {...globalFilterProps} />
        )}
        {renderTopToolbarCustomActions?.({ table }) ?? <span />}
        {enableToolbarInternalActions ? (
          <div className="flex items-center flex-wrap-reverse gap-2 justify-end">
            {enableGlobalFilter && positionGlobalFilter === 'right' && (
              <MRT_GlobalFilterTextField {...globalFilterProps} />
            )}
            <MRT_ToolbarInternalButtons table={table} />
          </div>
        ) : (
          enableGlobalFilter &&
          positionGlobalFilter === 'right' && (
            <MRT_GlobalFilterTextField {...globalFilterProps} />
          )
        )}
      </div>
      {enablePagination &&
        ['both', 'top'].includes(positionPagination ?? '') && (
          <MRT_TablePagination position="top" table={table} />
        )}
      <MRT_LinearProgressBar isTopToolbar table={table} />
    </div>
  );
};
