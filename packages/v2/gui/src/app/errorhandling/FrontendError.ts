import { type AlertInfo, makeErrorId } from './AlertInfo.js';

/**
 * Viss gui kode kaster feil ønsker vi at den skal vere av denne type, eller ein subtype av denne. Får då med errorId
 * i visning i gui, og den blir sendt til Sentry, slik at vi kan korrelere feil brukere rapporterer med Sentry.
 */
export class FrontendError extends Error implements AlertInfo {
  public readonly errorId = makeErrorId();

  constructor(message: string, cause?: Error) {
    const options = cause !== undefined ? { cause } : undefined;
    super(message, options);
    this.name = this.constructor.name;
  }
}
