import { useEffect, useRef, useState } from 'react';

import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import {
  behandlingQueryOptions,
  ventTilBehandlingErKlar,
} from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { useQueryClient } from '@tanstack/react-query';

interface Behandling {
  uuid: string;
  versjon: number;
}

export const usePollBehandlingStatus = (
  api: AktivitetspengerApi,
  behandling: Behandling,
  setBehandling: (behandling: Awaited<ReturnType<AktivitetspengerApi['getBehandling']>>) => void,
) => {
  const queryClient = useQueryClient();
  const [isPolling, setIsPolling] = useState(false);
  const behandlingRef = useRef(behandling);
  behandlingRef.current = behandling;

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const pollTilBehandlingErKlar = async () => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsPolling(true);
    try {
      const { uuid, versjon } = behandlingRef.current;
      let ferdigBehandling;
      try {
        ferdigBehandling = await ventTilBehandlingErKlar(api, uuid, controller.signal);
      } catch (error) {
        if (controller.signal.aborted) return;
        throw error;
      }
      if (controller.signal.aborted) return;

      // Hentes utenom queryFn så status ikke polles på nytt uten vårt AbortSignal
      const nyBehandling = ferdigBehandling ?? (await api.getBehandling(uuid));
      if (!controller.signal.aborted && nyBehandling) {
        // Gammel nøkkel oppdateres så ny versjon når fram via useQuery og useOppdateringAvBehandlingsversjon
        queryClient.setQueryData(behandlingQueryOptions(api, { uuid, versjon }).queryKey, nyBehandling);
        // Forhåndsutfyller cache for ny versjon så behandling ikke er undefined i mellomtiden
        queryClient.setQueryData(
          behandlingQueryOptions(api, { uuid: nyBehandling.uuid, versjon: nyBehandling.versjon }).queryKey,
          nyBehandling,
        );
        setBehandling(nyBehandling);
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setIsPolling(false);
      }
    }
  };

  return { pollTilBehandlingErKlar, isPolling };
};
