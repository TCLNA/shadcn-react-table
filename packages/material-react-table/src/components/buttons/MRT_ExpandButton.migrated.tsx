import { type MouseEvent } from 'react';
import { Button, type ButtonProps } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_ExpandButtonProps<TData extends MRT_RowData>
  extends Omit<ButtonProps, 'onClick'> {
  row: MRT_Row<TData>;
  staticRowIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_ExpandButton = <TData extends MRT_RowData>({
  row,
  staticRowIndex,
  table,
  className,
  ...rest
}: MRT_ExpandButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { ExpandMoreIcon },
      localization,
      expandButtonProps,
      positionExpandColumn,
      renderDetailPanel,
    },
  } = table;
  const { density } = getState();

  const iconButtonProps = parseFromValuesOrFunc(expandButtonProps, {
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

  const isRTL = positionExpandColumn === 'last'; // Simplified RTL detection

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Button
            variant="ghost"
            size="icon"
            aria-label={localization.expand}
            disabled={!canExpand && !detailPanel}
            {...iconButtonProps}
            {...rest}
            onClick={handleToggleExpand}
            className={cn(
              density === 'compact' ? 'h-7 w-7' : 'h-9 w-9',
              !canExpand && !detailPanel && 'opacity-30',
              className
            )}
            style={{
              [isRTL ? 'marginRight' : 'marginLeft']: `${row.depth * 16}px`,
              ...iconButtonProps?.style,
            }}
          >
            {iconButtonProps?.children ?? (
              <ExpandMoreIcon
                className={cn(
                  'h-4 w-4 transition-transform duration-150',
                  !canExpand && !renderDetailPanel
                    ? isRTL
                      ? 'rotate-90'
                      : '-rotate-90'
                    : isExpanded
                      ? 'rotate-180'
                      : 'rotate-0'
                )}
              />
            )}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {iconButtonProps?.title ??
          (isExpanded ? localization.collapse : localization.expand)}
      </TooltipContent>
    </Tooltip>
  );
};
