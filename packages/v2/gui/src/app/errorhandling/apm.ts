import { init, type InitOptions } from '@nais/apm';
import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { AxiosError } from 'axios';

// Sidan vi legger til preserveOriginalError i initApm skal feilhendelser rapportert ha originalError satt.
type WithOriginalError = {
  originalError: Error;
};

/** Typen på innslaget beforeSend får inn frå faro. */
type BeforeSendItem = Parameters<NonNullable<InitOptions['beforeSend']>>[0];

/**
 * Sjekkar om payload på eit beforeSend innslag har originalError satt, slik at vi kan bruke den opphavlege Error
 * instansen (feks for å sjekke om feilen skal rapporterast).
 */
export const hasOriginalError = (
  item: BeforeSendItem,
): item is BeforeSendItem & { payload: BeforeSendItem['payload'] & WithOriginalError } => {
  if (item.payload == null || typeof item.payload !== 'object') {
    return false;
  }
  const { originalError } = item.payload as { originalError?: unknown };
  return originalError instanceof Error;
};

// Vi ønsker ikkje å rapportere alle feil til apm, feks viss har utgått sesjon.
// Legg til fleire her ved behov.
const shouldNotReportToApm = (error: Error | null): boolean => {
  const apiError = ExtendedApiError.findInError(error);
  if (apiError != null) {
    return apiError.isUnauthorized;
  }
  return false;
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

/** Den delen av eit exception payload vi legg ekstra informasjon på. */
type WithContext = {
  context?: Record<string, string>;
};

/**
 * Lagar ein ny context med ekstra informasjon lagt til. Alle exception innslag får loadedErrorId, og viss
 * vi har originalError hentar vi i tillegg ut nyttig informasjon frå den (status og navCallid frå api-kall).
 *
 * Legg gjerne til meir her seinare, men pass på at ikkje sensitiv info blir sendt til apm.
 */
export const enrichApmErrorContext = (
  context: Record<string, string> | undefined,
  error: Error | null,
): Record<string, string> => {
  const enriched: Record<string, string> = { ...context, loadedErrorId };
  const extendedApiError = ExtendedApiError.findInError(error);
  if (extendedApiError != null) {
    if (extendedApiError.navCallid != null) {
      enriched['navCallid'] = extendedApiError.navCallid;
    }
    enriched['status'] = `${extendedApiError.status}`;
  } else if (error instanceof AxiosError) {
    if (error.response?.status != null) {
      enriched['status'] = `${error.response.status}`;
    }
  }
  return enriched;
};

const beforeSend: NonNullable<InitOptions['beforeSend']> = item => {
  if (item.type === 'exception') {
    const originalError = hasOriginalError(item) ? item.payload.originalError : null;
    if (shouldNotReportToApm(originalError)) {
      return null;
    }
    const payload = item.payload as WithContext; // Caster her sidan item er dårleg typa, union uten god discriminant.
    payload.context = enrichApmErrorContext(payload.context, originalError);
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
    faro: {
      preserveOriginalError: true,
    },
  });
}
