import { useContext, useEffect, useRef } from 'react';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import { useMutation } from '@tanstack/react-query';
import { AksjonspunktContext } from '../../context/AksjonspunktContext.js';
import { BehandlingContext } from '../../context/BehandlingContext.js';
import { pollLocation } from '../polling/pollLocation.js';
import { usePendingModal } from '../pendingModal/PendingModalContext.js';

const HTTP_ACCEPTED = 202;

/** Enkel sjekk for å verifisere at polling-responsen faktisk er en BehandlingDto og ikke noe annet. */
const erBehandlingDto = (data: unknown): data is BehandlingDto =>
  data != null && typeof data === 'object' && 'id' in data && 'versjon' in data;

/**
 * Klient som vet hvordan aksjonspunkter bekreftes mot en bestemt backend.
 * Hver backend (k9sak, k9klage, osv.) eksporterer sin egen klient fra backend-pakken.
 */
export interface BekreftAksjonspunktClient<T> {
  bekreft(
    aksjonspunkter: T[],
    behandling: { id: number; versjon: number; uuid: string },
  ): Promise<{ response: Response }>;
  poll(url: string, signal?: AbortSignal): Promise<{ data: unknown; response: Response }>;
}

/**
 * Hook for å bekrefte aksjonspunkter mot en backend.
 *
 * Leser aksjonspunkt-klienten fra `AksjonspunktContext` og behandling fra `BehandlingContext`.
 *
 * Håndterer 202 + Location-header fra backend ved å polle location-URL-en
 * til prosesseringen er ferdig, og oppdaterer behandling via `setBehandling`
 * eller `refetchBehandling`.
 *
 * @typeParam T - Backend-spesifikk BekreftetAksjonspunktDto som styrer hva `bekreft()` aksepterer.
 *
 * @example
 * ```tsx
 * import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
 *
 * const { bekreft, loading } = useBekreftAksjonspunkt<BekreftetAksjonspunktDto>();
 *
 * const onSubmit = async (data) => {
 *   await bekreft({ '@type': '5084', begrunnelse: data.begrunnelse });
 * };
 * ```
 */

// setter denne til never for å tvinge på caller å spesifisere type-parameter T, og dermed få type-sjekk på bekreft()-argumentet.
export const useBekreftAksjonspunkt = <T = never>() => {
  const behandlingContext = useContext(BehandlingContext);
  if (behandlingContext == null) {
    throw new Error('useBekreftAksjonspunkt må brukes innenfor en BehandlingProvider.');
  }
  const { behandling, refetchBehandling, setBehandling } = behandlingContext;
  const aksjonspunktClient = useContext(AksjonspunktContext);
  const { visPendingModal, skjulPendingModal } = usePendingModal();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (aksjonspunkter: T[]): Promise<BehandlingDto | undefined> => {
      if (aksjonspunktClient == null) {
        throw new Error('useBekreftAksjonspunkt krever at AksjonspunktContext.Provider er satt opp med en aksjonspunktClient.');
      }
      if (behandling?.id == null || behandling?.versjon == null || behandling?.uuid == null) {
        throw new Error('useBekreftAksjonspunkt krever at BehandlingProvider har fått behandling med id, versjon og uuid.');
      }

      // Avbryt eventuell pågående polling fra forrige kall
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const result = await aksjonspunktClient.bekreft(aksjonspunkter, {
        id: behandling.id,
        versjon: behandling.versjon,
        uuid: behandling.uuid,
      });

      if (result.response.status === HTTP_ACCEPTED) {
        const location = result.response.headers.get('Location');
        if (location) {
          visPendingModal();
          return await pollLocation<BehandlingDto>(
            location,
            (url, signal) => aksjonspunktClient.poll(url, signal),
            melding => visPendingModal(melding ?? undefined),
            abortController.signal,
          );
        }
      }

      return undefined;
    },
    onSuccess: async (pollingResult: BehandlingDto | undefined) => {
      skjulPendingModal();
      if (erBehandlingDto(pollingResult) && setBehandling != null) {
        setBehandling(pollingResult);
      } else {
        await refetchBehandling();
      }
    },
    onError: () => {
      skjulPendingModal();
    },
  });

  return {
    bekreft: async (aksjonspunkter: T | T[]) => {
      const arr = Array.isArray(aksjonspunkter) ? aksjonspunkter : [aksjonspunkter];
      await mutateAsync(arr);
    },
    loading: isPending,
  };
};
