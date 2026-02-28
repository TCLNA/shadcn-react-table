import { Separator } from '../ui/separator';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { cn } from '../../lib/utils';

// DividerProps type for compatibility
interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  flexItem?: boolean;
}

export interface MRT_TableHeadCellResizeHandleProps<TData extends MRT_RowData>
  extends DividerProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellResizeHandle = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellResizeHandleProps<TData>) => {
  const {
    getState,
    options: { columnResizeDirection, columnResizeMode },
    setColumnSizingInfo,
  } = table;
  const { density } = getState();
  const { column } = header;

  const handler = header.getResizeHandler();

  const mx =
    density === 'compact'
      ? '-8px'
      : density === 'comfortable'
        ? '-16px'
        : '-24px';

  const lr = column.columnDef.columnDefType === 'display' ? '4px' : '0';

  return (
    <div
      className="Mui-TableHeadCell-ResizeHandle-Wrapper"
      onDoubleClick={() => {
        setColumnSizingInfo((old) => ({
          ...old,
          isResizingColumn: false,
        }));
        column.resetSize();
      }}
      onMouseDown={handler}
      onTouchStart={handler}
      style={{
        transform:
          column.getIsResizing() && columnResizeMode === 'onEnd'
            ? `translateX(${
                (columnResizeDirection === 'rtl' ? -1 : 1) *
                (getState().columnSizingInfo.deltaOffset ?? 0)
              }px)`
            : undefined,
        cursor: 'col-resize',
        left: columnResizeDirection === 'rtl' ? lr : undefined,
        marginLeft: columnResizeDirection === 'rtl' ? mx : undefined,
        marginRight: columnResizeDirection === 'ltr' ? mx : undefined,
        position: 'absolute',
        paddingLeft: '4px',
        paddingRight: '4px',
        right: columnResizeDirection === 'ltr' ? lr : undefined,
      }}
    >
      <Separator
        orientation="vertical"
        className={cn(
          "Mui-TableHeadCell-ResizeHandle-Divider",
          "rounded-sm border-2 h-6 touch-none select-none z-[4]",
          "translate-x-1",
          column.getIsResizing() ? "" : "transition-all duration-150",
          rest?.className
        )}
      />
    </div>
  );
};
