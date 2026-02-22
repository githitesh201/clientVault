import { useRef } from 'react';

export const useFirstMountState = (): boolean => {
  // eslint-disable-next-line clientvault/no-state-useref
  const isFirst = useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  }

  return isFirst.current;
};
