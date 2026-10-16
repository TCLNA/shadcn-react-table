import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { MRT_IconButton, type MRT_IconButtonProps } from './MRT_IconButton';

export interface MRT_ToggleGlobalFilterButtonProps<TData extends MRT_RowData>
  extends Omit<MRT_IconButtonProps, 'tooltip'> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleGlobalFilterButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleGlobalFilterButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { SearchIcon, SearchOffIcon },
      localization,
    },
    refs: { searchInputRef },
    setShowGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = getState();

  const handleToggleSearch = () => {
    setShowGlobalFilter(!showGlobalFilter);
    queueMicrotask(() => searchInputRef.current?.focus());
  };

  return (
    <MRT_IconButton
      aria-label={localization.showHideSearch}
      disabled={!!globalFilter && showGlobalFilter}
      onClick={handleToggleSearch}
      tooltip={localization.showHideSearch}
      {...rest}
    >
      {showGlobalFilter ? <SearchOffIcon /> : <SearchIcon />}
    </MRT_IconButton>
  );
};
