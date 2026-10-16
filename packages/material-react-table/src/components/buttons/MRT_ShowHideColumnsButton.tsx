import { type MouseEvent, useState } from 'react';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { MRT_IconButton, type MRT_IconButtonProps } from './MRT_IconButton';
import { MRT_ShowHideColumnsMenu } from '../menus/MRT_ShowHideColumnsMenu';

export interface MRT_ShowHideColumnsButtonProps<TData extends MRT_RowData>
  extends Omit<MRT_IconButtonProps, 'tooltip'> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ShowHideColumnsButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ShowHideColumnsButtonProps<TData>) => {
  const {
    options: {
      icons: { ViewColumnIcon },
      localization,
    },
  } = table;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <MRT_IconButton
        aria-label={localization.showHideColumns}
        onClick={handleClick}
        tooltip={localization.showHideColumns}
        {...rest}
      >
        <ViewColumnIcon />
      </MRT_IconButton>
      {anchorEl && (
        <MRT_ShowHideColumnsMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      )}
    </>
  );
};
