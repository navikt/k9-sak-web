import { useEffect, useRef } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const usePrevious = (value: boolean): boolean => {
  const ref = useRef<boolean>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
