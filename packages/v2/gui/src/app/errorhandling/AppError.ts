import { type AlertInfo, makeErrorId } from './AlertInfo.js';

/**
 * Istadenfor å kaste rein Error skal denne, eller subtype brukast. Slik at vi får ein errorId på flest mulig feil.
 */
export class AppError extends Error implements AlertInfo {
  public readonly errorId = makeErrorId();

  constructor(message: string, cause?: Error) {
    const options = cause !== undefined ? { cause } : undefined;
    super(message, options);
    this.name = this.constructor.name;
  }
}
