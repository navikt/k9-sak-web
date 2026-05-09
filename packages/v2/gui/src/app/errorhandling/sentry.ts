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

// Når global sentry handler rapporterer feil blir sentryId til rapportert Error instans lagra i denne lookup map.
// Andre deler av koden som ønsker å få tak i sentryId til ein Error instans kan deretter slå opp her for å finne den.
// Brukast til å legge til sentryId i visning og utkopiert feilinformasjon, slik at vi kan slå opp feil rapportert frå
// brukarar direkte i sentry. Sidan det er ein WeakMap blir innhaldet automatisk fjerna når Error instans ikkje er "live" lenger.
export const sentryReportedErrorIdLookup = new WeakMap<Error, string>();

// Når global sentry handler rapporterer feil blir sentryId lagt til i denne lista. Når feilinformasjon blir kopiert ut
// for rapportering, inkluderer vi denne lista for å få ei komplett liste med feil rapportert sidan sist reload. Dette
// fordi feil som blir rapportert gjennom ErrorBoundary kan bli deduplisert av sentry, pga mange re-renderinger. Når det
// skjer vil siste feil som blir rendra i ErrorBoundary kanskje ikkje ha sentryId. Så for å kunne slå opp feil som har
// blitt rapportert inkluderer vi denne lista i feilinformasjonen.
export const sentryReportedIdList: string[] = [];
