import { Fragment, useMemo } from 'react';
import { X } from 'lucide-react';
import { Alert, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent } from '../ui/collapsible';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { getMRT_SelectAllHandler } from '../../utils/row.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_SelectCheckbox } from '../inputs/MRT_SelectCheckbox';
import { cn } from '../../lib/utils';

export interface MRT_ToolbarAlertBannerProps<TData extends MRT_RowData>
  extends React.HTMLAttributes<HTMLDivElement> {
  stackAlertBanner?: boolean;
  table: MRT_TableInstance<TData>;
  variant?: 'default' | 'destructive';
  title?: string;
}

export const MRT_ToolbarAlertBanner = <TData extends MRT_RowData>({
  stackAlertBanner,
  table,
  variant = 'default',
  title,
  children,
  className,
  ...rest
}: MRT_ToolbarAlertBannerProps<TData>) => {
  const {
    getFilteredSelectedRowModel,
    getCoreRowModel,
    getState,
    options: {
      enableRowSelection,
      enableSelectAll,
      localization,
      manualPagination,
      muiToolbarAlertBannerChipProps,
      muiToolbarAlertBannerProps,
      positionToolbarAlertBanner,
      renderToolbarAlertBannerContent,
      rowCount,
    },
    refs: { tablePaperRef },
  } = table;
  const { density, grouping, rowSelection, showAlertBanner } = getState();

  const alertProps = {
    ...parseFromValuesOrFunc(muiToolbarAlertBannerProps, {
      table,
    }),
    ...rest,
  };

  const chipProps = parseFromValuesOrFunc(muiToolbarAlertBannerChipProps, {
    table,
  });

  const totalRowCount = rowCount ?? getCoreRowModel().rows.length;
  const filteredRowCount = getFilteredSelectedRowModel().rows.length;

  const selectedRowCount = useMemo(
    () =>
      manualPagination
        ? Object.values(rowSelection).filter(Boolean).length
        : filteredRowCount,
    [rowSelection, totalRowCount, manualPagination, filteredRowCount],
  );
  
  const selectedAlert =
    selectedRowCount > 0 ? (
      <div className="flex items-center gap-4">
        {localization.selectedCountOfRowCountRowsSelected
          ?.replace(
            '{selectedCount}',
            selectedRowCount.toLocaleString(localization.language),
          )
          ?.replace(
            '{rowCount}',
            totalRowCount.toLocaleString(localization.language),
          )}
        <Button
          onClick={(event) =>
            getMRT_SelectAllHandler({ table })(event, false, true)
          }
          size="sm"
          variant="ghost"
          className="h-auto p-0.5"
        >
          {localization.clearSelection}
        </Button>
      </div>
    ) : null;

  const groupedAlert =
    grouping.length > 0 ? (
      <span>
        {localization.groupedBy}{' '}
        {grouping.map((columnId, index) => (
          <Fragment key={`${index}-${columnId}`}>
            {index > 0 ? localization.thenBy : ''}
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
                'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                chipProps?.className
              )}
              {...chipProps}
            >
              {table.getColumn(columnId).columnDef.header}
              <button
                onClick={() => table.getColumn(columnId).toggleGrouping()}
                className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                aria-label="Remove grouping"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          </Fragment>
        ))}
      </span>
    ) : null;

  return (
    <Collapsible
      open={showAlertBanner || !!selectedAlert || !!groupedAlert}
    >
      <CollapsibleContent
        className={cn(
          'transition-all',
          stackAlertBanner ? 'duration-200' : 'duration-0'
        )}
      >
        <Alert
          variant={variant}
          className={cn(
            'rounded-none border-x-0 border-t-0 relative w-full',
            !stackAlertBanner && positionToolbarAlertBanner === 'bottom' && '-mb-4',
            className,
            alertProps?.className
          )}
          style={{
            maxWidth: tablePaperRef.current?.clientWidth ?? 360,
          }}
          {...alertProps}
        >
          {renderToolbarAlertBannerContent?.({
            groupedAlert,
            selectedAlert,
            table,
          }) ?? (
            <>
              {(title || alertProps?.title) && (
                <AlertTitle>{title || alertProps.title}</AlertTitle>
              )}
              <div
                className={cn(
                  positionToolbarAlertBanner !== 'head-overlay'
                    ? 'p-2 px-4'
                    : density === 'spacious'
                      ? 'p-3 px-5'
                      : density === 'comfortable'
                        ? 'p-2 px-3'
                        : 'p-1 px-2'
                )}
              >
                {children || alertProps?.children}
                {(children || alertProps?.children) && (selectedAlert || groupedAlert) && (
                  <br />
                )}
                <div className="flex items-center">
                  {enableRowSelection &&
                    enableSelectAll &&
                    positionToolbarAlertBanner === 'head-overlay' && (
                      <MRT_SelectCheckbox table={table} />
                    )}{' '}
                  {selectedAlert}
                </div>
                {selectedAlert && groupedAlert && <br />}
                {groupedAlert}
              </div>
            </>
          )}
        </Alert>
      </CollapsibleContent>
    </Collapsible>
  );
};
