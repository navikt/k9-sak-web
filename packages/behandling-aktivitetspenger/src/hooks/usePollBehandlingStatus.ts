import { AktivitetspengerApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/AktivitetspengerApi.js';
import { behandlingQueryOptions } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/aktivitetspengerQueryOptions.js';
import { ung_sak_kontrakt_AsyncPollingStatus_Status } from '@navikt/ung-sak-typescript-client/types';
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
  const MAX_POLL_ATTEMPTS = 150;
  const queryClient = useQueryClient();

  const pollTilBehandlingErKlar = async () => {
    const poll = async (remainingAttempts: number): Promise<boolean> => {
      if (remainingAttempts === 0) {
        return false;
      }

      const status = await api.hentBehandlingMidlertidigStatus(behandling.uuid);
      if (status?.status === ung_sak_kontrakt_AsyncPollingStatus_Status.PENDING) {
        await new Promise(resolve => setTimeout(resolve, status.pollIntervalMillis ?? 500));
        return poll(remainingAttempts - 1);
      }

      return true;
    };

    const erKlar = await poll(MAX_POLL_ATTEMPTS);
    if (!erKlar) {
      return;
    }

    const nyBehandling = await queryClient.fetchQuery(
      behandlingQueryOptions(api, { uuid: behandling.uuid, versjon: behandling.versjon }),
    );
    if (nyBehandling) {
      setBehandling(nyBehandling);
    }
  };

  return { pollTilBehandlingErKlar };
};
