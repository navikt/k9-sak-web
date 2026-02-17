import type { AsyncPollingStatus } from '@k9-sak-web/backend/k9sak/kontrakt/AsyncPollingStatus.js';
import { AsyncPollingStatusStatus } from '@k9-sak-web/backend/k9sak/kontrakt/AsyncPollingStatus.js';

const MAX_POLLING_FORSØK = 150;
const DEFAULT_POLLING_INTERVALL_MS = 1000;
const HTTP_ACCEPTED = 202;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Poller en location-URL returnert fra backend (typisk via 202 Accepted + Location-header).
 *
 * Backend bruker "long-polling"-mønsteret der location-URLen returnerer JSON med en
 * `AsyncPollingStatus` som indikerer om prosesseringen er ferdig, pågår, forsinket, etc.
 *
 * Returnerer response-body fra den endelige 200-responsen (typisk `BehandlingDto`),
 * eller `undefined` dersom polling ble avbrutt eller kansellert.
 *
 * @param location - URL å polle mot (typisk fra Location-header)
 * @param onPollingMessage - Callback som kalles med fremdriftsmeldinger fra backend, eller `undefined` når polling er ferdig
 * @param signal - AbortSignal for å kunne avbryte polling
 *
 * @example
 * ```ts
 * const response = await someApiCall();
 * if (response.status === 202) {
 *   const location = response.headers.get('Location');
 *   if (location) {
 *     const behandling = await pollLocation(location);
 *   }
 * }
 * ```
 */
export const pollLocation = async <T = unknown>(
  location: string,
  onPollingMessage?: (melding: string | undefined) => void,
  signal?: AbortSignal,
): Promise<T | undefined> => {
  let forsøk = 0;
  let intervall = 0;

  while (forsøk < MAX_POLLING_FORSØK) {
    if (signal?.aborted) {
      return;
    }

    await wait(intervall);

    if (signal?.aborted) {
      return;
    }

    const response = await fetch(location, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });

    if (response.ok && response.status !== HTTP_ACCEPTED) {
      // Polling ferdig — ressurs er klar. Returner response-body.
      onPollingMessage?.(undefined);
      const responseContentType = response.headers.get('Content-Type');
      if (responseContentType?.includes('application/json')) {
        return (await response.json()) as T;
      }
      return undefined;
    }

    // Sjekk om body inneholder polling-status
    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('application/json')) {
      const body = (await response.json()) as AsyncPollingStatus;

      if (body.status === AsyncPollingStatusStatus.PENDING) {
        intervall = body.pollIntervalMillis ?? DEFAULT_POLLING_INTERVALL_MS;
        onPollingMessage?.(body.message);
        forsøk++;
        continue;
      }

      if (body.status === AsyncPollingStatusStatus.COMPLETE) {
        onPollingMessage?.(undefined);
        return undefined;
      }

      if (body.status === AsyncPollingStatusStatus.DELAYED || body.status === AsyncPollingStatusStatus.HALTED) {
        // Serveren har forsinket eller stoppet prosesseringen, men oppgir ny location
        if (body.location) {
          location = body.location;
          forsøk++;
          continue;
        }
        onPollingMessage?.(undefined);
        return undefined;
      }

      if (body.status === AsyncPollingStatusStatus.CANCELLED) {
        onPollingMessage?.(undefined);
        return undefined;
      }
    }

    // kast feil hvis ukjent polling-status
    throw new Error(`Polling mot ${location} feilet med status ${response.status}`);
  }

  throw new Error(`Polling mot ${location} nådde maks antall forsøk (${MAX_POLLING_FORSØK})`);
};
