import { type MouseEvent } from 'react';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
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
      selectAllCheckboxProps,
      selectCheckboxProps,
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

  const checkboxProps = selectAll
    ? parseFromValuesOrFunc(selectAllCheckboxProps, { table })
    : parseFromValuesOrFunc(selectCheckboxProps, {
        row,
        staticRowIndex,
        table,
      });

  const onSelectionChange = row
    ? getMRT_RowSelectionHandler({
        row,
        staticRowIndex,
        table,
      })
    : undefined;

  const onSelectAllChange = getMRT_SelectAllHandler({ table });

  const handleChange = () => {
    const event = new Event('change') as any;
    selectAll ? onSelectAllChange(event) : onSelectionChange!(event);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    checkboxProps?.onClick?.(e);
  };

  const disabled =
    isLoading || (row && !row.getCanSelect()) || row?.id === 'mrt-row-create';

  const checkboxClassName = cn(
    density === 'compact' ? 'h-7 w-7' : 'h-10 w-10',
    density !== 'compact' && '-m-1.5',
    className,
    checkboxProps?.className
  );

  const tooltipText =
    checkboxProps?.title ??
    (selectAll
      ? localization.toggleSelectAll
      : localization.toggleSelectRow);

  return (
    <Tooltip>
      <TooltipTrigger asChild onClick={handleClick}>
        {enableMultiRowSelection === false ? (
          <RadioGroupItem
            aria-label={
              selectAll
                ? localization.toggleSelectAll
                : localization.toggleSelectRow
            }
            checked={isChecked}
            disabled={disabled}
            onCheckedChange={handleChange}
            className={checkboxClassName}
            {...checkboxProps}
          />
        ) : (
          <Checkbox
            aria-label={
              selectAll
                ? localization.toggleSelectAll
                : localization.toggleSelectRow
            }
            checked={
              !isChecked && selectAll
                ? table.getIsSomeRowsSelected()
                  ? 'indeterminate'
                  : false
                : isChecked
            }
            disabled={disabled}
            onCheckedChange={handleChange}
            className={checkboxClassName}
            {...checkboxProps}
          />
        )}
      </TooltipTrigger>
      <TooltipContent>{tooltipText}</TooltipContent>
    </Tooltip>
  );
};
