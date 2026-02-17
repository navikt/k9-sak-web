import type { AsyncPollingStatus } from '@k9-sak-web/backend/k9sak/kontrakt/AsyncPollingStatus.js';
import { AsyncPollingStatusStatus } from '@k9-sak-web/backend/k9sak/kontrakt/AsyncPollingStatus.js';

const MAX_POLLING_FORSØK = 150;
const DEFAULT_POLLING_INTERVALL_MS = 1000;

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

    if (!response.ok) {
      throw new Error(`Polling mot ${location} feilet med HTTP ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (!contentType?.includes('application/json')) {
      onPollingMessage?.(undefined);
      return undefined;
    }

    const body = await response.json();

    // Sjekk om responsen er en polling-status (AsyncPollingStatus) eller den endelige ressursen
    const status = body?.status as AsyncPollingStatusStatus | undefined;
    if (status != null && Object.values(AsyncPollingStatusStatus).includes(status)) {
      const pollingBody = body as AsyncPollingStatus;

      if (status === AsyncPollingStatusStatus.PENDING) {
        intervall = pollingBody.pollIntervalMillis ?? DEFAULT_POLLING_INTERVALL_MS;
        onPollingMessage?.(pollingBody.message);
        forsøk++;
        continue;
      }

      if (status === AsyncPollingStatusStatus.COMPLETE) {
        onPollingMessage?.(pollingBody.message);
        return undefined;
      }

      if (status === AsyncPollingStatusStatus.DELAYED || status === AsyncPollingStatusStatus.HALTED) {
        // Serveren har forsinket eller stoppet prosesseringen, men oppgir ny location
        if (pollingBody.location) {
          location = pollingBody.location;
          forsøk++;
          continue;
        }
        onPollingMessage?.(pollingBody.message);
        return undefined;
      }

      if (status === AsyncPollingStatusStatus.CANCELLED) {
        onPollingMessage?.(pollingBody.message);
        return undefined;
      }
    }

    // Ingen kjent polling-status — dette er den endelige ressursen
    onPollingMessage?.(undefined);
    return body as T;
  }

  throw new Error(`Polling mot ${location} nådde maks antall forsøk (${MAX_POLLING_FORSØK})`);
};
