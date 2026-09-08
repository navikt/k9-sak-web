import { init, type InitOptions } from '@nais/apm';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';

// Vi ønsker ikkje å rapportere alle feil til apm, feks viss har utgått sesjon.
// Legg til fleire her ved behov.
export const shouldReportToApm = (error: Error | null): boolean => {
  const apiError = ExtendedApiError.findInError(error);
  if (apiError != null) {
    const doNotReport = apiError.isUnauthorized;
    return !doNotReport;
  }
  return true;
};

const randomErrorId = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * Unik id for denne sidelastinga. Blir lagt på alle feil rapportert til apm, slik at vi kan søke opp alle feil ein
 * bruker har fått sidan sist reload ved oppslag på denne id i nais apm.
 */
export const loadedErrorId = randomErrorId();

// Legg loadedErrorId på alle exception innslag. Vi gjer det her, og ikkje med setTag frå @nais/apm, fordi setTag berre
// blir lagt på feil rapportert gjennom captureException i @nais/apm. Feil fanga automatisk av faro
// (window.onerror, unhandledrejection, console.error) går utanom, medan beforeSend ser alle innslag.
const beforeSend: NonNullable<InitOptions['beforeSend']> = item => {
  if (item.type === 'exception') {
    const payload = item.payload as { context?: Record<string, string> };
    payload.context = { ...payload.context, loadedErrorId };
  }
  return item;
};

/** Nais app namn for frontend appane våre */
export type ApmApp = 'k9-sak-web' | 'ung-sak-web';

interface InitApmOptions {
  app: ApmApp;
}

/**
 * Bruk denne funksjon istadenfor init funksjon frå @nais/apm direkte, for å få loadedErrorId med på exceptions.
 */
export function initApm({ app }: InitApmOptions) {
  const namespace = 'k9saksbehandling';
  init({
    namespace,
    app,
    tracing: true,
    devConsoleEcho: false,
    beforeSend,
  });
}
