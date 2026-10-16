import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_TableLoadingOverlayProps<TData extends MRT_RowData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: MRT_TableInstance<TData>;
}

export const MRT_TableLoadingOverlay = <TData extends MRT_RowData>({
  table,
  className,
  ...rest
}: MRT_TableLoadingOverlayProps<TData>) => {
  const {
    options: {
      id,
      localization,
      muiCircularProgressProps,
    },
  } = table;

  const circularProgressProps = {
    ...parseFromValuesOrFunc(muiCircularProgressProps, { table }),
    ...rest,
  };

  return (
    <div
      className={cn(
        'absolute inset-0 z-[3] flex items-center justify-center',
        'bg-background/50 backdrop-blur-sm',
        'max-h-screen w-full',
        className,
      )}
      {...circularProgressProps}
    >
      {circularProgressProps?.Component ?? (
        <Loader2
          aria-label={localization.noRecordsToDisplay}
          id={`mrt-progress-${id}`}
          className="h-8 w-8 animate-spin text-primary"
        />
      )}
    </div>
  );
};
