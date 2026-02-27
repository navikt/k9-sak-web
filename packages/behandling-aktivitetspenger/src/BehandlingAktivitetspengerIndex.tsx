import { Rettigheter, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { AktivitetspengerFakta } from './components/AktivitetspengerFakta';
import { AktivitetspengerProsess } from './components/AktivitetspengerProsess';
import { BehandlingPåVent } from './components/behandlingPåVent/BehandlingPåVent';
import {
  UngdomsytelseBehandlingApiKeys,
  requestUngdomsytelseApi,
  restApiUngdomsytelseHooks,
} from './data/ungdomsytelseBehandlingApi';
import { UngSakBackendClient } from './data/UngSakBackendClient';

interface OwnProps {
  fagsak: Fagsak;
  rettigheter: Rettigheter;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: { [key: string]: (params: any) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  setRequestPendingMessage: (message: string) => void;
  behandlingVersjon: number;
  behandlingUuid: string;
}

const BehandlingAktivitetspengerIndex = ({
  behandlingEventHandler,
  oppdaterBehandlingVersjon,
  fagsak,
  rettigheter,
  oppdaterProsessStegOgFaktaPanelIUrl,
  opneSokeside,
  setRequestPendingMessage,
  behandlingVersjon,
  behandlingUuid,
}: OwnProps) => {
  const ungSakProsessApi = new UngSakBackendClient();

  const setBehandling = useCallback(nyBehandling => {
    requestUngdomsytelseApi.resetCache();
    requestUngdomsytelseApi.setLinks(nyBehandling.links);
  }, []);

  const { data: behandling, refetch: refetchBehandling } = useSuspenseQuery({
    queryKey: ['behandling', behandlingVersjon, behandlingUuid],
    queryFn: () => ungSakProsessApi.getBehandling(behandlingUuid),
  });
  const { data: aksjonspunkter } = useSuspenseQuery({
    queryKey: ['aksjonspunkter', behandlingUuid],
    queryFn: () => ungSakProsessApi.getAksjonspunkter(behandlingUuid),
  });

  const { data: vilkår } = useSuspenseQuery({
    queryKey: ['vilkår', behandlingUuid],
    queryFn: () => ungSakProsessApi.getVilkår(behandlingUuid),
  });

  const { data: personopplysninger } = useSuspenseQuery({
    queryKey: ['personopplysninger', behandlingUuid],
    queryFn: () => ungSakProsessApi.getPersonopplysninger(behandlingUuid),
  });

  useSetBehandlingVedEndring(behandling, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: settBehandlingPaVent } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: taBehandlingAvVent } = restApiUngdomsytelseHooks.useRestApiRunner<Behandling>(
    UngdomsytelseBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: henleggBehandling } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: settPaVent } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.UPDATE_ON_HOLD,
  );

  useEffect(() => {
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: params => nyBehandlendeEnhet(params).then(() => refetchBehandling()),
      settBehandlingPaVent: params => settBehandlingPaVent(params).then(() => refetchBehandling()),
      taBehandlingAvVent: params =>
        taBehandlingAvVent(params).then(behandlingResTaAvVent => setBehandling(behandlingResTaAvVent)),
      henleggBehandling: params => henleggBehandling(params),
    });

    requestUngdomsytelseApi.setRequestPendingHandler(setRequestPendingMessage);
    requestUngdomsytelseApi.setAddErrorMessageHandler(addErrorMessage);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  if (!behandling) {
    return <LoadingPanel />;
  }

  return (
    <>
      <BehandlingPåVent behandling={behandling} aksjonspunkter={aksjonspunkter ?? []} settPaVent={settPaVent} />
      <AktivitetspengerProsess
        fagsak={fagsak}
        behandling={behandling}
        rettigheter={rettigheter}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        opneSokeside={opneSokeside}
        setBehandling={setBehandling}
      />
      <AktivitetspengerFakta
        behandling={behandling}
        fagsak={fagsak}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        setBehandling={setBehandling}
      />
    </>
  );
};

export default BehandlingAktivitetspengerIndex;
