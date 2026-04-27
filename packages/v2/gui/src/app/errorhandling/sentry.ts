import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';

// Vi ønsker ikkje å rapportere alle feil til Sentry, feks viss har utgått sesjon.
// Legg til fleire her ved behov.
export const shouldReportToSentry = (error: Error | null): boolean => {
  const apiError = ExtendedApiError.findInError(error);
  if (apiError != null) {
    const doNotReport = apiError.isUnauthorized;
    return !doNotReport;
  }
  return true;
};
