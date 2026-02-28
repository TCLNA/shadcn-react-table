import { type MouseEvent } from 'react';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { MRT_IconButton, type MRT_IconButtonProps } from './MRT_IconButton';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { cn } from '../../lib/utils';

export interface MRT_ExpandButtonProps<TData extends MRT_RowData>
  extends Omit<MRT_IconButtonProps, 'tooltip'> {
  row: MRT_Row<TData>;
  staticRowIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_ExpandButton = <TData extends MRT_RowData>({
  row,
  staticRowIndex,
  table,
  ...rest
}: MRT_ExpandButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { ExpandMoreIcon },
      localization,
      muiExpandButtonProps,
      positionExpandColumn,
      renderDetailPanel,
    },
  } = table;
  const { density } = getState();

  const iconButtonProps = parseFromValuesOrFunc(muiExpandButtonProps, {
    row,
    staticRowIndex,
    table,
  });

  const canExpand = row.getCanExpand();
  const isExpanded = row.getIsExpanded();

  const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    row.toggleExpanded();
    iconButtonProps?.onClick?.(event);
  };

  const detailPanel = !!renderDetailPanel?.({ row, table });

  // Calculate margin for row depth indentation
  // Note: RTL detection would need to be handled at a higher level or via CSS
  const marginLeft = positionExpandColumn === 'last' ? 0 : row.depth * 16;
  const marginRight = positionExpandColumn === 'last' ? row.depth * 16 : 0;

  return (
    <MRT_IconButton
      aria-label={localization.expand}
      disabled={!canExpand && !detailPanel}
      onClick={handleToggleExpand}
      tooltip={isExpanded ? localization.collapse : localization.expand}
      density={density}
      className={cn(
        !canExpand && !detailPanel && 'opacity-30',
        iconButtonProps?.className,
      )}
      style={{
        marginLeft: `${marginLeft}px`,
        marginRight: `${marginRight}px`,
        ...iconButtonProps?.style,
      }}
      {...(iconButtonProps as any)}
      {...rest}
    >
      {iconButtonProps?.children ?? (
        <ExpandMoreIcon
          style={{
            transform: `rotate(${
              !canExpand && !renderDetailPanel
                ? positionExpandColumn === 'last'
                  ? 90
                  : -90
                : isExpanded
                  ? -180
                  : 0
            }deg)`,
            transition: 'transform 150ms',
          }}
        />
      )}
    </MRT_IconButton>
  );
};
