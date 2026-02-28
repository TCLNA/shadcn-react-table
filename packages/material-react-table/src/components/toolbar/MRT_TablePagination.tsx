import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { cn } from '../../lib/utils';
import { MRT_IconButton } from '../buttons/MRT_IconButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100];

export interface MRT_TablePaginationProps<TData extends MRT_RowData> {
  /**
   * Position of the pagination component (top or bottom toolbar)
   */
  position?: 'bottom' | 'top';
  /**
   * The table instance
   */
  table: MRT_TableInstance<TData>;
  /**
   * Whether the pagination controls are disabled
   */
  disabled?: boolean;
  /**
   * Options for rows per page dropdown
   * Can be an array of numbers or objects with label and value
   */
  rowsPerPageOptions?: { label: string; value: number }[] | number[];
  /**
   * Whether to show the rows per page selector
   */
  showRowsPerPage?: boolean;
  /**
   * Whether to show first page button
   */
  showFirstButton?: boolean;
  /**
   * Whether to show last page button
   */
  showLastButton?: boolean;
  /**
   * Additional className for the pagination container
   */
  className?: string;
}

export const MRT_TablePagination = <TData extends MRT_RowData>({
  position = 'bottom',
  table,
  disabled = false,
  rowsPerPageOptions = defaultRowsPerPage,
  showRowsPerPage = true,
  showFirstButton,
  showLastButton,
  className,
}: MRT_TablePaginationProps<TData>) => {
  const {
    getState,
    options: {
      enableToolbarInternalActions,
      icons: { ChevronLeftIcon, ChevronRightIcon, FirstPageIcon, LastPageIcon },
      id,
      localization,
      paginationDisplayMode,
    },
  } = table;
  const {
    pagination: { pageIndex = 0, pageSize = 10 },
  } = getState();

  const totalRowCount = table.getRowCount();
  const numberOfPages = table.getPageCount();
  const showFirstLastPageButtons = numberOfPages > 2;
  const firstRowIndex = pageIndex * pageSize;
  const lastRowIndex = Math.min(pageIndex * pageSize + pageSize, totalRowCount);

  // Determine if first/last buttons should be shown
  const finalShowFirstButton = showFirstButton ?? showFirstLastPageButtons;
  const finalShowLastButton = showLastButton ?? showFirstLastPageButtons;

  const disableBack = pageIndex <= 0 || disabled;
  const disableNext = lastRowIndex >= totalRowCount || disabled;

  // Format the page info text
  const pageInfoText = `${
    lastRowIndex === 0
      ? 0
      : (firstRowIndex + 1).toLocaleString(localization.language)
  }-${lastRowIndex.toLocaleString(localization.language)} ${
    localization.of
  } ${totalRowCount.toLocaleString(localization.language)}`;

  // Only render pagination if display mode is 'default' (we don't support 'pages' mode yet)
  if (paginationDisplayMode !== 'default') {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-2 px-2 py-3 relative z-[2]',
        position === 'top' && enableToolbarInternalActions && 'mt-12',
        'sm:justify-center md:justify-between',
        className
      )}
    >
      {/* Rows per page selector */}
      {showRowsPerPage && (
        <div className="flex items-center gap-2">
          <label
            htmlFor={`mrt-rows-per-page-${id}`}
            className="text-sm font-medium whitespace-nowrap"
          >
            {localization.rowsPerPage}
          </label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
            disabled={disabled}
          >
            <SelectTrigger
              id={`mrt-rows-per-page-${id}`}
              className="w-[70px] h-8"
              aria-label={localization.rowsPerPage}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {rowsPerPageOptions.map((option) => {
                const value = typeof option !== 'number' ? option.value : option;
                const label =
                  typeof option !== 'number' ? option.label : `${option}`;
                return (
                  <SelectItem key={value} value={String(value)}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Page info and navigation controls */}
      <div className="flex items-center gap-1">
        {/* Page info text */}
        <span className="text-sm mx-1 min-w-[8ch] text-center">
          {pageInfoText}
        </span>

        {/* Navigation buttons */}
        <div className="flex items-center gap-0.5">
          {finalShowFirstButton && (
            <MRT_IconButton
              onClick={() => table.firstPage()}
              disabled={disableBack}
              tooltip={localization.goToFirstPage}
              aria-label={localization.goToFirstPage}
              size="small"
            >
              <FirstPageIcon className="h-4 w-4" />
            </MRT_IconButton>
          )}
          <MRT_IconButton
            onClick={() => table.previousPage()}
            disabled={disableBack}
            tooltip={localization.goToPreviousPage}
            aria-label={localization.goToPreviousPage}
            size="small"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </MRT_IconButton>
          <MRT_IconButton
            onClick={() => table.nextPage()}
            disabled={disableNext}
            tooltip={localization.goToNextPage}
            aria-label={localization.goToNextPage}
            size="small"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </MRT_IconButton>
          {finalShowLastButton && (
            <MRT_IconButton
              onClick={() => table.lastPage()}
              disabled={disableNext}
              tooltip={localization.goToLastPage}
              aria-label={localization.goToLastPage}
              size="small"
            >
              <LastPageIcon className="h-4 w-4" />
            </MRT_IconButton>
          )}
        </div>
      </div>
    </div>
  );
};
