import { useEffect, useRef, useState } from 'react';

import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import { behandlingQueryOptions } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { delay } from '@k9-sak-web/gui/utils/delay.js';
import { ung_sak_kontrakt_AsyncPollingStatus_Status } from '@navikt/ung-sak-typescript-client/types';
import { useQueryClient } from '@tanstack/react-query';

const MAX_POLL_ATTEMPTS = 150;

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
      let attempts = 0;
      while (attempts < MAX_POLL_ATTEMPTS) {
        if (controller.signal.aborted) return;

        const status = await api.hentBehandlingMidlertidigStatus(behandlingRef.current.uuid, controller.signal);
        if (status?.status !== ung_sak_kontrakt_AsyncPollingStatus_Status.PENDING) break;

        attempts++;
        await delay(status.pollIntervalMillis ?? 500, controller.signal).catch(() => {});
      }

      if (controller.signal.aborted) return;

      if (attempts >= MAX_POLL_ATTEMPTS) {
        throw new Error(
          `Polling av behandling ${behandlingRef.current.uuid} nådde maks antall forsøk uten at behandlingen ble klar.`,
        );
      }

      const nyBehandling = await queryClient.fetchQuery(
        behandlingQueryOptions(api, {
          uuid: behandlingRef.current.uuid,
          versjon: behandlingRef.current.versjon,
        }),
      );
      if (!controller.signal.aborted && nyBehandling) {
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
