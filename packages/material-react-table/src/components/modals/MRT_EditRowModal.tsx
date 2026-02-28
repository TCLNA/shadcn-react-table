import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_EditActionButtons } from '../buttons/MRT_EditActionButtons';
import { MRT_EditCellTextField } from '../inputs/MRT_EditCellTextField';
import { cn } from '../../lib/utils';

export interface MRT_EditRowModalProps<TData extends MRT_RowData> {
  open: boolean;
  table: MRT_TableInstance<TData>;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const MRT_EditRowModal = <TData extends MRT_RowData>({
  open,
  table,
  onOpenChange,
  className,
}: MRT_EditRowModalProps<TData>) => {
  const {
    getState,
    options: {
      localization,
      muiCreateRowModalProps,
      muiEditRowDialogProps,
      onCreatingRowCancel,
      onEditingRowCancel,
      renderCreateRowDialogContent,
      renderEditRowDialogContent,
    },
    setCreatingRow,
    setEditingRow,
  } = table;
  const { creatingRow, editingRow } = getState();
  const row = (creatingRow ?? editingRow) as MRT_Row<TData>;

  const dialogProps = {
    ...parseFromValuesOrFunc(muiEditRowDialogProps, { row, table }),
    ...(creatingRow &&
      parseFromValuesOrFunc(muiCreateRowModalProps, { row, table })),
  };

  const internalEditComponents = row
    .getAllCells()
    .filter((cell) => cell.column.columnDef.columnDefType === 'data')
    .map((cell) => (
      <MRT_EditCellTextField
        cell={cell as any}
        key={cell.id}
        table={table as any}
      />
    ));

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (creatingRow) {
        onCreatingRowCancel?.({ row, table });
        setCreatingRow(null);
      } else {
        onEditingRowCancel?.({ row, table });
        setEditingRow(null);
      }
      row._valuesCache = {} as any; //reset values cache
    }
    onOpenChange?.(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn('max-w-md', (dialogProps as any).className, className)}
        {...dialogProps}
      >
        {((creatingRow &&
          renderCreateRowDialogContent?.({
            internalEditComponents,
            row,
            table,
          })) ||
          renderEditRowDialogContent?.({
            internalEditComponents,
            row,
            table,
          })) ?? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">
                {localization.edit}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-8 pt-4 w-full">
                {internalEditComponents}
              </div>
            </form>
            <DialogFooter className="pt-5">
              <MRT_EditActionButtons row={row} table={table} variant="text" />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
