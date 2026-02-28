import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { MRT_IconButton, type MRT_IconButtonProps } from './MRT_IconButton';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { cn } from '../../lib/utils';

export interface MRT_ExpandAllButtonProps<TData extends MRT_RowData>
  extends Omit<MRT_IconButtonProps, 'tooltip'> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ExpandAllButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ExpandAllButtonProps<TData>) => {
  const {
    getCanSomeRowsExpand,
    getIsAllRowsExpanded,
    getIsSomeRowsExpanded,
    getState,
    options: {
      icons: { KeyboardDoubleArrowDownIcon },
      localization,
      muiExpandAllButtonProps,
      renderDetailPanel,
    },
    toggleAllRowsExpanded,
  } = table;
  const { density, isLoading } = getState();

  const iconButtonProps = {
    ...parseFromValuesOrFunc(muiExpandAllButtonProps, {
      table,
    }),
    ...rest,
  };

  const isAllRowsExpanded = getIsAllRowsExpanded();

  return (
    <MRT_IconButton
      aria-label={localization.expandAll}
      disabled={isLoading || (!renderDetailPanel && !getCanSomeRowsExpand())}
      onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
      tooltip={
        isAllRowsExpanded ? localization.collapseAll : localization.expandAll
      }
      density={density}
      className={cn(
        density !== 'compact' && '-mt-1',
        iconButtonProps?.className,
      )}
      {...(iconButtonProps as any)}
    >
      {iconButtonProps?.children ?? (
        <KeyboardDoubleArrowDownIcon
          style={{
            transform: `rotate(${
              isAllRowsExpanded ? -180 : getIsSomeRowsExpanded() ? -90 : 0
            }deg)`,
            transition: 'transform 150ms',
          }}
        />
      )}
    </MRT_IconButton>
  );
};
