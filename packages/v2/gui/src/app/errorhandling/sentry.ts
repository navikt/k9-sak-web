import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { SentryReportedError } from './SentryReportedError.js';

// Vi ønsker ikkje å rapportere alle feil til Sentry, feks viss har utgått sesjon.
// Legg til fleire her ved behov.
export const shouldReportToSentry = (error: Error | null): boolean => {
  if (error instanceof SentryReportedError) {
    return false;
  }
  const apiError = ExtendedApiError.findInError(error);
  if (apiError != null) {
    const doNotReport = apiError.isUnauthorized;
    return !doNotReport;
  }
  return true;
};

// Når global sentry handler rapporterer feil blir sentryId til rapportert Error instans lagra i denne lookup map.
// Andre deler av koden som ønsker å få tak i sentryId til ein Error instans kan deretter slå opp her for å finne den.
// Brukast til å legge til sentryId i visning og utkopiert feilinformasjon, slik at vi kan slå opp feil rapportert frå
// brukarar direkte i sentry. Sidan det er ein WeakMap blir innhaldet automatisk fjerna når Error instans ikkje er "live" lenger.
export const sentryReportedErrorIdLookup = new WeakMap<Error, string>();
