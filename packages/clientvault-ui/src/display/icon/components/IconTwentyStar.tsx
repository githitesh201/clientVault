import { useTheme } from '@emotion/react';

import IconClientVaultStarRaw from '@assets/icons/clientvault-star.svg?react';
import { type IconComponentProps } from '@ui/display/icon/types/IconComponent';

type IconClientVaultStarProps = Pick<IconComponentProps, 'size' | 'stroke'>;

export const IconClientVaultStar = (props: IconClientVaultStarProps) => {
  const theme = useTheme();
  const size = props.size ?? 24;
  const stroke = props.stroke ?? theme.icon.stroke.md;

  return <IconClientVaultStarRaw height={size} width={size} strokeWidth={stroke} />;
};
