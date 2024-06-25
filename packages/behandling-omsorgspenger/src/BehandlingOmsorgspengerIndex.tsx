import React, { useEffect, useState, useCallback } from 'react';

import { LoadingPanel, usePrevious } from '@fpsak-frontend/shared-components';
import { Rettigheter, ReduxFormStateCleaner, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import {
  Behandling,
  FeatureToggles,
  Fagsak,
  FagsakPerson,
  ArbeidsgiverOpplysningerWrapper,
  Dokument,
} from '@k9-sak-web/types';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { AlleKodeverk } from '@k9-sak-web/lib/types/index.js';
import useBehandlingEndret from '@k9-sak-web/sak-app/src/behandling/useBehandlingEndret';
import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
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
  { key: OmsorgspengerBehandlingApiKeys.BEREGNINGREFERANSER_TIL_VURDERING },
  { key: OmsorgspengerBehandlingApiKeys.SIMULERING_RESULTAT },
  { key: OmsorgspengerBehandlingApiKeys.FORBRUKTE_DAGER },
  { key: OmsorgspengerBehandlingApiKeys.OVERLAPPENDE_YTELSER },
  { key: OmsorgspengerBehandlingApiKeys.FOSTERBARN },
  { key: OmsorgspengerBehandlingApiKeys.BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR },
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
  kodeverk?: AlleKodeverk;
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

export default BehandlingOmsorgspengerIndex;
