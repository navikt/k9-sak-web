import { useCallback, useContext, useRef, useState } from 'react';
import type { k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { aksjonspunkt_bekreft } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { BehandlingContext } from '../../context/BehandlingContext.js';

const HTTP_ACCEPTED = 202;
const MAX_POLLING_FORSØK = 150;
const DEFAULT_POLLING_INTERVALL_MS = 1000;

enum AsyncPollingStatus {
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED',
  HALTED = 'HALTED',
}

interface PollingResponse {
  status: AsyncPollingStatus;
  pollIntervalMillis?: number;
  message?: string;
  location?: string;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const pollLocation = async (
  location: string,
  onPollingMessage?: (melding: string | undefined) => void,
  signal?: AbortSignal,
): Promise<void> => {
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
      // Polling ferdig — ressurs er klar
      onPollingMessage?.(undefined);
      return;
    }

    // Sjekk om body inneholder polling-status
    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('application/json')) {
      const body = (await response.json()) as PollingResponse;

      if (body.status === AsyncPollingStatus.PENDING) {
        intervall = body.pollIntervalMillis ?? DEFAULT_POLLING_INTERVALL_MS;
        onPollingMessage?.(body.message);
        forsøk++;
        continue;
      }

      if (body.status === AsyncPollingStatus.COMPLETE) {
        onPollingMessage?.(undefined);
        return;
      }

      if (body.status === AsyncPollingStatus.DELAYED || body.status === AsyncPollingStatus.HALTED) {
        // Serveren har forsinket eller stoppet prosesseringen, men oppgir ny location
        if (body.location) {
          location = body.location;
          forsøk++;
          continue;
        }
        onPollingMessage?.(undefined);
        return;
      }

      if (body.status === AsyncPollingStatus.CANCELLED) {
        onPollingMessage?.(undefined);
        return;
      }
    }

    // Hvis response er 200 uten kjent polling-status, anta ferdig
    if (response.ok) {
      onPollingMessage?.(undefined);
      return;
    }

    throw new Error(`Polling mot ${location} feilet med status ${response.status}`);
  }

  throw new Error(`Polling mot ${location} nådde maks antall forsøk (${MAX_POLLING_FORSØK})`);
};

interface UseBekreftAksjonspunktResult {
  /** Bekreft aksjonspunkt og vent på at backend er ferdig med å prosessere. Oppdaterer behandling automatisk. */
  bekreft: (body: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto) => Promise<void>;
  /** `true` mens request og eventuell polling pågår */
  loading: boolean;
  /** Eventuell fremdriftsmelding fra backend under polling */
  pollingMelding: string | undefined;
}

/**
 * Hook for å bekrefte aksjonspunkt via den genererte typescript-klienten (`aksjonspunkt_bekreft`).
 *
 * Håndterer 202 + Location-header fra backend ved å polle location-URL-en
 * til prosesseringen er ferdig, og kaller deretter `refetchBehandling` fra `BehandlingContext`
 * for å oppdatere behandlingen.
 *
 * @example
 * ```tsx
 * const { bekreft, loading, pollingMelding } = useBekreftAksjonspunkt();
 *
 * const onSubmit = async (data) => {
 *   await bekreft({
 *     behandlingId: `${behandling.id}`,
 *     behandlingVersjon: behandling.versjon,
 *     bekreftedeAksjonspunktDtoer: [{ '@type': '5084', begrunnelse: data.begrunnelse }],
 *   });
 * };
 * ```
 */
export const useBekreftAksjonspunkt = (): UseBekreftAksjonspunktResult => {
  const { refetchBehandling } = useContext(BehandlingContext);
  const [loading, setLoading] = useState(false);
  const [pollingMelding, setPollingMelding] = useState<string | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);

  const bekreft = useCallback(
    async (body: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto) => {
      // Avbryt eventuell pågående polling fra forrige kall
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setPollingMelding(undefined);

      try {
        const result = await aksjonspunkt_bekreft({ body });

        // SDK returnerer { data, request, response } med responseStyle 'fields'
        const response = result.response as Response | undefined;

        if (response != null && response.status === HTTP_ACCEPTED) {
          const location = response.headers.get('Location');
          if (location) {
            await pollLocation(location, setPollingMelding, abortController.signal);
          }
        }

        if (!abortController.signal.aborted) {
          await refetchBehandling();
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
          setPollingMelding(undefined);
        }
      }
    },
    [refetchBehandling],
  );

  return { bekreft, loading, pollingMelding };
};
