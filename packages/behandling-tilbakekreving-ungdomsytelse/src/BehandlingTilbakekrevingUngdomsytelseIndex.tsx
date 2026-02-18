import { useCallback, useEffect, useState } from 'react';

import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { ReduxFormStateCleaner, Rettigheter, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import NetworkErrorPage from '@k9-sak-web/gui/app/feilmeldinger/NetworkErrorPage.js';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { extractErrorInfo } from '@k9-sak-web/rest-api-hooks/src/error/extractErrorInfo';
import { Behandling, Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import TilbakekrevingPaneler from './components/TilbakekrevingPaneler';
import {
  requestTilbakekrevingApi,
  restApiTilbakekrevingHooks,
  TilbakekrevingBehandlingApiKeys,
} from './data/tilbakekrevingBehandlingApi';
import FetchedData from './types/fetchedDataTsType';

const tilbakekrevingData = [
  { key: TilbakekrevingBehandlingApiKeys.AKSJONSPUNKTER },
  { key: TilbakekrevingBehandlingApiKeys.FEILUTBETALING_FAKTA },
  { key: TilbakekrevingBehandlingApiKeys.PERIODER_FORELDELSE },
  { key: TilbakekrevingBehandlingApiKeys.BEREGNINGSRESULTAT },
];

interface OwnProps {
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  rettigheter: Rettigheter;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtProsessSteg?: string;
  valgtFaktaSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: { [key: string]: (params: any) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  harApenRevurdering: boolean;
  kodeverk: { [key: string]: KodeverkMedNavn[] };
  setRequestPendingMessage: (message: string) => void;
  behandlingUuid: string | undefined;
}

const BehandlingTilbakekrevingUngdomsytelseIndex = ({
  behandlingEventHandler,
  behandlingUuid,
  oppdaterBehandlingVersjon,
  kodeverk: fpsakKodeverk,
  fagsak,
  fagsakPerson,
  rettigheter,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtProsessSteg,
  opneSokeside,
  valgtFaktaSteg,
  harApenRevurdering,
  setRequestPendingMessage,
}: OwnProps) => {
  const [nyOgForrigeBehandling, setBehandlinger] = useState<{ current?: Behandling; previous?: Behandling }>({
    current: undefined,
    previous: undefined,
  });
  const behandling = nyOgForrigeBehandling.current;
  const forrigeBehandling = nyOgForrigeBehandling.previous;

  const setBehandling = useCallback(nyBehandling => {
    requestTilbakekrevingApi.resetCache();
    requestTilbakekrevingApi.setLinks(nyBehandling.links);
    setBehandlinger(prevState => ({ current: nyBehandling, previous: prevState.current }));
  }, []);

  const { data: tilbakekrevingKodeverk } = restApiTilbakekrevingHooks.useRestApi<{ [key: string]: KodeverkMedNavn[] }>(
    TilbakekrevingBehandlingApiKeys.TILBAKE_KODEVERK,
  );

  const {
    startRequest: hentBehandling,
    data: behandlingRes,
    state: behandlingState,
  } = restApiTilbakekrevingHooks.useRestApiRunner<Behandling>(TilbakekrevingBehandlingApiKeys.BEHANDLING_TILBAKE);
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiTilbakekrevingHooks.useRestApiRunner(
    TilbakekrevingBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: settBehandlingPaVent } = restApiTilbakekrevingHooks.useRestApiRunner(
    TilbakekrevingBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: taBehandlingAvVent } = restApiTilbakekrevingHooks.useRestApiRunner<Behandling>(
    TilbakekrevingBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: henleggBehandling } = restApiTilbakekrevingHooks.useRestApiRunner(
    TilbakekrevingBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: settPaVent } = restApiTilbakekrevingHooks.useRestApiRunner(
    TilbakekrevingBehandlingApiKeys.UPDATE_ON_HOLD,
  );
  const { startRequest: opprettVerge } = restApiTilbakekrevingHooks.useRestApiRunner(
    TilbakekrevingBehandlingApiKeys.VERGE_OPPRETT,
  );
  const { startRequest: fjernVerge } = restApiTilbakekrevingHooks.useRestApiRunner(
    TilbakekrevingBehandlingApiKeys.VERGE_FJERN,
  );

  useEffect(() => {
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: params => nyBehandlendeEnhet(params).then(() => hentBehandling(behandlingUuid, true)),
      settBehandlingPaVent: params => settBehandlingPaVent(params).then(() => hentBehandling(behandlingUuid, true)),
      taBehandlingAvVent: params =>
        taBehandlingAvVent(params).then(behandlingResTaAvVent => setBehandling(behandlingResTaAvVent)),
      henleggBehandling: params => henleggBehandling(params),
      opprettVerge: params =>
        opprettVerge(params).then(behandlingResOpprettVerge => setBehandling(behandlingResOpprettVerge)),
      fjernVerge: params => fjernVerge(params).then(behandlingResFjernVerge => setBehandling(behandlingResFjernVerge)),
    });

    requestTilbakekrevingApi.setRequestPendingHandler(setRequestPendingMessage);
    requestTilbakekrevingApi.setAddErrorMessageHandler(addErrorMessage);

    void hentBehandling(behandlingUuid, false);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state, error } = restApiTilbakekrevingHooks.useMultipleRestApi<FetchedData>(tilbakekrevingData, {
    keepData: true,
    updateTriggers: [behandling?.versjon],
    suspendRequest: !behandling,
  });

  const hasNotFinished = state === RestApiState.LOADING || state === RestApiState.NOT_STARTED;
  if (!behandling || !tilbakekrevingKodeverk || (hasNotFinished && data === undefined)) {
    return <LoadingPanel />;
  }

  if (state === RestApiState.ERROR) {
    return <NetworkErrorPage {...extractErrorInfo(error)} />;
  }

  return (
    <>
      <ReduxFormStateCleaner
        behandlingId={behandling.id}
        behandlingVersjon={hasNotFinished ? forrigeBehandling.versjon : behandling.versjon}
      />
      <TilbakekrevingPaneler
        behandling={hasNotFinished ? forrigeBehandling : behandling}
        fetchedData={data}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        kodeverk={tilbakekrevingKodeverk}
        fpsakKodeverk={fpsakKodeverk}
        rettigheter={rettigheter}
        valgtProsessSteg={valgtProsessSteg}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        settPaVent={settPaVent}
        opneSokeside={opneSokeside}
        harApenRevurdering={harApenRevurdering}
        hasFetchError={behandlingState === RestApiState.ERROR}
        setBehandling={setBehandling}
      />
    </>
  );
};

export default BehandlingTilbakekrevingUngdomsytelseIndex;
