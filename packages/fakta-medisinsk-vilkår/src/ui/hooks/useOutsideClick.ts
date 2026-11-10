import { useEffect, useRef } from 'react';

export const useOutsideClick = <T extends HTMLElement>(onOutsideClick: () => void, enabled: boolean) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [enabled, onOutsideClick]);

  return ref;
};
