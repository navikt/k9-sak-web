/**
 * This error is thrown when a fetch request is intentionally aborted by the client.
 * E.g. if request is triggered by user input, and there is new input entered potentially before previous request completed.
 */
export class RequestIntentionallyAborted extends Error {
  public static readonly MSG = 'request intentionally aborted';

  constructor() {
    super(RequestIntentionallyAborted.MSG);
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestIntentionallyAborted);
    }
  }
}
