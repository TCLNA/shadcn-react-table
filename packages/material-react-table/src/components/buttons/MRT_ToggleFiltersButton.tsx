import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { MRT_IconButton, type MRT_IconButtonProps } from './MRT_IconButton';

export interface MRT_ToggleFiltersButtonProps<TData extends MRT_RowData>
  extends Omit<MRT_IconButtonProps, 'tooltip'> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleFiltersButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleFiltersButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { FilterListIcon, FilterListOffIcon },
      localization,
    },
    setShowColumnFilters,
  } = table;
  const { showColumnFilters } = getState();

  const handleToggleShowFilters = () => {
    setShowColumnFilters(!showColumnFilters);
  };

  return (
    <MRT_IconButton
      aria-label={localization.showHideFilters}
      onClick={handleToggleShowFilters}
      tooltip={localization.showHideFilters}
      {...rest}
    >
      {showColumnFilters ? <FilterListOffIcon /> : <FilterListIcon />}
    </MRT_IconButton>
  );
};
