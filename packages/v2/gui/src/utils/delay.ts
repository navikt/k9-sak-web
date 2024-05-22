// This is used in fake api implementations during test/dev, to simulate waiting for a real api response.
// Might also be used for debounce
export const delay = (millis: number, abortSignal: AbortSignal = new AbortController().signal) => new Promise<void>((resolve, reject) => {
    if (abortSignal.aborted) {
      // Abort signal already triggered, stop early.
      reject(abortSignal.reason);
    }
    let timeoutId: number | null | NodeJS.Timeout = null; // It is number in browser, NodeJS.Timeout in nodejs.
    // Create an abortListener that gets called if the AbortSignal is triggered.
    const abortListener = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      reject(abortSignal.reason);
    };
    abortSignal.addEventListener('abort', abortListener);
    timeoutId = setTimeout(() => {
      // Remove the abortListener
      abortSignal.removeEventListener('abort', abortListener);
      resolve();
    }, millis);
  });
