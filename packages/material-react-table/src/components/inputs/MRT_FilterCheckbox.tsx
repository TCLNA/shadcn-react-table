import { Checkbox } from '../ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { cn } from '../../lib/utils';
import {
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_FilterCheckboxProps<TData extends MRT_RowData> {
  column: MRT_Column<TData>;
  table: MRT_TableInstance<TData>;
  className?: string;
}

export const MRT_FilterCheckbox = <TData extends MRT_RowData>({
  column,
  table,
  className,
}: MRT_FilterCheckboxProps<TData>) => {
  const {
    getState,
    options: { localization, muiFilterCheckboxProps },
  } = table;
  const { density } = getState();
  const { columnDef } = column;

  const checkboxProps = {
    ...parseFromValuesOrFunc(muiFilterCheckboxProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.muiFilterCheckboxProps, {
      column,
      table,
    }),
  };

  const filterLabel = localization.filterByColumn?.replace(
    '{column}',
    columnDef.header,
  );

  const filterValue = column.getFilterValue();
  const isChecked = filterValue === 'true';
  const isIndeterminate = filterValue === undefined;

  const handleChange = () => {
    const currentValue = column.getFilterValue();
    const newValue =
      currentValue === undefined
        ? 'true'
        : currentValue === 'true'
          ? 'false'
          : undefined;
    column.setFilterValue(newValue);
  };

  const sizeClass = density === 'compact' ? 'h-4 w-4' : 'h-5 w-5';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground font-normal -mt-1">
            <Checkbox
              checked={isChecked}
              // @ts-expect-error - indeterminate is not in the type but is supported
              indeterminate={isIndeterminate}
              onCheckedChange={handleChange}
              onClick={(e) => {
                e.stopPropagation();
                checkboxProps?.onClick?.(e);
              }}
              className={cn(sizeClass, className)}
              {...checkboxProps}
            />
            <span>{checkboxProps.title ?? filterLabel}</span>
          </label>
        </TooltipTrigger>
        <TooltipContent>
          {checkboxProps?.title ?? filterLabel}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
