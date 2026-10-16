import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { MRT_IconButton, type MRT_IconButtonProps } from './MRT_IconButton';

export interface MRT_ToggleFullScreenButtonProps<TData extends MRT_RowData>
  extends Omit<MRT_IconButtonProps, 'tooltip'> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleFullScreenButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleFullScreenButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { FullscreenExitIcon, FullscreenIcon },
      localization,
    },
    setIsFullScreen,
  } = table;
  const { isFullScreen } = getState();

  const handleToggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <MRT_IconButton
      aria-label={localization.toggleFullScreen}
      onClick={handleToggleFullScreen}
      tooltip={localization.toggleFullScreen}
      {...rest}
    >
      {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
    </MRT_IconButton>
  );
};
