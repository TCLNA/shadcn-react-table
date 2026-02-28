import {
  type Dispatch,
  type DragEvent,
  type SetStateAction,
  useRef,
  useState,
} from 'react';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Switch } from '../ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';
import {
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { reorderColumn } from '../../utils/column.utils';
import { MRT_ColumnPinningButtons } from '../buttons/MRT_ColumnPinningButtons';
import { MRT_GrabHandleButton } from '../buttons/MRT_GrabHandleButton';

export interface MRT_ShowHideColumnsMenuItemsProps<TData extends MRT_RowData> {
  allColumns: MRT_Column<TData>[];
  column: MRT_Column<TData>;
  hoveredColumn: MRT_Column<TData> | null;
  isNestedColumns: boolean;
  setHoveredColumn: Dispatch<SetStateAction<MRT_Column<TData> | null>>;
  table: MRT_TableInstance<TData>;
}

export const MRT_ShowHideColumnsMenuItems = <TData extends MRT_RowData>({
  allColumns,
  column,
  hoveredColumn,
  isNestedColumns,
  setHoveredColumn,
  table,
}: MRT_ShowHideColumnsMenuItemsProps<TData>) => {
  const {
    getState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
    },
    setColumnOrder,
    setColumnPinning,
  } = table;
  const { columnOrder } = getState();
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const switchChecked = column.getIsVisible();

  const handleToggleColumnHidden = (column: MRT_Column<TData>) => {
    if (columnDefType === 'group') {
      column?.columns?.forEach?.((childColumn: MRT_Column<TData>) => {
        childColumn.toggleVisibility(!switchChecked);
      });
    } else {
      column.toggleVisibility();
    }
  };

  const menuItemRef = useRef<HTMLElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    try {
      e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragEnd = (_e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(false);
    setHoveredColumn(null);
    if (hoveredColumn) {
      const reorderedColumns = reorderColumn(
        column,
        hoveredColumn,
        columnOrder,
      );
      setColumnOrder(reorderedColumns);
      setColumnPinning(({ left = [], right = [] }) => ({
        left: reorderedColumns.filter((header) => left.includes(header)),
        right: reorderedColumns.filter((header) => right.includes(header)),
      }));
    }
  };

  const handleDragEnter = (_e: DragEvent) => {
    if (!isDragging && columnDef.enableColumnOrdering !== false) {
      setHoveredColumn(column);
    }
  };

  if (!columnDef.header || columnDef.visibleInShowHideMenu === false) {
    return null;
  }

  return (
    <>
      <DropdownMenuItem
        onDragEnter={handleDragEnter}
        ref={menuItemRef as any}
        className={cn(
          "flex items-center justify-start my-0 py-1.5 cursor-default",
          isDragging && "opacity-50 outline outline-2 outline-dashed outline-gray-500 outline-offset-[-2px]",
          hoveredColumn?.id === column.id && !isDragging && "outline outline-2 outline-dashed outline-primary outline-offset-[-2px]"
        )}
        style={{
          paddingLeft: `${(column.depth + 0.5) * 2}rem`,
        }}
      >
        <div className="flex flex-nowrap gap-2">
          {columnDefType !== 'group' &&
            enableColumnOrdering &&
            !isNestedColumns &&
            (columnDef.enableColumnOrdering !== false ? (
              <MRT_GrabHandleButton
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                table={table}
              />
            ) : (
              <div className="w-7" />
            ))}
          {enableColumnPinning &&
            (column.getCanPin() ? (
              <MRT_ColumnPinningButtons column={column} table={table} />
            ) : (
              <div className="w-[70px]" />
            ))}
          {enableHiding ? (
            <label className="flex items-center gap-2 cursor-pointer">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch
                      checked={switchChecked}
                      disabled={!column.getCanHide()}
                      onCheckedChange={() => handleToggleColumnHidden(column)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{localization.toggleVisibility}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className={cn(
                "mb-0",
                columnDefType !== 'display' ? "opacity-100" : "opacity-50"
              )}>
                {columnDef.header}
              </span>
            </label>
          ) : (
            <span className="self-center">
              {columnDef.header}
            </span>
          )}
        </div>
      </DropdownMenuItem>
      {column.columns?.map((c: MRT_Column<TData>, i) => (
        <MRT_ShowHideColumnsMenuItems
          allColumns={allColumns}
          column={c}
          hoveredColumn={hoveredColumn}
          isNestedColumns={isNestedColumns}
          key={`${i}-${c.id}`}
          setHoveredColumn={setHoveredColumn}
          table={table}
        />
      ))}
    </>
  );
};
