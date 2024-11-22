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
import OpplaeringspengerPaneler from './components/OpplaeringspengerPaneler';
import {
  OpplaeringspengerBehandlingApiKeys,
  requestOpplaeringspengerApi,
  restApiOpplaeringspengerHooks,
} from './data/opplaeringspengerBehandlingApi';
import FetchedData from './types/fetchedDataTsType';

const opplaeringspengerData = [
  { key: OpplaeringspengerBehandlingApiKeys.AKSJONSPUNKTER },
  { key: OpplaeringspengerBehandlingApiKeys.VILKAR },
  { key: OpplaeringspengerBehandlingApiKeys.PERSONOPPLYSNINGER },
  { key: OpplaeringspengerBehandlingApiKeys.SOKNAD },
  { key: OpplaeringspengerBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING },
  { key: OpplaeringspengerBehandlingApiKeys.BEREGNINGSGRUNNLAG },
  { key: OpplaeringspengerBehandlingApiKeys.BEREGNINGREFERANSER_TIL_VURDERING },
  { key: OpplaeringspengerBehandlingApiKeys.SIMULERING_RESULTAT },
  { key: OpplaeringspengerBehandlingApiKeys.UTTAK },
  { key: OpplaeringspengerBehandlingApiKeys.OVERLAPPENDE_YTELSER },
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

const BehandlingOpplaeringspengerIndex = ({
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
    requestOpplaeringspengerApi.resetCache();
    requestOpplaeringspengerApi.setLinks(nyBehandling.links);
    setBehandlinger(prevState => ({ current: nyBehandling, previous: prevState.current }));
  }, []);

  const {
    startRequest: hentBehandling,
    data: behandlingRes,
    state: behandlingState,
  } = restApiOpplaeringspengerHooks.useRestApiRunner<Behandling>(OpplaeringspengerBehandlingApiKeys.BEHANDLING_PP);
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiOpplaeringspengerHooks.useRestApiRunner(
    OpplaeringspengerBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: settBehandlingPaVent } = restApiOpplaeringspengerHooks.useRestApiRunner(
    OpplaeringspengerBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: taBehandlingAvVent } = restApiOpplaeringspengerHooks.useRestApiRunner<Behandling>(
    OpplaeringspengerBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: henleggBehandling } = restApiOpplaeringspengerHooks.useRestApiRunner(
    OpplaeringspengerBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: settPaVent } = restApiOpplaeringspengerHooks.useRestApiRunner(
    OpplaeringspengerBehandlingApiKeys.UPDATE_ON_HOLD,
  );
  const { startRequest: opprettVerge } = restApiOpplaeringspengerHooks.useRestApiRunner(
    OpplaeringspengerBehandlingApiKeys.VERGE_OPPRETT,
  );
  const { startRequest: fjernVerge } = restApiOpplaeringspengerHooks.useRestApiRunner(
    OpplaeringspengerBehandlingApiKeys.VERGE_FJERN,
  );
  const { startRequest: lagreRisikoklassifiseringAksjonspunkt } = restApiOpplaeringspengerHooks.useRestApiRunner(
    OpplaeringspengerBehandlingApiKeys.SAVE_AKSJONSPUNKT,
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
      lagreRisikoklassifiseringAksjonspunkt: params => lagreRisikoklassifiseringAksjonspunkt(params),
    });

    requestOpplaeringspengerApi.setRequestPendingHandler(setRequestPendingMessage);
    requestOpplaeringspengerApi.setAddErrorMessageHandler(addErrorMessage);

    hentBehandling({ behandlingId }, false);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state } = restApiOpplaeringspengerHooks.useMultipleRestApi<FetchedData>(opplaeringspengerData, {
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
      <OpplaeringspengerPaneler
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
      />
    </>
  );
};

export default BehandlingOpplaeringspengerIndex;
