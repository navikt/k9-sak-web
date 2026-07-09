import { type AlertInfo, makeErrorId } from './AlertInfo.js';

export default class GeneralAsyncError extends Error implements AlertInfo {
  public readonly errorId = makeErrorId();

  constructor(message: string, cause?: Error) {
    const options = cause !== undefined ? { cause } : undefined;
    super(message, options);
    this.name = this.constructor.name;
  }
}
