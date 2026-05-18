/**
 * Istadenfor å kaste rein Error skal denne, eller subtype brukast. Sentry sin event_id blir
 * brukt for å korrelere feil mellom brukerrapport og Sentry-rapport (sjå sentryReportedErrorIdLookup).
 */
export class AppError extends Error {
  constructor(message: string, cause?: Error) {
    const options = cause !== undefined ? { cause } : undefined;
    super(message, options);
    this.name = this.constructor.name;
  }
}
