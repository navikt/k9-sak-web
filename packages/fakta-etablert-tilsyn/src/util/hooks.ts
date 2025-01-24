import { useEffect, useRef } from 'react';

export const usePrevious = value => {
  const ref = useRef(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
