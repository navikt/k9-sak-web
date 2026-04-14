import { UngSakApi } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/UngSakApi.js';
import { behandlingQueryOptions } from '@k9-sak-web/gui/prosess/aktivitetspenger-prosess/ungSakQueryOptions.js';
import { ung_sak_kontrakt_AsyncPollingStatus_Status } from '@navikt/ung-sak-typescript-client/types';
import { useQueryClient } from '@tanstack/react-query';

interface Behandling {
  uuid: string;
  versjon: number;
}

export const usePollBehandlingStatus = (
  api: UngSakApi,
  behandling: Behandling,
  setBehandling: (behandling: Awaited<ReturnType<UngSakApi['getBehandling']>>) => void,
) => {
  const queryClient = useQueryClient();

  const pollTilBehandlingErKlar = async () => {
    const poll = async (): Promise<void> => {
      const status = await api.hentBehandlingMidlertidigStatus(behandling.uuid);
      if (status?.status === ung_sak_kontrakt_AsyncPollingStatus_Status.PENDING) {
        await new Promise(resolve => setTimeout(resolve, status.pollIntervalMillis ?? 500));
        return poll();
      }
    };
    await poll();
    const nyBehandling = await queryClient.fetchQuery(
      behandlingQueryOptions(api, { uuid: behandling.uuid, versjon: behandling.versjon }),
    );
    if (nyBehandling) {
      setBehandling(nyBehandling);
    }
  };

  return { pollTilBehandlingErKlar };
};
