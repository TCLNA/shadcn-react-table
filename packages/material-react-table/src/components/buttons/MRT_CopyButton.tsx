import { type MouseEvent, useState } from 'react';
import {
  type MRT_Cell,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { MRT_Button, type MRT_ButtonProps } from './MRT_Button';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { cn } from '../../lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export interface MRT_CopyButtonProps<TData extends MRT_RowData>
  extends Omit<MRT_ButtonProps, 'onClick'> {
  cell: MRT_Cell<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_CopyButton = <TData extends MRT_RowData>({
  cell,
  table,
  ...rest
}: MRT_CopyButtonProps<TData>) => {
  const {
    options: { localization, muiCopyButtonProps },
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;

  const [copied, setCopied] = useState(false);

  const handleCopy = (event: MouseEvent, text: unknown) => {
    event.stopPropagation();
    navigator.clipboard.writeText(text as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };

  const buttonProps = {
    ...parseFromValuesOrFunc(muiCopyButtonProps, {
      cell,
      column,
      row,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.muiCopyButtonProps, {
      cell,
      column,
      row,
      table,
    }),
    ...rest,
  };

  const tooltipTitle =
    copied ? localization.copiedToClipboard : localization.clickToCopy;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <MRT_Button
            onClick={(e) => handleCopy(e, cell.getValue())}
            size="sm"
            variant="ghost"
            className={cn(
              'bg-transparent border-none text-inherit cursor-copy',
              'font-inherit text-inherit tracking-inherit text-left',
              '-m-1 min-w-0 py-0',
              buttonProps?.className,
            )}
            {...buttonProps}
          />
        </TooltipTrigger>
        <TooltipContent side="top">{tooltipTitle}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
