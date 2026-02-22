import { type GraphColor } from '@/page-layout/widgets/graph/types/GraphColor';
import { isDefined } from 'clientvault-shared/utils';
import { MAIN_COLOR_NAMES, type ThemeColor } from 'clientvault-ui/theme';

export const parseGraphColor = (
  value: string | null | undefined,
): GraphColor | undefined => {
  if (!isDefined(value)) {
    return undefined;
  }

  if (value === 'auto') {
    return 'auto';
  }

  const normalizedValue = value.toLowerCase();

  if (MAIN_COLOR_NAMES.includes(normalizedValue as ThemeColor)) {
    return normalizedValue as GraphColor;
  }

  return undefined;
};
