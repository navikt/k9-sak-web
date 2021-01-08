import React, { FunctionComponent, useEffect, useState, useCallback } from 'react';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import {
  Fagsak,
  Behandling,
  FagsakPerson,
  ArbeidsgiverOpplysningerWrapper,
  FeatureToggles,
  KodeverkMedNavn,
} from '@k9-sak-web/types';
import { Rettigheter, ReduxFormStateCleaner, useSetBehandlingVedEndring } from '@fpsak-frontend/behandling-felles';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import { restApiFrisinnHooks, requestFrisinnApi, FrisinnBehandlingApiKeys } from './data/frisinnBehandlingApi';
import FrisinnPaneler from './components/FrisinnPaneler';
import FetchedData from './types/fetchedDataTsType';

const frisinnData = [
  { key: FrisinnBehandlingApiKeys.AKSJONSPUNKTER },
  { key: FrisinnBehandlingApiKeys.VILKAR },
  { key: FrisinnBehandlingApiKeys.PERSONOPPLYSNINGER },
  { key: FrisinnBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALT },
  { key: FrisinnBehandlingApiKeys.BEREGNINGSGRUNNLAG },
  { key: FrisinnBehandlingApiKeys.SIMULERING_RESULTAT },
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
  setRequestPendingMessage: (message: string) => void;
  kodeverk?: { [key: string]: KodeverkMedNavn[] };
  featureToggles: FeatureToggles;
}

const BehandlingFrisinnIndex: FunctionComponent<OwnProps> = ({
  behandlingEventHandler,
  behandlingId,
  oppdaterBehandlingVersjon,
  fagsak,
  fagsakPerson,
  rettigheter,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtProsessSteg,
  opneSokeside,
  valgtFaktaSteg,
  setRequestPendingMessage,
  kodeverk,
  featureToggles,
}) => {
  const [nyOgForrigeBehandling, setBehandlinger] = useState<{ current?: Behandling; previous?: Behandling }>({
    current: undefined,
    previous: undefined,
  });
  const behandling = nyOgForrigeBehandling.current;
  const forrigeBehandling = nyOgForrigeBehandling.previous;

  const setBehandling = useCallback(nyBehandling => {
    requestFrisinnApi.resetCache();
    requestFrisinnApi.setLinks(nyBehandling.links);
    setBehandlinger(prevState => ({ current: nyBehandling, previous: prevState.current }));
  }, []);

  const {
    startRequest: hentBehandling,
    data: behandlingRes,
    state: behandlingState,
  } = restApiFrisinnHooks.useRestApiRunner<Behandling>(FrisinnBehandlingApiKeys.BEHANDLING_FRISINN);
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiFrisinnHooks.useRestApiRunner(
    FrisinnBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: settBehandlingPaVent } = restApiFrisinnHooks.useRestApiRunner(
    FrisinnBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: taBehandlingAvVent } = restApiFrisinnHooks.useRestApiRunner<Behandling>(
    FrisinnBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: henleggBehandling } = restApiFrisinnHooks.useRestApiRunner(
    FrisinnBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: settPaVent } = restApiFrisinnHooks.useRestApiRunner(FrisinnBehandlingApiKeys.UPDATE_ON_HOLD);
  const { startRequest: opneBehandlingForEndringer } = restApiFrisinnHooks.useRestApiRunner(
    FrisinnBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES,
  );
  const { startRequest: lagreRisikoklassifiseringAksjonspunkt } = restApiFrisinnHooks.useRestApiRunner(
    FrisinnBehandlingApiKeys.SAVE_AKSJONSPUNKT,
  );

  useEffect(() => {
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: params => nyBehandlendeEnhet(params).then(() => hentBehandling({ behandlingId }, true)),
      settBehandlingPaVent: params => settBehandlingPaVent(params).then(() => hentBehandling({ behandlingId }, true)),
      taBehandlingAvVent: params =>
        taBehandlingAvVent(params).then(behandlingResTaAvVent => setBehandling(behandlingResTaAvVent)),
      henleggBehandling: params => henleggBehandling(params),
      opneBehandlingForEndringer: params =>
        opneBehandlingForEndringer(params).then(behandlingResOpneForEndring =>
          setBehandling(behandlingResOpneForEndring),
        ),
      lagreRisikoklassifiseringAksjonspunkt: params => lagreRisikoklassifiseringAksjonspunkt(params),
    });

    requestFrisinnApi.setRequestPendingHandler(setRequestPendingMessage);
    requestFrisinnApi.setAddErrorMessageHandler(addErrorMessage);

    hentBehandling({ behandlingId }, false);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state } = restApiFrisinnHooks.useMultipleRestApi<FetchedData>(frisinnData, {
    keepData: true,
    updateTriggers: [behandling?.versjon],
    suspendRequest: !behandling,
  });

  const {
    data: arbeidsgiverOpplysninger,
    state: arbeidOppState,
  } = restApiFrisinnHooks.useRestApi<ArbeidsgiverOpplysningerWrapper>(
    FrisinnBehandlingApiKeys.ARBEIDSGIVERE,
    {},
    {
      updateTriggers: [!behandling],
      suspendRequest: !behandling,
    },
  );

  const harIkkeHentetBehandlingsdata = state === RestApiState.LOADING || state === RestApiState.NOT_STARTED;
  const harIkkeHentetArbeidsgiverOpplysninger =
    arbeidOppState === RestApiState.LOADING || arbeidOppState === RestApiState.NOT_STARTED;
  if (!behandling || harIkkeHentetArbeidsgiverOpplysninger || (harIkkeHentetBehandlingsdata && data === undefined)) {
    return <LoadingPanel />;
  }

  return (
    <>
      <ReduxFormStateCleaner
        behandlingId={behandling.id}
        behandlingVersjon={harIkkeHentetBehandlingsdata ? forrigeBehandling.versjon : behandling.versjon}
      />
      <FrisinnPaneler
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
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysninger.arbeidsgivere}
        featureToggles={featureToggles}
      />
    </>
  );
};

export default BehandlingFrisinnIndex;
