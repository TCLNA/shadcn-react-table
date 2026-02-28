import { type DragEvent, useEffect } from 'react';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { cn } from '../../lib/utils';

interface BoxProps {
  className?: string;
  onDragEnter?: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver?: (event: DragEvent<HTMLDivElement>) => void;
}

export interface MRT_ToolbarDropZoneProps<TData extends MRT_RowData>
  extends BoxProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToolbarDropZone = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToolbarDropZoneProps<TData>) => {
  const {
    getState,
    options: { enableGrouping, localization },
    setHoveredColumn,
    setShowToolbarDropZone,
  } = table;

  const { draggingColumn, grouping, hoveredColumn, showToolbarDropZone } =
    getState();

  const handleDragEnter = (_event: DragEvent<HTMLDivElement>) => {
    setHoveredColumn({ id: 'drop-zone' });
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (table.options.state?.showToolbarDropZone !== undefined) {
      setShowToolbarDropZone(
        !!enableGrouping &&
          !!draggingColumn &&
          draggingColumn.columnDef.enableGrouping !== false &&
          !grouping.includes(draggingColumn.id),
      );
    }
  }, [enableGrouping, draggingColumn, grouping]);

  if (!showToolbarDropZone) return null;

  return (
    <div
      className={cn(
        "Mui-ToolbarDropZone",
        "flex items-center justify-center",
        "absolute w-full h-full z-[4]",
        "backdrop-blur-sm",
        "border-2 border-dashed border-info",
        "bg-info/10",
        hoveredColumn?.id === 'drop-zone' && "bg-info/20",
        "box-border",
        rest?.className
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      {...rest}
    >
      <p className="italic">
        {localization.dropToGroupBy.replace(
          '{column}',
          draggingColumn?.columnDef?.header ?? '',
        )}
      </p>
    </div>
  );
};
