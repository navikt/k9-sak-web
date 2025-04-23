import { useCallback, useEffect, useState } from 'react';

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
import { BehandlingProvider } from '../../v2/gui/src/BehandlingContext';
import OmsorgspengerPaneler from './components/OmsorgspengerPaneler';
import {
  OmsorgspengerBehandlingApiKeys,
  requestOmsorgApi,
  restApiOmsorgHooks,
} from './data/omsorgspengerBehandlingApi';
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

    requestOmsorgApi.setRequestPendingHandler(setRequestPendingMessage);
    requestOmsorgApi.setAddErrorMessageHandler(addErrorMessage);

    void hentBehandling({ behandlingId }, false);

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
        behandlingVersjon={harIkkeHentetBehandlingsdata ? forrigeBehandling?.versjon : behandling.versjon}
      />

      <BehandlingProvider refetchBehandling={() => hentBehandling({ behandlingId }, true)}>
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
      </BehandlingProvider>
    </>
  );
};

export default BehandlingOmsorgspengerIndex;
