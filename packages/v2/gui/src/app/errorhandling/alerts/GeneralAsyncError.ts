import { type AlertInfo, makeErrorId } from './AlertInfo.js';

/**
 * @deprecated Trur ikkje denne er noko poeng å ha
 */
export default class GeneralAsyncError extends Error implements AlertInfo {
  public readonly errorId = makeErrorId();

  constructor(message: string, cause?: Error) {
    const options = cause !== undefined ? { cause } : undefined;
    super(message, options);
    this.name = this.constructor.name;
  }
}
