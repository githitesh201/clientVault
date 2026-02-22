import { type ReactNode } from 'react';
import { type TipTapMark } from 'clientvault-shared/utils';

export const bold = (_: TipTapMark, children: ReactNode): ReactNode => {
  return <strong>{children}</strong>;
};
