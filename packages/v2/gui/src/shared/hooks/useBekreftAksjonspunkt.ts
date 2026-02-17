import { useContext, useRef } from 'react';
import type { BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import { aksjonspunkt_bekreft } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { useMutation } from '@tanstack/react-query';
import { BehandlingContext } from '../../context/BehandlingContext.js';
import { pollLocation } from '../polling/pollLocation.js';
import { usePendingModal } from '../pendingModal/PendingModalContext.js';

const HTTP_ACCEPTED = 202;

/** Enkel sjekk for å verifisere at polling-responsen faktisk er en BehandlingDto og ikke noe annet. */
const erBehandlingDto = (data: unknown): data is BehandlingDto =>
  data != null && typeof data === 'object' && 'id' in data && 'versjon' in data;

interface UseBekreftAksjonspunktResult {
  /** Bekreft aksjonspunkt og vent på at backend er ferdig med å prosessere. Oppdaterer behandling automatisk. */
  bekreft: (body: BekreftedeAksjonspunkterDto) => Promise<void>;
  /** `true` mens request og eventuell polling pågår */
  loading: boolean;
}

/**
 * Hook for å bekrefte aksjonspunkt via den genererte typescript-klienten (`aksjonspunkt_bekreft`).
 *
 * Håndterer 202 + Location-header fra backend ved å polle location-URL-en
 * til prosesseringen er ferdig. Setter behandling direkte fra polling-responsen
 * dersom `setBehandling` er tilgjengelig i `BehandlingContext`, ellers faller tilbake
 * til `refetchBehandling`.
 *
 * Viser automatisk PendingModal ved polling via `PendingModalContext`.
 *
 * @example
 * ```tsx
 * const { bekreft, loading } = useBekreftAksjonspunkt();
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
  const { refetchBehandling, setBehandling } = useContext(BehandlingContext);
  const { visPendingModal, skjulPendingModal } = usePendingModal();
  const abortControllerRef = useRef<AbortController | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (
      body: BekreftedeAksjonspunkterDto,
    ): Promise<BehandlingDto | undefined> => {
      // Avbryt eventuell pågående polling fra forrige kall
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const result = await aksjonspunkt_bekreft({ body });

      const response = result.response as Response | undefined;

      if (response != null && response.status === HTTP_ACCEPTED) {
        const location = response.headers.get('Location');
        if (location) {
          visPendingModal();
          return await pollLocation<BehandlingDto>(
            location,
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
    bekreft: async (body: BekreftedeAksjonspunkterDto) => {
      await mutateAsync(body);
    },
    loading: isPending,
  };
};
