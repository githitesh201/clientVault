import IconClientVaultStarFilledRaw from '@assets/icons/clientvault-star-filled.svg?react';
import { type IconComponentProps } from '@ui/display/icon/types/IconComponent';
import { THEME_COMMON } from '@ui/theme';

type IconClientVaultStarFilledProps = Pick<IconComponentProps, 'size' | 'stroke'>;

const iconStrokeMd = THEME_COMMON.icon.stroke.md;

export const IconClientVaultStarFilled = (props: IconClientVaultStarFilledProps) => {
  const size = props.size ?? 24;
  const stroke = props.stroke ?? iconStrokeMd;

  return (
    <IconClientVaultStarFilledRaw height={size} width={size} strokeWidth={stroke} />
  );
};
