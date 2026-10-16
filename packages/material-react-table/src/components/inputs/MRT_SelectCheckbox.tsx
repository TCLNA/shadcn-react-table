import { type MouseEvent } from 'react';
import { Checkbox } from '../ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { cn } from '../../lib/utils';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import {
  getIsRowSelected,
  getMRT_RowSelectionHandler,
  getMRT_SelectAllHandler,
} from '../../utils/row.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_SelectCheckboxProps<TData extends MRT_RowData> {
  row?: MRT_Row<TData>;
  staticRowIndex?: number;
  table: MRT_TableInstance<TData>;
  className?: string;
}

export const MRT_SelectCheckbox = <TData extends MRT_RowData>({
  row,
  staticRowIndex,
  table,
  className,
}: MRT_SelectCheckboxProps<TData>) => {
  const {
    getState,
    options: {
      enableMultiRowSelection,
      localization,
      muiSelectAllCheckboxProps,
      muiSelectCheckboxProps,
      selectAllMode,
    },
  } = table;
  const { density, isLoading } = getState();

  const selectAll = !row;

  const allRowsSelected = selectAll
    ? selectAllMode === 'page'
      ? table.getIsAllPageRowsSelected()
      : table.getIsAllRowsSelected()
    : undefined;

  const isChecked = selectAll
    ? allRowsSelected
    : getIsRowSelected({ row, table });

  const checkboxProps = {
    ...(selectAll
      ? parseFromValuesOrFunc(muiSelectAllCheckboxProps, { table })
      : parseFromValuesOrFunc(muiSelectCheckboxProps, {
          row,
          staticRowIndex,
          table,
        })),
  };

  const onSelectionChange = row
    ? getMRT_RowSelectionHandler({
        row,
        staticRowIndex,
        table,
      })
    : undefined;

  const onSelectAllChange = getMRT_SelectAllHandler({ table });

  const isDisabled =
    isLoading || (row && !row.getCanSelect()) || row?.id === 'mrt-row-create';

  const isIndeterminate = !isChecked && selectAll
    ? table.getIsSomeRowsSelected()
    : row?.getIsSomeSelected() && row.getCanSelectSubRows();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (selectAll) {
      onSelectAllChange(event as any);
    } else {
      onSelectionChange!(event as any);
    }
    checkboxProps?.onClick?.(event);
  };

  const ariaLabel = selectAll
    ? localization.toggleSelectAll
    : localization.toggleSelectRow;

  const tooltipTitle =
    checkboxProps?.title ??
    (selectAll
      ? localization.toggleSelectAll
      : localization.toggleSelectRow);

  // Size based on density
  const sizeClass =
    density === 'compact' ? 'h-4 w-4' : 'h-5 w-5';

  // For single row selection, use a radio-style appearance
  // Note: shadcn/ui doesn't have a Radio component by default, so we'll use Checkbox
  // with custom styling to indicate single selection mode
  const checkboxElement = (
    <Checkbox
      checked={isChecked}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={cn(
        sizeClass,
        enableMultiRowSelection === false && 'rounded-full', // Radio-style for single selection
        className,
      )}
      // @ts-expect-error - indeterminate is not in the type but is supported
      indeterminate={isIndeterminate}
      onCheckedChange={(checked) => {
        // Create a synthetic event for compatibility
        const syntheticEvent = {
          stopPropagation: () => {},
          target: { checked },
        } as any;
        
        if (selectAll) {
          onSelectAllChange(syntheticEvent);
        } else {
          onSelectionChange!(syntheticEvent);
        }
      }}
      onClick={handleClick}
    />
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center justify-center">
            {checkboxElement}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipTitle}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
