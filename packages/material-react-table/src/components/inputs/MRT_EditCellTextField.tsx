import {
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
  useState,
} from 'react';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '../../lib/utils';
import {
  type MRT_Cell,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { getValueAndLabel, parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_EditCellTextFieldProps<TData extends MRT_RowData> {
  cell: MRT_Cell<TData>;
  table: MRT_TableInstance<TData>;
  className?: string;
}

export const MRT_EditCellTextField = <TData extends MRT_RowData>({
  cell,
  table,
  className,
}: MRT_EditCellTextFieldProps<TData>) => {
  const {
    getState,
    options: { createDisplayMode, editDisplayMode, muiEditTextFieldProps },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingCell,
    setEditingRow,
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;
  const { creatingRow, editingRow } = getState();
  const { editSelectOptions, editVariant } = columnDef;

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const [value, setValue] = useState(() => cell.getValue<string>());
  const [completesComposition, setCompletesComposition] = useState(true);

  const textFieldProps = {
    ...parseFromValuesOrFunc(muiEditTextFieldProps, {
      cell,
      column,
      row,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.muiEditTextFieldProps, {
      cell,
      column,
      row,
      table,
    }),
  };

  const selectOptions = parseFromValuesOrFunc(editSelectOptions, {
    cell,
    column,
    row,
    table,
  });

  const isSelectEdit = editVariant === 'select' || (textFieldProps as any)?.select;
  const isDisabled = parseFromValuesOrFunc(columnDef.enableEditing, row) === false;

  const saveInputValueToRowCache = (newValue: string) => {
    //@ts-expect-error
    row._valuesCache[column.id] = newValue;
    if (isCreating) {
      setCreatingRow(row);
    } else if (isEditing) {
      setEditingRow(row);
    }
  };

  const handleChange = (newValue: string) => {
    textFieldProps.onChange?.({
      target: { value: newValue },
    } as ChangeEvent<HTMLInputElement>);
    setValue(newValue);
    if (isSelectEdit) {
      saveInputValueToRowCache(newValue);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    textFieldProps.onBlur?.(event);
    saveInputValueToRowCache(value);
    setEditingCell(null);
  };

  const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    textFieldProps.onKeyDown?.(event);
    if (event.key === 'Enter' && !event.shiftKey && completesComposition) {
      editInputRefs.current?.[column.id]?.blur();
    }
  };

  if (columnDef.Edit) {
    return <>{columnDef.Edit?.({ cell, column, row, table })}</>;
  }

  const showLabel = ['custom', 'modal'].includes(
    (isCreating ? createDisplayMode : editDisplayMode) as string,
  );

  const placeholder = !showLabel ? columnDef.header : undefined;

  // Render select edit
  if (isSelectEdit) {
    return (
      <div className="w-full">
        {showLabel && (
          <label className="text-sm font-medium mb-1 block">
            {columnDef.header}
          </label>
        )}
        <Select
          value={value ?? ''}
          onValueChange={handleChange}
          disabled={isDisabled}
        >
          <SelectTrigger
            ref={(ref) => {
              if (ref) {
                editInputRefs.current![column.id] = ref as any;
              }
            }}
            className={cn('h-9', className)}
            onClick={(e) => {
              e.stopPropagation();
              textFieldProps?.onClick?.(e as any);
            }}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {selectOptions?.map((option) => {
              const { label, value: optionValue } = getValueAndLabel(option);
              return (
                <SelectItem key={optionValue} value={optionValue}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Render text input edit
  return (
    <div className="w-full">
      {showLabel && (
        <label className="text-sm font-medium mb-1 block">
          {columnDef.header}
        </label>
      )}
      <Input
        ref={(ref) => {
          if (ref) {
            editInputRefs.current![column.id] = ref;
          }
        }}
        type="text"
        name={column.id}
        value={value ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleEnterKeyDown}
        onCompositionStart={() => setCompletesComposition(false)}
        onCompositionEnd={() => setCompletesComposition(true)}
        onClick={(e) => {
          e.stopPropagation();
          textFieldProps?.onClick?.(e as any);
        }}
        placeholder={placeholder}
        disabled={isDisabled}
        className={cn(
          'h-9',
          editDisplayMode === 'table' && 'border-0 shadow-none focus-visible:ring-0',
          className,
        )}
        {...textFieldProps}
      />
    </div>
  );
};
