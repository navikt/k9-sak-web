import React, { useCallback, useEffect, useState } from 'react';

import { LoadingPanel, usePrevious } from '@fpsak-frontend/shared-components';
import { ReduxFormStateCleaner, Rettigheter, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import {
  ArbeidsgiverOpplysningerWrapper,
  Behandling,
  Dokument,
  Fagsak,
  FagsakPerson,
  FeatureToggles,
  KodeverkMedNavn,
} from '@k9-sak-web/types';

import useBehandlingEndret from '@k9-sak-web/sak-app/src/behandling/useBehandlingEndret';
import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import PleiepengerPaneler from './components/PleiepengerPaneler';
import {
  PleiepengerBehandlingApiKeys,
  requestPleiepengerApi,
  restApiPleiepengerHooks,
} from './data/pleiepengerBehandlingApi';
import FetchedData from './types/fetchedDataTsType';
import { OverstyringUttakRequest } from './types/OverstyringUttakRequest';

const pleiepengerData = [
  { key: PleiepengerBehandlingApiKeys.AKSJONSPUNKTER },
  { key: PleiepengerBehandlingApiKeys.VILKAR },
  { key: PleiepengerBehandlingApiKeys.PERSONOPPLYSNINGER },
  { key: PleiepengerBehandlingApiKeys.SOKNAD },
  { key: PleiepengerBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING },
  { key: PleiepengerBehandlingApiKeys.BEREGNINGSGRUNNLAG },
  { key: PleiepengerBehandlingApiKeys.BEREGNINGREFERANSER_TIL_VURDERING },
  { key: PleiepengerBehandlingApiKeys.SIMULERING_RESULTAT },
  { key: PleiepengerBehandlingApiKeys.UTTAK },
  { key: PleiepengerBehandlingApiKeys.OVERLAPPENDE_YTELSER },
  { key: PleiepengerBehandlingApiKeys.HENT_SAKSBEHANDLERE },
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

const BehandlingPleiepengerIndex = ({
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
  const forrigeSaksnummer = usePrevious(fagsak.saksnummer);

  const [nyOgForrigeBehandling, setBehandlinger] = useState<{ current?: Behandling; previous?: Behandling }>({
    current: undefined,
    previous: undefined,
  });
  const behandling = nyOgForrigeBehandling.current;
  const forrigeBehandling = nyOgForrigeBehandling.previous;

  const erBehandlingEndretFraUndefined = useBehandlingEndret(behandlingId, behandling?.versjon);
  const { data: alleDokumenter = [] } = restApiHooks.useRestApi<Dokument[]>(
    K9sakApiKeys.ALL_DOCUMENTS,
    { saksnummer: fagsak.saksnummer },
    {
      updateTriggers: [behandlingId, behandling?.versjon],
      suspendRequest: forrigeSaksnummer && erBehandlingEndretFraUndefined,
      keepData: true,
    },
  );

  const setBehandling = useCallback(nyBehandling => {
    requestPleiepengerApi.resetCache();
    requestPleiepengerApi.setLinks(nyBehandling.links);
    setBehandlinger(prevState => ({ current: nyBehandling, previous: prevState.current }));
  }, []);

  const {
    startRequest: hentBehandling,
    data: behandlingRes,
    state: behandlingState,
  } = restApiPleiepengerHooks.useRestApiRunner<Behandling>(PleiepengerBehandlingApiKeys.BEHANDLING_PP);
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiPleiepengerHooks.useRestApiRunner(
    PleiepengerBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: settBehandlingPaVent } = restApiPleiepengerHooks.useRestApiRunner(
    PleiepengerBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: taBehandlingAvVent } = restApiPleiepengerHooks.useRestApiRunner<Behandling>(
    PleiepengerBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: henleggBehandling } = restApiPleiepengerHooks.useRestApiRunner(
    PleiepengerBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: settPaVent } = restApiPleiepengerHooks.useRestApiRunner(
    PleiepengerBehandlingApiKeys.UPDATE_ON_HOLD,
  );
  const { startRequest: opprettVerge } = restApiPleiepengerHooks.useRestApiRunner(
    PleiepengerBehandlingApiKeys.VERGE_OPPRETT,
  );
  const { startRequest: fjernVerge } = restApiPleiepengerHooks.useRestApiRunner(
    PleiepengerBehandlingApiKeys.VERGE_FJERN,
  );
  const { startRequest: lagreRisikoklassifiseringAksjonspunkt } = restApiPleiepengerHooks.useRestApiRunner(
    PleiepengerBehandlingApiKeys.SAVE_AKSJONSPUNKT,
  );

  const { startRequest: lagreOverstyringUttakRequest } = restApiPleiepengerHooks.useRestApiRunner(
    PleiepengerBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
  );

  const lagreOverstyringUttak = async (values: OverstyringUttakRequest): Promise<void> => {
    lagreOverstyringUttakRequest({
      saksnummer: fagsak.saksnummer,
      behandlingId: behandling.id,
      behandlingVersjon: behandling.versjon,
      overstyrteAksjonspunktDtoer: [values],
    })
      .then(() => hentBehandling({ behandlingId }, true))
      .then(() => window.scroll(0, 0));
  };

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
      lagreRisikoklassifiseringAksjonspunkt: params => lagreRisikoklassifiseringAksjonspunkt(params),
    });

    requestPleiepengerApi.setRequestPendingHandler(setRequestPendingMessage);
    requestPleiepengerApi.setAddErrorMessageHandler(addErrorMessage);

    hentBehandling({ behandlingId }, false);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state } = restApiPleiepengerHooks.useMultipleRestApi<FetchedData>(pleiepengerData, {
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
      <PleiepengerPaneler
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
        dokumenter={alleDokumenter}
        lagreOverstyringUttak={lagreOverstyringUttak}
      />
    </>
  );
};

export default BehandlingPleiepengerIndex;
