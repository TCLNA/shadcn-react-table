import { type DragEventHandler } from 'react';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { MRT_IconButton, type MRT_IconButtonProps } from './MRT_IconButton';
import { cn } from '../../lib/utils';

export interface MRT_GrabHandleButtonProps<TData extends MRT_RowData>
  extends Omit<MRT_IconButtonProps, 'tooltip' | 'size'> {
  iconButtonProps?: MRT_IconButtonProps;
  location?: 'column' | 'row';
  onDragEnd: DragEventHandler<HTMLButtonElement>;
  onDragStart: DragEventHandler<HTMLButtonElement>;
  table: MRT_TableInstance<TData>;
}

export const MRT_GrabHandleButton = <TData extends MRT_RowData>({
  location,
  table,
  ...rest
}: MRT_GrabHandleButtonProps<TData>) => {
  const {
    options: {
      icons: { DragHandleIcon },
      localization,
    },
  } = table;

  return (
    <MRT_IconButton
      aria-label={localization.move}
      draggable="true"
      size="small"
      tooltip={localization.move}
      tooltipPlacement="top"
      className={cn(
        'cursor-grab p-0.5 -mx-0.5 transition-all duration-150',
        'hover:bg-transparent hover:opacity-100',
        'active:cursor-grabbing',
        location === 'row' ? 'opacity-100' : 'opacity-50',
        rest.className,
      )}
      {...rest}
      onClick={(e) => {
        e.stopPropagation();
        rest?.onClick?.(e);
      }}
    >
      <DragHandleIcon />
    </MRT_IconButton>
  );
};
