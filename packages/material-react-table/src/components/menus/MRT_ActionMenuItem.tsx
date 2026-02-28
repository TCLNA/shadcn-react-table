import { type ReactNode } from 'react';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';

export interface MRT_ActionMenuItemProps<TData extends MRT_RowData> {
  icon: ReactNode;
  label: string;
  onClick?: (...args: any[]) => void;
  onOpenSubMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  divider?: boolean;
  selected?: boolean;
  table: MRT_TableInstance<TData>;
  value?: string;
}

export const MRT_ActionMenuItem = <TData extends MRT_RowData>({
  icon,
  label,
  onClick,
  onOpenSubMenu,
  disabled,
  divider,
  table: _table,
}: MRT_ActionMenuItemProps<TData>) => {
  if (onOpenSubMenu) {
    return (
      <>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            disabled={disabled}
            className={cn(
              "flex items-center justify-between gap-2",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
              <span>{label}</span>
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {/* Sub-menu content will be rendered by parent */}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {divider && <DropdownMenuSeparator />}
      </>
    );
  }

  return (
    <>
      <DropdownMenuItem
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
        <span>{label}</span>
      </DropdownMenuItem>
      {divider && <DropdownMenuSeparator />}
    </>
  );
};
