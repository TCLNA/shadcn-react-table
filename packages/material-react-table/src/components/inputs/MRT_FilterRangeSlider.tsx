import { useEffect, useRef, useState } from 'react';
import { Slider } from '../ui/slider';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { cn } from '../../lib/utils';

export interface MRT_FilterRangeSliderProps<TData extends MRT_RowData> {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const MRT_FilterRangeSlider = <TData extends MRT_RowData>({
  header,
  table,
  className,
  ...rest
}: MRT_FilterRangeSliderProps<TData>) => {
  const {
    options: { enableColumnFilterModes, localization, muiFilterSliderProps },
    refs: { filterInputRefs },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const currentFilterOption = columnDef._filterFn;

  const showChangeModeButton =
    enableColumnFilterModes && columnDef.enableColumnFilterModes !== false;

  const sliderProps = {
    ...parseFromValuesOrFunc(muiFilterSliderProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.muiFilterSliderProps, { column, table }),
    ...rest,
  };

  let [min, max] =
    sliderProps.min !== undefined && sliderProps.max !== undefined
      ? [sliderProps.min, sliderProps.max]
      : (column.getFacetedMinMaxValues() ?? [0, 1]);

  //fix potential TanStack Table bugs where min or max is an array
  if (Array.isArray(min)) min = min[0];
  if (Array.isArray(max)) max = max[0];
  if (min === null) min = 0;
  if (max === null) max = 1;

  const [filterValues, setFilterValues] = useState([min, max]);
  const columnFilterValue = column.getFilterValue();

  const isMounted = useRef(false);

  // prevent moving the focus to the next/prev cell when using the arrow keys
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.stopPropagation();
    }
  };

  useEffect(() => {
    if (isMounted.current) {
      if (columnFilterValue === undefined) {
        setFilterValues([min, max]);
      } else if (Array.isArray(columnFilterValue)) {
        setFilterValues(columnFilterValue);
      }
    }
    isMounted.current = true;
  }, [columnFilterValue, min, max]);

  return (
    <div className="flex flex-col gap-1">
      <Slider
        min={min}
        max={max}
        step={sliderProps.step ?? 1}
        value={filterValues}
        onValueChange={(values) => {
          setFilterValues(values as [number, number]);
        }}
        onValueCommit={(value) => {
          if (Array.isArray(value)) {
            if (value[0] <= min && value[1] >= max) {
              //if the user has selected the entire range, remove the filter
              column.setFilterValue(undefined);
            } else {
              column.setFilterValue(value as [number, number]);
            }
          }
        }}
        onKeyDown={handleKeyDown}
        disabled={sliderProps.disabled}
        className={cn(
          'mx-auto px-1 w-full',
          showChangeModeButton ? 'mt-1.5' : 'mt-2.5',
          className,
          sliderProps.className,
        )}
        style={{
          minWidth: `${column.getSize() - 50}px`,
          width: 'calc(100% - 8px)',
        }}
        ref={(node) => {
          if (node && filterInputRefs.current) {
            filterInputRefs.current[`${column.id}-0`] = node as any;
          }
        }}
      />
      {showChangeModeButton && (
        <p className="text-xs leading-tight -mx-1.5 -my-0.5 whitespace-nowrap text-muted-foreground">
          {localization.filterMode.replace(
            '{filterType}',
            localization[
              `filter${
                currentFilterOption?.charAt(0)?.toUpperCase() +
                currentFilterOption?.slice(1)
              }` as keyof typeof localization
            ],
          )}
        </p>
      )}
    </div>
  );
};
