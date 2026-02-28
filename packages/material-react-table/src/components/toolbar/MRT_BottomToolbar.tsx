import { MRT_LinearProgressBar } from './MRT_LinearProgressBar';
import { MRT_TablePagination } from './MRT_TablePagination';
import { MRT_ToolbarAlertBanner } from './MRT_ToolbarAlertBanner';
import { MRT_ToolbarDropZone } from './MRT_ToolbarDropZone';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { cn } from '../../lib/utils';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export interface MRT_BottomToolbarProps<TData extends MRT_RowData> {
  table: MRT_TableInstance<TData>;
  className?: string;
  style?: React.CSSProperties;
}

export const MRT_BottomToolbar = <TData extends MRT_RowData>({
  table,
}: MRT_BottomToolbarProps<TData>) => {
  const {
    getState,
    options: {
      enablePagination,
      muiBottomToolbarProps,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderBottomToolbarCustomActions,
    },
    refs: { bottomToolbarRef },
  } = table;
  const { isFullScreen } = getState();

  const isMobile = useMediaQuery('(max-width:720px)');

  const toolbarProps = parseFromValuesOrFunc(muiBottomToolbarProps, { table });

  const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions;

  return (
    <div
      {...toolbarProps}
      ref={(node: HTMLDivElement) => {
        if (node) {
          bottomToolbarRef.current = node;
          if ((toolbarProps as any)?.ref) {
            (toolbarProps as any).ref.current = node;
          }
        }
      }}
      className={cn(
        // Common toolbar styles
        'grid items-start flex-wrap-reverse min-h-[3.5rem] overflow-hidden relative transition-all duration-150 ease-in-out z-[1]',
        // Background color from theme
        'bg-background',
        // Position styles
        isFullScreen ? 'fixed bottom-0 left-0 right-0' : 'relative',
        // Box shadow (inset top shadow)
        'shadow-[0_1px_2px_-1px_rgba(0,0,0,0.2)_inset]',
        // Custom className from props
        toolbarProps?.className
      )}
      style={{
        backgroundColor: table.options.mrtTheme?.baseBackgroundColor,
        ...toolbarProps?.style,
      }}
    >
      <MRT_LinearProgressBar isTopToolbar={false} table={table} />
      {positionToolbarAlertBanner === 'bottom' && (
        <MRT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'bottom'].includes(positionToolbarDropZone ?? '') && (
        <MRT_ToolbarDropZone table={table} />
      )}
      <div
        className={cn(
          'flex items-center justify-between p-2 w-full box-border',
          stackAlertBanner ? 'relative' : 'absolute right-0 top-0'
        )}
      >
        {renderBottomToolbarCustomActions ? (
          renderBottomToolbarCustomActions({ table })
        ) : (
          <span />
        )}
        <div
          className={cn(
            'flex justify-end',
            stackAlertBanner ? 'relative' : 'absolute right-0 top-0'
          )}
        >
          {enablePagination &&
            ['both', 'bottom'].includes(positionPagination ?? '') && (
              <MRT_TablePagination position="bottom" table={table} />
            )}
        </div>
      </div>
    </div>
  );
};
