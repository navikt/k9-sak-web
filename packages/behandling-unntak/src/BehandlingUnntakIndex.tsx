import { useCallback, useEffect, useState } from 'react';

import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { ReduxFormStateCleaner, Rettigheter, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import {
  ArbeidsgiverOpplysningerWrapper,
  Behandling,
  Fagsak,
  FagsakPerson,
  FeatureToggles,
  KodeverkMedNavn,
} from '@k9-sak-web/types';

import UnntakPaneler from './components/UnntakPaneler';
import { requestUnntakApi, restApiUnntakHooks, UnntakBehandlingApiKeys } from './data/unntakBehandlingApi';
import FetchedData from './types/fetchedDataTsType';

const unntakData = [
  { key: UnntakBehandlingApiKeys.AKSJONSPUNKTER },
  { key: UnntakBehandlingApiKeys.VILKAR },
  { key: UnntakBehandlingApiKeys.PERSONOPPLYSNINGER },
  { key: UnntakBehandlingApiKeys.SOKNAD },
  { key: UnntakBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING },
  { key: UnntakBehandlingApiKeys.SIMULERING_RESULTAT },
  { key: UnntakBehandlingApiKeys.FORBRUKTE_DAGER },
];

interface OwnProps {
  behandlingId: number;
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
  featureToggles: FeatureToggles;
  kodeverk?: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerWrapper;
  setRequestPendingMessage: (message: string) => void;
}

const BehandlingUnntakIndex = ({
  behandlingEventHandler,
  behandlingId,
  oppdaterBehandlingVersjon,
  kodeverk,
  fagsak,
  fagsakPerson,
  rettigheter,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtProsessSteg,
  opneSokeside,
  valgtFaktaSteg,
  arbeidsgiverOpplysninger,
  setRequestPendingMessage,
  featureToggles,
}: OwnProps) => {
  const [nyOgForrigeBehandling, setBehandlinger] = useState<{ current?: Behandling; previous?: Behandling }>({
    current: undefined,
    previous: undefined,
  });
  const behandling = nyOgForrigeBehandling.current;
  const forrigeBehandling = nyOgForrigeBehandling.previous;

  const setBehandling = useCallback(nyBehandling => {
    requestUnntakApi.resetCache();
    requestUnntakApi.setLinks(nyBehandling.links);
    setBehandlinger(prevState => ({ current: nyBehandling, previous: prevState.current }));
  }, []);

  const {
    startRequest: hentBehandling,
    data: behandlingRes,
    state: behandlingState,
  } = restApiUnntakHooks.useRestApiRunner<Behandling>(UnntakBehandlingApiKeys.BEHANDLING_UNNTAK);
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiUnntakHooks.useRestApiRunner(
    UnntakBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: settBehandlingPaVent } = restApiUnntakHooks.useRestApiRunner(
    UnntakBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: taBehandlingAvVent } = restApiUnntakHooks.useRestApiRunner<Behandling>(
    UnntakBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: henleggBehandling } = restApiUnntakHooks.useRestApiRunner(
    UnntakBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: settPaVent } = restApiUnntakHooks.useRestApiRunner(UnntakBehandlingApiKeys.UPDATE_ON_HOLD);
  const { startRequest: opprettVerge } = restApiUnntakHooks.useRestApiRunner(UnntakBehandlingApiKeys.VERGE_OPPRETT);
  const { startRequest: fjernVerge } = restApiUnntakHooks.useRestApiRunner(UnntakBehandlingApiKeys.VERGE_FJERN);

  useEffect(() => {
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: params => nyBehandlendeEnhet(params).then(() => hentBehandling({ behandlingId }, true)),
      settBehandlingPaVent: params => settBehandlingPaVent(params).then(() => hentBehandling({ behandlingId }, true)),
      taBehandlingAvVent: params =>
        taBehandlingAvVent(params).then(behandlingResTaAvVent => setBehandling(behandlingResTaAvVent)),
      henleggBehandling: params => henleggBehandling(params),
      opprettVerge: params =>
        opprettVerge(params).then(behandlingResOpprettVerge => setBehandling(behandlingResOpprettVerge)),
      fjernVerge: params => fjernVerge(params).then(behandlingResFjernVerge => setBehandling(behandlingResFjernVerge)),
    });

    requestUnntakApi.setRequestPendingHandler(setRequestPendingMessage);
    requestUnntakApi.setAddErrorMessageHandler(addErrorMessage);

    void hentBehandling({ behandlingId }, false);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state } = restApiUnntakHooks.useMultipleRestApi<FetchedData>(unntakData, {
    keepData: true,
    updateTriggers: [behandling?.versjon],
    suspendRequest: !behandling,
  });

  const harIkkeHentetBehandlingsdata = state === RestApiState.LOADING || state === RestApiState.NOT_STARTED;
  if (!behandling || (harIkkeHentetBehandlingsdata && data === undefined) || state === RestApiState.ERROR) {
    return <LoadingPanel />;
  }

  return (
    <>
      <ReduxFormStateCleaner
        behandlingId={behandling.id}
        behandlingVersjon={harIkkeHentetBehandlingsdata ? forrigeBehandling.versjon : behandling.versjon}
      />
      <UnntakPaneler
        behandling={harIkkeHentetBehandlingsdata ? forrigeBehandling : behandling}
        fetchedData={data}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        alleKodeverk={kodeverk}
        rettigheter={rettigheter}
        valgtProsessSteg={valgtProsessSteg}
        valgtFaktaSteg={valgtFaktaSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        settPaVent={settPaVent}
        opneSokeside={opneSokeside}
        hasFetchError={behandlingState === RestApiState.ERROR}
        setBehandling={setBehandling}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysninger ? arbeidsgiverOpplysninger.arbeidsgivere : {}}
        featureToggles={featureToggles}
      />
    </>
  );
};

export default BehandlingUnntakIndex;
