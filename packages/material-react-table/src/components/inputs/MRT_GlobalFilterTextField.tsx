import {
  type ChangeEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Collapsible, CollapsibleContent } from '../ui/collapsible';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_FilterOptionMenu } from '../menus/MRT_FilterOptionMenu';
import { cn } from '../../lib/utils';

// Custom debounce utility (replaces MUI's debounce)
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

export interface MRT_GlobalFilterTextFieldProps<TData extends MRT_RowData> {
  table: MRT_TableInstance<TData>;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const MRT_GlobalFilterTextField = <TData extends MRT_RowData>({
  table,
  className,
  ...rest
}: MRT_GlobalFilterTextFieldProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilterModes,
      icons: { CloseIcon, SearchIcon },
      localization,
      manualFiltering,
      muiSearchTextFieldProps,
    },
    refs: { searchInputRef },
    setGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = getState();

  const textFieldProps = {
    ...parseFromValuesOrFunc(muiSearchTextFieldProps, {
      table,
    }),
    ...rest,
  };

  const isMounted = useRef(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchValue, setSearchValue] = useState(globalFilter ?? '');

  const handleChangeDebounced = useCallback(
    debounce(
      (event: ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(event.target.value ?? undefined);
      },
      manualFiltering ? 500 : 250,
    ),
    [],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    handleChangeDebounced(event);
  };

  const handleGlobalFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClear = () => {
    setSearchValue('');
    setGlobalFilter(undefined);
  };

  useEffect(() => {
    if (isMounted.current) {
      if (globalFilter === undefined) {
        handleClear();
      } else {
        setSearchValue(globalFilter);
      }
    }
    isMounted.current = true;
  }, [globalFilter]);

  return (
    <Collapsible open={showGlobalFilter}>
      <CollapsibleContent className="overflow-visible">
        <div className={cn('relative inline-flex items-center', className)}>
          {/* Start adornment - Search icon or filter mode button */}
          {enableGlobalFilterModes ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 h-7 w-7 z-10"
                    onClick={handleGlobalFilterMenuOpen}
                    aria-label={localization.changeSearchMode}
                  >
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{localization.changeSearchMode}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          )}

          {/* Input field */}
          <Input
            ref={searchInputRef}
            type="text"
            placeholder={textFieldProps.placeholder ?? localization.search}
            value={searchValue ?? ''}
            onChange={handleChange}
            disabled={textFieldProps.disabled}
            autoComplete="off"
            className={cn(
              'h-9 pr-10',
              enableGlobalFilterModes ? 'pl-10' : 'pl-9',
              textFieldProps.className,
            )}
            {...textFieldProps}
          />

          {/* End adornment - Clear button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 h-7 w-7"
                  onClick={handleClear}
                  disabled={!searchValue?.length}
                  aria-label={localization.clearSearch}
                >
                  <CloseIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{localization.clearSearch ?? ''}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CollapsibleContent>
      <MRT_FilterOptionMenu
        anchorEl={anchorEl}
        onSelect={handleClear}
        setAnchorEl={setAnchorEl}
        table={table}
      />
    </Collapsible>
  );
};
