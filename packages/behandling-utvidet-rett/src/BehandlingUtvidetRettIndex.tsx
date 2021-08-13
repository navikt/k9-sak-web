import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { Rettigheter, ReduxFormStateCleaner, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import {
  Behandling,
  KodeverkMedNavn,
  FeatureToggles,
  Fagsak,
  FagsakPerson,
  ArbeidsgiverOpplysningerWrapper,
} from '@k9-sak-web/types';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import FetchedData from './types/fetchedDataTsType';
import UtvidetRettPaneler from './components/UtvidetRettPaneler';
import {
  restApiUtvidetRettHooks,
  requestUtvidetRettApi,
  UtvidetRettBehandlingApiKeys,
} from './data/utvidetRettBehandlingApi';

const utvidetRettData = [
  { key: UtvidetRettBehandlingApiKeys.AKSJONSPUNKTER },
  { key: UtvidetRettBehandlingApiKeys.RAMMEVEDTAK },
  { key: UtvidetRettBehandlingApiKeys.OMSORGEN_FOR },
  { key: UtvidetRettBehandlingApiKeys.PERSONOPPLYSNINGER },
  { key: UtvidetRettBehandlingApiKeys.SOKNAD },
  { key: UtvidetRettBehandlingApiKeys.VILKAR },
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

const BehandlingUtvidetRettIndex: FunctionComponent<OwnProps> = ({
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
}) => {
  const [nyOgForrigeBehandling, setBehandlinger] = useState<{ current?: Behandling; previous?: Behandling }>({
    current: undefined,
    previous: undefined,
  });
  const behandling = nyOgForrigeBehandling.current;
  const forrigeBehandling = nyOgForrigeBehandling.previous;

  const setBehandling = useCallback(nyBehandling => {
    requestUtvidetRettApi.resetCache();
    requestUtvidetRettApi.setLinks(nyBehandling.links);
    setBehandlinger(prevState => ({ current: nyBehandling, previous: prevState.current }));
  }, []);

  const {
    startRequest: hentBehandling,
    data: behandlingRes,
    state: behandlingState,
  } = restApiUtvidetRettHooks.useRestApiRunner<Behandling>(UtvidetRettBehandlingApiKeys.BEHANDLING_UTVIDET_RETT);
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: settBehandlingPaVent } = restApiUtvidetRettHooks.useRestApiRunner(
    UtvidetRettBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: nyBehandlendeEnhet } = restApiUtvidetRettHooks.useRestApiRunner(
    UtvidetRettBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: henleggBehandling } = restApiUtvidetRettHooks.useRestApiRunner(
    UtvidetRettBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: taBehandlingAvVent } = restApiUtvidetRettHooks.useRestApiRunner<Behandling>(
    UtvidetRettBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: opneBehandlingForEndringer } = restApiUtvidetRettHooks.useRestApiRunner(
    UtvidetRettBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES,
  );
  const { startRequest: settPaVent } = restApiUtvidetRettHooks.useRestApiRunner(
    UtvidetRettBehandlingApiKeys.UPDATE_ON_HOLD,
  );
  const { startRequest: fjernVerge } = restApiUtvidetRettHooks.useRestApiRunner(
    UtvidetRettBehandlingApiKeys.VERGE_FJERN,
  );
  const { startRequest: lagreRisikoklassifiseringAksjonspunkt } = restApiUtvidetRettHooks.useRestApiRunner(
    UtvidetRettBehandlingApiKeys.SAVE_AKSJONSPUNKT,
  );
  const { startRequest: opprettVerge } = restApiUtvidetRettHooks.useRestApiRunner(
    UtvidetRettBehandlingApiKeys.VERGE_OPPRETT,
  );

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
      opneBehandlingForEndringer: params =>
        opneBehandlingForEndringer(params).then(behandlingResOpneForEndring =>
          setBehandling(behandlingResOpneForEndring),
        ),
      lagreRisikoklassifiseringAksjonspunkt: params => lagreRisikoklassifiseringAksjonspunkt(params),
    });

    requestUtvidetRettApi.setRequestPendingHandler(setRequestPendingMessage);
    requestUtvidetRettApi.setAddErrorMessageHandler(addErrorMessage);

    hentBehandling({ behandlingId }, false);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state } = restApiUtvidetRettHooks.useMultipleRestApi<FetchedData>(utvidetRettData, {
    keepData: true,
    updateTriggers: [behandling?.versjon],
    suspendRequest: !behandling,
  });

  const harIkkeHentetBehandlingsdata = state === RestApiState.LOADING || state === RestApiState.NOT_STARTED;
  if (!behandling || (harIkkeHentetBehandlingsdata && data === undefined)) {
    return <LoadingPanel />;
  }

  return (
    <>
      <ReduxFormStateCleaner
        behandlingId={behandling.id}
        behandlingVersjon={harIkkeHentetBehandlingsdata ? forrigeBehandling.versjon : behandling.versjon}
      />
      <UtvidetRettPaneler
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
        hentBehandling={hentBehandling}
        opneSokeside={opneSokeside}
        hasFetchError={behandlingState === RestApiState.ERROR}
        setBehandling={setBehandling}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysninger ? arbeidsgiverOpplysninger.arbeidsgivere : {}}
        featureToggles={featureToggles}
      />
    </>
  );
};

export default BehandlingUtvidetRettIndex;
