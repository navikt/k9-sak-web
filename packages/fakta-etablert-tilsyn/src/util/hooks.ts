/* eslint-disable import/prefer-default-export */
import { useEffect, useRef } from 'react';

export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
