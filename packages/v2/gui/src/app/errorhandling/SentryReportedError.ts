import { type AlertInfo, isErrorWithAlertInfo, makeErrorId } from './AlertInfo.js';

/**
 * Når feil har blitt rapportert til sentry og blir sendt vidare skal den pakkes inn i denne, slik at vidare feilhandteringskode
 * kan vite at den allereie har blitt rapportert, og printe ut sentryId til bruker, for feilrapportering.
 */
export class SentryReportedError extends Error implements AlertInfo {
  #reported: Error;
  #sentryId: string;
  #errorId: number;

  constructor(reported: Error, sentryId: string) {
    super(reported.message, { cause: reported });
    this.#reported = reported;
    this.#sentryId = sentryId;
    this.#errorId = isErrorWithAlertInfo(reported) ? reported.errorId : makeErrorId();
    this.name = this.constructor.name;
  }

  get reported() {
    return this.#reported;
  }

  get sentryId() {
    return this.#sentryId;
  }

  get errorId() {
    return this.#errorId;
  }

  /**
   * Brukes der man ønsker å få ut original feil, hvis innsendt error er av type SentryReportedError. Returnerer ellers innsendt error.
   */
  static unwrapped(error: Error): Error {
    return error instanceof SentryReportedError ? error.reported : error;
  }
}
