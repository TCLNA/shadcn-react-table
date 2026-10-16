import { type MouseEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_ColumnActionMenu } from '../menus/MRT_ColumnActionMenu';
import { cn } from '../../lib/utils';

// IconButtonProps type for compatibility
interface IconButtonProps {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  title?: string;
  children?: React.ReactNode;
}

export interface MRT_TableHeadCellColumnActionsButtonProps<
  TData extends MRT_RowData,
> extends IconButtonProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellColumnActionsButton = <
  TData extends MRT_RowData,
>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellColumnActionsButtonProps<TData>) => {
  const {
    options: {
      icons: { MoreVertIcon },
      localization,
      muiColumnActionsButtonProps,
    },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const iconButtonProps = {
    ...parseFromValuesOrFunc(muiColumnActionsButtonProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.muiColumnActionsButtonProps, {
      column,
      table,
    }),
    ...rest,
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={localization.columnActions}
            onClick={handleClick}
            className={cn(
              "h-8 w-8 -m-2 opacity-30 hover:opacity-100 transition-all duration-150",
              iconButtonProps?.className
            )}
            {...iconButtonProps}
          >
            {iconButtonProps?.children ?? (
              <MoreVertIcon style={{ transform: 'scale(0.9)' }} />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          {iconButtonProps?.title ?? localization.columnActions}
        </TooltipContent>
      </Tooltip>
      {anchorEl && (
        <MRT_ColumnActionMenu
          anchorEl={anchorEl}
          header={header}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      )}
    </>
  );
};
