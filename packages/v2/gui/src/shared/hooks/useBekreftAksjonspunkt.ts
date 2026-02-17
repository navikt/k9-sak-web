import { useContext, useRef } from 'react';
import type { k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { aksjonspunkt_bekreft } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { useMutation } from '@tanstack/react-query';
import { BehandlingContext } from '../../context/BehandlingContext.js';
import { pollLocation } from '../polling/pollLocation.js';
import { usePendingModal } from '../pendingModal/PendingModalContext.js';

const HTTP_ACCEPTED = 202;

interface UseBekreftAksjonspunktResult {
  /** Bekreft aksjonspunkt og vent på at backend er ferdig med å prosessere. Oppdaterer behandling automatisk. */
  bekreft: (body: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto) => Promise<void>;
  /** `true` mens request og eventuell polling pågår */
  loading: boolean;
}

/**
 * Hook for å bekrefte aksjonspunkt via den genererte typescript-klienten (`aksjonspunkt_bekreft`).
 *
 * Håndterer 202 + Location-header fra backend ved å polle location-URL-en
 * til prosesseringen er ferdig, og kaller deretter `refetchBehandling` fra `BehandlingContext`
 * for å oppdatere behandlingen.
 *
 * Viser automatisk en app-bred PendingModal ved polling via `PendingModalContext`.
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
  const { refetchBehandling } = useContext(BehandlingContext);
  const { visPendingModal, skjulPendingModal } = usePendingModal();
  const abortControllerRef = useRef<AbortController | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (body: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto) => {
      // Avbryt eventuell pågående polling fra forrige kall
      abortControllerRef.current?.abort();
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const result = await aksjonspunkt_bekreft({ body });

      // SDK returnerer { data, request, response } med responseStyle 'fields'
      const response = result.response as Response | undefined;

      if (response != null && response.status === HTTP_ACCEPTED) {
        const location = response.headers.get('Location');
        if (location) {
          visPendingModal();
          await pollLocation(location, melding => visPendingModal(melding ?? undefined), abortController.signal);
        }
      }
    },
    onSuccess: async () => {
      skjulPendingModal();
      await refetchBehandling();
    },
    onError: () => {
      skjulPendingModal();
    },
  });

  return { bekreft: mutateAsync, loading: isPending };
};
