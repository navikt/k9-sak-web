type DebouncedFunction<T extends (...args: unknown[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

interface DebounceOptions {
  leading?: boolean;
}

/**
 * Creates a debounced function that delays invoking func until after delay milliseconds
 * have elapsed since the last time the debounced function was invoked.
 *
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @param options - Options object with optional leading flag
 * @returns The debounced function with a cancel method
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
  { leading = false }: DebounceOptions = {},
): DebouncedFunction<T> => {
  let timerId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;

  const debouncedFunc = (...args: Parameters<T>) => {
    const shouldCallLeading = !timerId && leading;

    if (shouldCallLeading) {
      func(...args);
    } else {
      lastArgs = args;
    }

    clearTimeout(timerId);

    timerId = setTimeout(() => {
      timerId = undefined;
      if (!leading && lastArgs !== undefined) {
        func(...lastArgs);
      }
      lastArgs = undefined;
    }, delay);
  };

  debouncedFunc.cancel = () => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
      lastArgs = undefined;
    }
  };

  return debouncedFunc;
};
