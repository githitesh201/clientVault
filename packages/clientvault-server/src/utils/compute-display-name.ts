import { isDefined } from 'clientvault-shared/utils';
import { type FullNameMetadata } from 'clientvault-shared/types';

export const computeDisplayName = (
  name: FullNameMetadata | null | undefined,
) => {
  if (!name) {
    return '';
  }

  return Object.values(name).filter(isDefined).join(' ');
};
