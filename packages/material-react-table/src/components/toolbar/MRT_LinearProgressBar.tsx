import * as React from 'react';
import {
  Collapsible,
  CollapsibleContent,
} from '../../components/ui/collapsible';
import { Progress } from '../../components/ui/progress';
import { cn } from '../../lib/utils';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_LinearProgressBarProps<TData extends MRT_RowData>
  extends React.ComponentPropsWithoutRef<typeof Progress> {
  isTopToolbar: boolean;
  table: MRT_TableInstance<TData>;
}

export const MRT_LinearProgressBar = <TData extends MRT_RowData>({
  isTopToolbar,
  table,
  className,
  ...rest
}: MRT_LinearProgressBarProps<TData>) => {
  const {
    getState,
    options: { muiLinearProgressProps },
  } = table;
  const { isSaving, showProgressBars } = getState();

  const linearProgressProps = {
    ...parseFromValuesOrFunc(muiLinearProgressProps, {
      isTopToolbar,
      table,
    }),
    ...rest,
  };

  const isOpen = showProgressBars !== false && (showProgressBars || isSaving);

  return (
    <Collapsible open={isOpen}>
      <CollapsibleContent
        className={cn(
          'absolute w-full',
          isTopToolbar ? 'bottom-0' : 'top-0',
        )}
      >
        <Progress
          aria-busy="true"
          aria-label="Loading"
          className={cn('relative h-1', className)}
          value={undefined} // Indeterminate state
          {...linearProgressProps}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};
