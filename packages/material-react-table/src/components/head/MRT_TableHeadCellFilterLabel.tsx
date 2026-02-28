import { type MouseEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent } from '../ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { MRT_TableHeadCellFilterContainer } from './MRT_TableHeadCellFilterContainer';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import {
  getColumnFilterInfo,
  useDropdownOptions,
} from '../../utils/column.utils';
import { getValueAndLabel } from '../../utils/utils';
import { cn } from '../../lib/utils';

// IconButtonProps type for compatibility
interface IconButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export interface MRT_TableHeadCellFilterLabelProps<TData extends MRT_RowData>
  extends IconButtonProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellFilterLabel = <TData extends MRT_RowData = {}>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellFilterLabelProps<TData>) => {
  const {
    options: {
      columnFilterDisplayMode,
      icons: { FilterAltIcon },
      localization,
    },
    refs: { filterInputRefs },
    setShowColumnFilters,
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const filterValue = column.getFilterValue() as [string, string] | string;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const {
    currentFilterOption,
    isMultiSelectFilter,
    isRangeFilter,
    isSelectFilter,
  } = getColumnFilterInfo({ header, table });

  const dropdownOptions = useDropdownOptions({ header, table });

  const getSelectLabel = (index?: number) =>
    getValueAndLabel(
      dropdownOptions?.find(
        (option) =>
          getValueAndLabel(option).value ===
          (index !== undefined ? filterValue[index] : filterValue),
      ),
    ).label;

  const isFilterActive =
    (Array.isArray(filterValue) && filterValue.some(Boolean)) ||
    (!!filterValue && !Array.isArray(filterValue));

  const filterTooltip =
    columnFilterDisplayMode === 'popover' && !isFilterActive
      ? localization.filterByColumn?.replace(
          '{column}',
          String(columnDef.header),
        )
      : localization.filteringByColumn
          .replace('{column}', String(columnDef.header))
          .replace(
            '{filterType}',
            currentFilterOption
              ? localization[
                  `filter${
                    currentFilterOption.charAt(0).toUpperCase() +
                    currentFilterOption.slice(1)
                  }` as keyof typeof localization
                ]
              : '',
          )
          .replace(
            '{filterValue}',
            `"${
              Array.isArray(filterValue)
                ? (filterValue as [string, string])
                    .map((value, index) =>
                      isMultiSelectFilter ? getSelectLabel(index) : value,
                    )
                    .join(
                      `" ${isRangeFilter ? localization.and : localization.or} "`,
                    )
                : isSelectFilter
                  ? getSelectLabel()
                  : (filterValue as string)
            }"`,
          )
          .replace('" "', '');

  return (
    <>
      {(columnFilterDisplayMode === 'popover' ||
        (!!filterValue && !isRangeFilter) ||
        (isRangeFilter && (!!filterValue?.[0] || !!filterValue?.[1]))) && (
        <span className="flex-[0_0_auto]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  if (columnFilterDisplayMode === 'popover') {
                    setAnchorEl(event.currentTarget);
                  } else {
                    setShowColumnFilters(true);
                  }
                  queueMicrotask(() => {
                    filterInputRefs.current?.[`${column.id}-0`]?.focus?.();
                    filterInputRefs.current?.[`${column.id}-0`]?.select?.();
                  });
                  event.stopPropagation();
                }}
                className={cn(
                  "h-4 w-4 ml-1 p-2 transition-all duration-150",
                  isFilterActive ? "opacity-100" : "opacity-30",
                  "scale-75",
                  rest?.className
                )}
                {...rest}
              >
                <FilterAltIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {filterTooltip}
            </TooltipContent>
          </Tooltip>
        </span>
      )}
      {columnFilterDisplayMode === 'popover' && (
        <Popover open={!!anchorEl} onOpenChange={(open) => !open && setAnchorEl(null)}>
          <PopoverContent
            className="p-4 overflow-visible"
            align="center"
            side="top"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.key === 'Enter' && setAnchorEl(null)}
          >
            <MRT_TableHeadCellFilterContainer header={header} table={table} />
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};
