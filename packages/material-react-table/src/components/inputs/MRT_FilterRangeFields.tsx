import { cn } from '../../lib/utils';
import { MRT_FilterTextField } from './MRT_FilterTextField';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';

export interface MRT_FilterRangeFieldsProps<TData extends MRT_RowData> {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
  className?: string;
}

export const MRT_FilterRangeFields = <TData extends MRT_RowData>({
  header,
  table,
  className,
}: MRT_FilterRangeFieldsProps<TData>) => {
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      {[0, 1].map((rangeFilterIndex) => (
        <MRT_FilterTextField
          header={header}
          key={rangeFilterIndex}
          rangeFilterIndex={rangeFilterIndex}
          table={table}
        />
      ))}
    </div>
  );
};
