import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { X, Check } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MRT_IconButton } from '../buttons/MRT_IconButton';
import { MRT_DatePicker } from './MRT_DatePicker';
import { MRT_DateRangePicker } from './MRT_DateRangePicker';
import { cn } from '../../lib/utils';
import {
  type DropdownOption,
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import {
  getColumnFilterInfo,
  useDropdownOptions,
} from '../../utils/column.utils';
import { getValueAndLabel, parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_FilterOptionMenu } from '../menus/MRT_FilterOptionMenu';

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export interface MRT_FilterTextFieldProps<TData extends MRT_RowData> {
  header: MRT_Header<TData>;
  rangeFilterIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_FilterTextField = <TData extends MRT_RowData>({
  header,
  rangeFilterIndex,
  table,
}: MRT_FilterTextFieldProps<TData>) => {
  const {
    options: {
      enableColumnFilterModes,
      icons: { CloseIcon, FilterListIcon },
      localization,
      manualFiltering,
      muiFilterTextFieldProps,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { filterVariant } = columnDef;

  const args = { column, rangeFilterIndex, table };

  const textFieldProps = {
    ...parseFromValuesOrFunc(muiFilterTextFieldProps, args),
    ...parseFromValuesOrFunc(columnDef.muiFilterTextFieldProps, args),
  };

  const {
    allowedColumnFilterOptions,
    currentFilterOption,
    facetedUniqueValues,
    isAutocompleteFilter,
    isDateFilter,
    isMultiSelectFilter,
    isRangeFilter,
    isSelectFilter,
    isTextboxFilter,
  } = getColumnFilterInfo({ header, table });

  const dropdownOptions = useDropdownOptions({ header, table });

  const filterChipLabel = ['empty', 'notEmpty'].includes(currentFilterOption)
    ? localization[
        `filter${
          currentFilterOption?.charAt?.(0)?.toUpperCase() +
          currentFilterOption?.slice(1)
        }` as keyof typeof localization
      ]
    : '';

  const filterPlaceholder = !isRangeFilter
    ? (textFieldProps?.placeholder ??
      localization.filterByColumn?.replace(
        '{column}',
        String(columnDef.header),
      ))
    : rangeFilterIndex === 0
      ? localization.min
      : rangeFilterIndex === 1
        ? localization.max
        : '';

  const showChangeModeButton = !!(
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    !rangeFilterIndex &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length)
  );

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filterValue, setFilterValue] = useState<string | string[]>(() =>
    isMultiSelectFilter
      ? (column.getFilterValue() as string[]) || []
      : isRangeFilter
        ? (column.getFilterValue() as [string, string])?.[
            rangeFilterIndex as number
          ] || ''
        : isAutocompleteFilter
          ? typeof column.getFilterValue() === 'string'
            ? (column.getFilterValue() as string)
            : ''
          : ((column.getFilterValue() as string) ?? ''),
  );
  const [autocompleteValue, setAutocompleteValue] =
    useState<DropdownOption | null>(() =>
      isAutocompleteFilter
        ? ((column.getFilterValue() || null) as DropdownOption | null)
        : null,
    );
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);

  const handleChangeDebounced = useCallback(
    debounce(
      (newValue: any) => {
        if (isRangeFilter) {
          column.setFilterValue((old: Array<Date | null | number | string>) => {
            const newFilterValues = old ?? ['', ''];
            newFilterValues[rangeFilterIndex as number] = newValue ?? undefined;
            return newFilterValues;
          });
        } else {
          column.setFilterValue(newValue ?? undefined);
        }
      },
      isTextboxFilter ? (manualFiltering ? 400 : 200) : 1,
    ),
    [],
  );

  const handleChange = (newValue: any) => {
    setFilterValue(newValue ?? '');
    handleChangeDebounced(newValue);
  };

  const handleTextFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue =
      textFieldProps.type === 'date'
        ? event.target.valueAsDate
        : textFieldProps.type === 'number'
          ? event.target.valueAsNumber
          : event.target.value;
    handleChange(newValue);
    textFieldProps?.onChange?.(event);
  };

  const handleClear = () => {
    if (isMultiSelectFilter) {
      setFilterValue([]);
      column.setFilterValue([]);
    } else if (isRangeFilter) {
      setFilterValue('');
      column.setFilterValue((old: [string | undefined, string | undefined]) => {
        const newFilterValues = (Array.isArray(old) && old) || ['', ''];
        newFilterValues[rangeFilterIndex as number] = undefined;
        return newFilterValues;
      });
    } else if (isAutocompleteFilter) {
      setAutocompleteValue(null);
      setFilterValue('');
    } else {
      setFilterValue('');
      column.setFilterValue(undefined);
    }
  };

  const handleClearEmptyFilterChip = () => {
    setFilterValue('');
    column.setFilterValue(undefined);
    setColumnFilterFns((prev) => ({
      ...prev,
      [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
    }));
  };

  const handleFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      const filterValue = column.getFilterValue();
      if (filterValue === undefined) {
        handleClear();
      } else if (isRangeFilter && rangeFilterIndex !== undefined) {
        setFilterValue((filterValue as [string, string])[rangeFilterIndex]);
      } else {
        setFilterValue(filterValue as string);
      }
    }
    isMounted.current = true;
  }, [column.getFilterValue()]);

  if (columnDef.Filter) {
    return (
      <>{columnDef.Filter?.({ column, header, rangeFilterIndex, table })}</>
    );
  }

  const minWidth = isDateFilter
    ? 'min-w-[160px]'
    : enableColumnFilterModes && rangeFilterIndex === 0
      ? 'min-w-[110px]'
      : isRangeFilter
        ? 'min-w-[100px]'
        : !filterChipLabel
          ? 'min-w-[120px]'
          : 'min-w-auto';

  // Render autocomplete filter
  if (isAutocompleteFilter) {
    return (
      <div className={cn('relative w-full', minWidth)}>
        <Popover open={autocompleteOpen} onOpenChange={setAutocompleteOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              {showChangeModeButton && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                  <MRT_IconButton
                    onClick={handleFilterMenuOpen}
                    size="small"
                    tooltip={localization.changeFilterMode}
                  >
                    <FilterListIcon className="h-4 w-4" />
                  </MRT_IconButton>
                </div>
              )}
              <Input
                ref={(ref) => {
                  if (ref) {
                    filterInputRefs.current![`${column.id}-${rangeFilterIndex ?? 0}`] = ref;
                  }
                }}
                value={filterValue as string}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                  handleChangeDebounced(e.target.value);
                }}
                placeholder={filterPlaceholder}
                className={cn(
                  'h-8',
                  showChangeModeButton && 'pl-10',
                )}
                onKeyDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder={localization.search || 'Search...'} />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {dropdownOptions?.map((option, index) => {
                    const { label, value } = getValueAndLabel(option);
                    return (
                      <CommandItem
                        key={`${index}-${value}`}
                        value={value}
                        onSelect={() => {
                          setAutocompleteValue(option);
                          setFilterValue(value);
                          handleChangeDebounced(value);
                          setAutocompleteOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            autocompleteValue === option
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {showChangeModeButton && filterChipLabel && (
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
              {filterChipLabel}
            </span>
            <MRT_IconButton size="small" onClick={handleClearEmptyFilterChip}>
              <X className="h-3 w-3" />
            </MRT_IconButton>
          </div>
        )}
        <MRT_FilterOptionMenu
          anchorEl={anchorEl}
          header={header}
          setAnchorEl={setAnchorEl}
          setFilterValue={setFilterValue}
          table={table}
        />
      </div>
    );
  }

  // Render select or multi-select filter
  if (isSelectFilter || isMultiSelectFilter) {
    if (isMultiSelectFilter) {
      // Multi-select using checkboxes in a popover
      const selectedValues = Array.isArray(filterValue) ? filterValue : [];
      return (
        <div className={cn('relative w-full', minWidth)}>
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                {showChangeModeButton && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                    <MRT_IconButton
                      onClick={handleFilterMenuOpen}
                      size="small"
                      tooltip={localization.changeFilterMode}
                    >
                      <FilterListIcon className="h-4 w-4" />
                    </MRT_IconButton>
                  </div>
                )}
                <button
                  className={cn(
                    'flex h-8 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm',
                    'focus:outline-none focus:ring-1 focus:ring-ring',
                    showChangeModeButton && 'pl-10',
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  {selectedValues.length === 0 ? (
                    <span className="text-muted-foreground">{filterPlaceholder}</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedValues.map((value) => {
                        const selectedOption = dropdownOptions?.find(
                          (option) => getValueAndLabel(option).value === value,
                        );
                        return (
                          <span
                            key={value}
                            className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs"
                          >
                            {getValueAndLabel(selectedOption).label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2" align="start">
              <div className="space-y-2">
                {dropdownOptions?.map((option, index) => {
                  const { label, value } = getValueAndLabel(option);
                  const isChecked = selectedValues.includes(value);
                  return (
                    <div key={`${index}-${value}`} className="flex items-center gap-2">
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const newValues = checked
                            ? [...selectedValues, value]
                            : selectedValues.filter((v) => v !== value);
                          setFilterValue(newValues);
                          column.setFilterValue(newValues);
                        }}
                      />
                      <label className="text-sm cursor-pointer flex-1">
                        {label}
                        {!columnDef.filterSelectOptions &&
                          ` (${facetedUniqueValues.get(value)})`}
                      </label>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          <MRT_FilterOptionMenu
            anchorEl={anchorEl}
            header={header}
            setAnchorEl={setAnchorEl}
            setFilterValue={setFilterValue}
            table={table}
          />
        </div>
      );
    }

    // Single select
    return (
      <div className={cn('relative w-full', minWidth)}>
        <div className="relative">
          {showChangeModeButton && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <MRT_IconButton
                onClick={handleFilterMenuOpen}
                size="small"
                tooltip={localization.changeFilterMode}
              >
                <FilterListIcon className="h-4 w-4" />
              </MRT_IconButton>
            </div>
          )}
          <Select
            value={filterValue as string}
            onValueChange={(value) => {
              setFilterValue(value);
              column.setFilterValue(value);
            }}
          >
            <SelectTrigger
              className={cn('h-8', showChangeModeButton && 'pl-10')}
              onClick={(e) => e.stopPropagation()}
            >
              <SelectValue placeholder={filterPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {dropdownOptions?.map((option, index) => {
                const { label, value } = getValueAndLabel(option);
                return (
                  <SelectItem key={`${index}-${value}`} value={value}>
                    {label}
                    {!columnDef.filterSelectOptions &&
                      ` (${facetedUniqueValues.get(value)})`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <MRT_FilterOptionMenu
          anchorEl={anchorEl}
          header={header}
          setAnchorEl={setAnchorEl}
          setFilterValue={setFilterValue}
          table={table}
        />
      </div>
    );
  }

  // Render date filter
  if (isDateFilter) {
    const isDateRangeFilter = filterVariant === 'date-range' || 
                               filterVariant === 'datetime-range' || 
                               filterVariant === 'time-range';

    if (isDateRangeFilter) {
      // Date range filter
      const dateRangeValue = column.getFilterValue() as DateRange | undefined;
      
      return (
        <div className={cn('relative w-full', minWidth)}>
          <div className="relative">
            {showChangeModeButton && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <MRT_IconButton
                  onClick={handleFilterMenuOpen}
                  size="small"
                  tooltip={localization.changeFilterMode}
                >
                  <FilterListIcon className="h-4 w-4" />
                </MRT_IconButton>
              </div>
            )}
            <div className={cn(showChangeModeButton && 'pl-10')}>
              <MRT_DateRangePicker
                value={dateRangeValue}
                onChange={(dateRange) => {
                  column.setFilterValue(dateRange ?? undefined);
                }}
                placeholder={filterPlaceholder}
                disabled={textFieldProps.disabled}
                className="w-full"
              />
            </div>
          </div>
          {showChangeModeButton && (
            <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
              {localization.filterMode.replace(
                '{filterType}',
                localization[
                  `filter${
                    currentFilterOption?.charAt(0)?.toUpperCase() +
                    currentFilterOption?.slice(1)
                  }` as keyof typeof localization
                ],
              )}
            </div>
          )}
          <MRT_FilterOptionMenu
            anchorEl={anchorEl}
            header={header}
            setAnchorEl={setAnchorEl}
            setFilterValue={setFilterValue}
            table={table}
          />
        </div>
      );
    } else {
      // Single date filter
      const dateValue = column.getFilterValue() as Date | undefined;
      
      return (
        <div className={cn('relative w-full', minWidth)}>
          <div className="relative">
            {showChangeModeButton && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                <MRT_IconButton
                  onClick={handleFilterMenuOpen}
                  size="small"
                  tooltip={localization.changeFilterMode}
                >
                  <FilterListIcon className="h-4 w-4" />
                </MRT_IconButton>
              </div>
            )}
            <div className={cn(showChangeModeButton && 'pl-10')}>
              <MRT_DatePicker
                value={dateValue}
                onChange={(date) => {
                  column.setFilterValue(date ?? undefined);
                }}
                placeholder={filterPlaceholder}
                disabled={textFieldProps.disabled}
                className="w-full"
              />
            </div>
          </div>
          {showChangeModeButton && (
            <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
              {localization.filterMode.replace(
                '{filterType}',
                localization[
                  `filter${
                    currentFilterOption?.charAt(0)?.toUpperCase() +
                    currentFilterOption?.slice(1)
                  }` as keyof typeof localization
                ],
              )}
            </div>
          )}
          <MRT_FilterOptionMenu
            anchorEl={anchorEl}
            header={header}
            setAnchorEl={setAnchorEl}
            setFilterValue={setFilterValue}
            table={table}
          />
        </div>
      );
    }
  }

  // Render standard text input filter
  return (
    <div className={cn('relative w-full', minWidth)}>
      <div className="relative">
        {showChangeModeButton && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
            <MRT_IconButton
              onClick={handleFilterMenuOpen}
              size="small"
              tooltip={localization.changeFilterMode}
            >
              <FilterListIcon className="h-4 w-4" />
            </MRT_IconButton>
          </div>
        )}
        <Input
          ref={(ref) => {
            if (ref) {
              filterInputRefs.current![`${column.id}-${rangeFilterIndex ?? 0}`] = ref;
            }
          }}
          type={textFieldProps.type || 'text'}
          value={filterValue as string}
          onChange={handleTextFieldChange}
          placeholder={filterChipLabel || filterPlaceholder}
          disabled={!!filterChipLabel}
          className={cn(
            'h-8',
            showChangeModeButton && 'pl-10',
            (filterValue?.toString()?.length ?? 0) > 0 && 'pr-10',
            filterChipLabel && 'w-0',
          )}
          onKeyDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          {...textFieldProps}
        />
        {!filterChipLabel && (filterValue?.toString()?.length ?? 0) > 0 && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <MRT_IconButton size="small" onClick={handleClear} tooltip={localization.clearFilter}>
              <CloseIcon className="h-4 w-4" />
            </MRT_IconButton>
          </div>
        )}
      </div>
      {showChangeModeButton && filterChipLabel && (
        <div className="mt-1 flex items-center gap-1">
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
            {filterChipLabel}
          </span>
          <MRT_IconButton size="small" onClick={handleClearEmptyFilterChip}>
            <X className="h-3 w-3" />
          </MRT_IconButton>
        </div>
      )}
      {showChangeModeButton && !filterChipLabel && (
        <div className="text-xs text-muted-foreground mt-1 whitespace-nowrap">
          {localization.filterMode.replace(
            '{filterType}',
            localization[
              `filter${
                currentFilterOption?.charAt(0)?.toUpperCase() +
                currentFilterOption?.slice(1)
              }` as keyof typeof localization
            ],
          )}
        </div>
      )}
      <MRT_FilterOptionMenu
        anchorEl={anchorEl}
        header={header}
        setAnchorEl={setAnchorEl}
        setFilterValue={setFilterValue}
        table={table}
      />
    </div>
  );
};
