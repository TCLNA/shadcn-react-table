import {
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { MRT_IconButton } from './MRT_IconButton';
import { cn } from '../../lib/utils';

export interface MRT_ColumnPinningButtonsProps<TData extends MRT_RowData> {
  column: MRT_Column<TData>;
  table: MRT_TableInstance<TData>;
  className?: string;
}

export const MRT_ColumnPinningButtons = <TData extends MRT_RowData>({
  column,
  table,
  className,
}: MRT_ColumnPinningButtonsProps<TData>) => {
  const {
    options: {
      icons: { PushPinIcon },
      localization,
    },
  } = table;

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection);
  };

  return (
    <div className={cn('min-w-[70px] text-center', className)}>
      {column.getIsPinned() ? (
        <MRT_IconButton
          onClick={() => handlePinColumn(false)}
          size="small"
          tooltip={localization.unpin}
        >
          <PushPinIcon />
        </MRT_IconButton>
      ) : (
        <>
          <MRT_IconButton
            onClick={() => handlePinColumn('left')}
            size="small"
            tooltip={localization.pinToLeft}
          >
            <PushPinIcon
              style={{
                transform: 'rotate(90deg)',
              }}
            />
          </MRT_IconButton>
          <MRT_IconButton
            onClick={() => handlePinColumn('right')}
            size="small"
            tooltip={localization.pinToRight}
          >
            <PushPinIcon
              style={{
                transform: 'rotate(-90deg)',
              }}
            />
          </MRT_IconButton>
        </>
      )}
    </div>
  );
};
