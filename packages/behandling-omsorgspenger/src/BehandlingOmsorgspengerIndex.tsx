import React, { useEffect, useState, useCallback } from 'react';

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

import {
  restApiOmsorgHooks,
  requestOmsorgApi,
  OmsorgspengerBehandlingApiKeys,
} from './data/omsorgspengerBehandlingApi';
import OmsorgspengerPaneler from './components/OmsorgspengerPaneler';
import FetchedData from './types/fetchedDataTsType';

const omsorgspengerData = [
  { key: OmsorgspengerBehandlingApiKeys.AKSJONSPUNKTER },
  { key: OmsorgspengerBehandlingApiKeys.VILKAR },
  { key: OmsorgspengerBehandlingApiKeys.PERSONOPPLYSNINGER },
  { key: OmsorgspengerBehandlingApiKeys.SOKNAD },
  { key: OmsorgspengerBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING },
  { key: OmsorgspengerBehandlingApiKeys.BEREGNINGSGRUNNLAG },
  { key: OmsorgspengerBehandlingApiKeys.SIMULERING_RESULTAT },
  { key: OmsorgspengerBehandlingApiKeys.FORBRUKTE_DAGER },
  { key: OmsorgspengerBehandlingApiKeys.OVERLAPPENDE_YTELSER },
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

const BehandlingOmsorgspengerIndex = ({
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
    requestOmsorgApi.resetCache();
    requestOmsorgApi.setLinks(nyBehandling.links);
    setBehandlinger(prevState => ({ current: nyBehandling, previous: prevState.current }));
  }, []);

  const {
    startRequest: hentBehandling,
    data: behandlingRes,
    state: behandlingState,
  } = restApiOmsorgHooks.useRestApiRunner<Behandling>(OmsorgspengerBehandlingApiKeys.BEHANDLING_OMSORG);
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiOmsorgHooks.useRestApiRunner(
    OmsorgspengerBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: settBehandlingPaVent } = restApiOmsorgHooks.useRestApiRunner(
    OmsorgspengerBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: taBehandlingAvVent } = restApiOmsorgHooks.useRestApiRunner<Behandling>(
    OmsorgspengerBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: henleggBehandling } = restApiOmsorgHooks.useRestApiRunner(
    OmsorgspengerBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: settPaVent } = restApiOmsorgHooks.useRestApiRunner(
    OmsorgspengerBehandlingApiKeys.UPDATE_ON_HOLD,
  );
  const { startRequest: opneBehandlingForEndringer } = restApiOmsorgHooks.useRestApiRunner(
    OmsorgspengerBehandlingApiKeys.OPEN_BEHANDLING_FOR_CHANGES,
  );
  const { startRequest: opprettVerge } = restApiOmsorgHooks.useRestApiRunner(
    OmsorgspengerBehandlingApiKeys.VERGE_OPPRETT,
  );
  const { startRequest: fjernVerge } = restApiOmsorgHooks.useRestApiRunner(OmsorgspengerBehandlingApiKeys.VERGE_FJERN);
  const { startRequest: lagreRisikoklassifiseringAksjonspunkt } = restApiOmsorgHooks.useRestApiRunner(
    OmsorgspengerBehandlingApiKeys.SAVE_AKSJONSPUNKT,
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
      opprettVerge: params =>
        opprettVerge(params).then(behandlingResOpprettVerge => setBehandling(behandlingResOpprettVerge)),
      fjernVerge: params => fjernVerge(params).then(behandlingResFjernVerge => setBehandling(behandlingResFjernVerge)),
      lagreRisikoklassifiseringAksjonspunkt: params => lagreRisikoklassifiseringAksjonspunkt(params),
    });

    requestOmsorgApi.setRequestPendingHandler(setRequestPendingMessage);
    requestOmsorgApi.setAddErrorMessageHandler(addErrorMessage);

    hentBehandling({ behandlingId }, false);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state } = restApiOmsorgHooks.useMultipleRestApi<FetchedData>(omsorgspengerData, {
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
      <OmsorgspengerPaneler
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

export default BehandlingOmsorgspengerIndex;
