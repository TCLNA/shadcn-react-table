import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Button } from '../ui/button';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { cn } from '../../lib/utils';

export interface MRT_TableHeadCellSortLabelProps<TData extends MRT_RowData>
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellSortLabel = <TData extends MRT_RowData>({
  header,
  table,
  className,
  ...rest
}: MRT_TableHeadCellSortLabelProps<TData>) => {
  const {
    getState,
    options: {
      icons: { ArrowDownwardIcon, ArrowUpwardIcon, SyncAltIcon },
      localization,
    },
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { isLoading, showSkeletons, sorting } = getState();

  const isSorted = !!column.getIsSorted();
  const sortDirection = column.getIsSorted();

  const sortTooltip =
    isLoading || showSkeletons
      ? ''
      : column.getIsSorted()
        ? column.getIsSorted() === 'desc'
          ? localization.sortedByColumnDesc.replace(
              '{column}',
              columnDef.header,
            )
          : localization.sortedByColumnAsc.replace('{column}', columnDef.header)
        : column.getNextSortingOrder() === 'desc'
          ? localization.sortByColumnDesc.replace('{column}', columnDef.header)
          : localization.sortByColumnAsc.replace('{column}', columnDef.header);

  // Determine which icon to show
  const SortIcon = !isSorted
    ? SyncAltIcon
    : sortDirection === 'desc'
      ? ArrowDownwardIcon
      : ArrowUpwardIcon;

  const sortIndex = sorting.length > 1 ? column.getSortIndex() + 1 : null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'relative h-auto w-auto p-0 transition-opacity duration-150',
              isSorted ? 'opacity-100' : 'opacity-30',
              'hover:bg-transparent hover:opacity-100',
              className,
            )}
            aria-label={sortTooltip}
            onClick={(e) => {
              e.stopPropagation();
              header.column.getToggleSortingHandler()?.(e);
            }}
            {...rest}
          >
            <SortIcon
              className={cn(
                'h-4 w-4 shrink-0',
                !isSorted && 'rotate-90 scale-x-90',
              )}
            />
            {sortIndex && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {sortIndex}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{sortTooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
