export const isAbortedFetchError = (error: unknown): error is DOMException => {
  return error instanceof DOMException && (error.name === 'AbortError' || error.code === DOMException.ABORT_ERR);
};
