import { type MouseEvent } from 'react';
import { type RowPinningPosition } from '@tanstack/react-table';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { MRT_IconButton, type MRT_IconButtonProps } from './MRT_IconButton';
import { cn } from '../../lib/utils';

export interface MRT_RowPinButtonProps<TData extends MRT_RowData>
  extends Omit<MRT_IconButtonProps, 'tooltip' | 'size'> {
  pinningPosition: RowPinningPosition;
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_RowPinButton = <TData extends MRT_RowData>({
  pinningPosition,
  row,
  table,
  ...rest
}: MRT_RowPinButtonProps<TData>) => {
  const {
    options: {
      icons: { CloseIcon, PushPinIcon },
      localization,
      rowPinningDisplayMode,
    },
  } = table;

  const isPinned = row.getIsPinned();

  const handleTogglePin = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    row.pin(isPinned ? false : pinningPosition);
  };

  return (
    <MRT_IconButton
      aria-label={localization.pin}
      onClick={handleTogglePin}
      size="small"
      tooltip={isPinned ? localization.unpin : localization.pin}
      className={cn('h-6 w-6', rest.className)}
      {...rest}
    >
      {isPinned ? (
        <CloseIcon />
      ) : (
        <PushPinIcon
          fontSize="small"
          style={{
            transform: `rotate(${
              rowPinningDisplayMode === 'sticky'
                ? 135
                : pinningPosition === 'top'
                  ? 180
                  : 0
            }deg)`,
          }}
        />
      )}
    </MRT_IconButton>
  );
};
