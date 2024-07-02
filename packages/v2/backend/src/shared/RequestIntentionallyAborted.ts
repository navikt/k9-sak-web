/**
 * Used when one wants to signal to a caller that a request was intentionally aborted, e.g. because of debouncing, etc.
 *
 * The caller will then typically ignore this response and not do anything.
 */
export const requestIntentionallyAborted = Symbol("RequestIntentionallyAborted")

export type RequestIntentionallyAborted = typeof requestIntentionallyAborted
