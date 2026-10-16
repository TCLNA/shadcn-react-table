import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { MRT_Button } from './MRT_Button';
import { MRT_IconButton } from './MRT_IconButton';
import { cn } from '../../lib/utils';

export interface MRT_EditActionButtonsProps<TData extends MRT_RowData> {
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
  variant?: 'icon' | 'text';
  className?: string;
}

export const MRT_EditActionButtons = <TData extends MRT_RowData>({
  row,
  table,
  variant = 'icon',
  className,
}: MRT_EditActionButtonsProps<TData>) => {
  const {
    getState,
    options: {
      icons: { CancelIcon, SaveIcon, CircularProgressIcon },
      localization,
      onCreatingRowCancel,
      onCreatingRowSave,
      onEditingRowCancel,
      onEditingRowSave,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingRow,
  } = table;
  const { creatingRow, editingRow, isSaving } = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const handleCancel = () => {
    if (isCreating) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else if (isEditing) {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    row._valuesCache = {} as any; //reset values cache
  };

  const handleSubmitRow = () => {
    //look for auto-filled input values
    Object.values(editInputRefs.current ?? {})
      .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
      ?.forEach((input) => {
        if (
          input.value !== undefined &&
          Object.hasOwn(row?._valuesCache as object, input.name)
        ) {
          // @ts-expect-error
          row._valuesCache[input.name] = input.value;
        }
      });
    if (isCreating)
      onCreatingRowSave?.({
        exitCreatingMode: () => setCreatingRow(null),
        row,
        table,
        values: row._valuesCache,
      });
    else if (isEditing) {
      onEditingRowSave?.({
        exitEditingMode: () => setEditingRow(null),
        row,
        table,
        values: row?._valuesCache,
      });
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn('flex gap-3', className)}
    >
      {variant === 'icon' ? (
        <>
          <MRT_IconButton
            aria-label={localization.cancel}
            onClick={handleCancel}
            tooltip={localization.cancel}
          >
            <CancelIcon />
          </MRT_IconButton>
          {((isCreating && onCreatingRowSave) ||
            (isEditing && onEditingRowSave)) && (
            <MRT_IconButton
              aria-label={localization.save}
              disabled={isSaving}
              onClick={handleSubmitRow}
              tooltip={localization.save}
              className="text-info"
            >
              {isSaving ? (
                <CircularProgressIcon className="h-[18px] w-[18px] animate-spin" />
              ) : (
                <SaveIcon />
              )}
            </MRT_IconButton>
          )}
        </>
      ) : (
        <>
          <MRT_Button onClick={handleCancel} className="min-w-[100px]">
            {localization.cancel}
          </MRT_Button>
          <MRT_Button
            disabled={isSaving}
            onClick={handleSubmitRow}
            variant="default"
            className="min-w-[100px]"
          >
            {isSaving && (
              <CircularProgressIcon className="h-[18px] w-[18px] animate-spin" />
            )}
            {localization.save}
          </MRT_Button>
        </>
      )}
    </div>
  );
};
