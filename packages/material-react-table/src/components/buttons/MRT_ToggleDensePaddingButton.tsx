import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { MRT_IconButton, type MRT_IconButtonProps } from './MRT_IconButton';

export interface MRT_ToggleDensePaddingButtonProps<TData extends MRT_RowData>
  extends Omit<MRT_IconButtonProps, 'tooltip'> {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleDensePaddingButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleDensePaddingButtonProps<TData>) => {
  const {
    getState,
    options: {
      icons: { DensityLargeIcon, DensityMediumIcon, DensitySmallIcon },
      localization,
    },
    setDensity,
  } = table;
  const { density } = getState();

  const handleToggleDensePadding = () => {
    const nextDensity =
      density === 'comfortable'
        ? 'compact'
        : density === 'compact'
          ? 'spacious'
          : 'comfortable';
    setDensity(nextDensity);
  };

  return (
    <MRT_IconButton
      aria-label={localization.toggleDensity}
      onClick={handleToggleDensePadding}
      tooltip={localization.toggleDensity}
      {...rest}
    >
      {density === 'compact' ? (
        <DensitySmallIcon />
      ) : density === 'comfortable' ? (
        <DensityMediumIcon />
      ) : (
        <DensityLargeIcon />
      )}
    </MRT_IconButton>
  );
};
