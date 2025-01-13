import { useEffect, useRef } from 'react';

export const usePrevious = (value: boolean): boolean => {
  const ref = useRef<boolean>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
