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
import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import useBehandlingEndret from '@k9-sak-web/sak-app/src/behandling/useBehandlingEndret';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';

import {
  restApiPleiepengerSluttfaseHooks,
  requestPleiepengerSluttfaseApi,
  PleiepengerSluttfaseBehandlingApiKeys,
} from './data/pleiepengerSluttfaseBehandlingApi';
import PleiepengerSluttfasePaneler from './components/PleiepengerSluttfasePaneler';
import FetchedData from './types/fetchedDataTsType';

const pleiepengerData = [
  { key: PleiepengerSluttfaseBehandlingApiKeys.AKSJONSPUNKTER },
  { key: PleiepengerSluttfaseBehandlingApiKeys.VILKAR },
  { key: PleiepengerSluttfaseBehandlingApiKeys.PERSONOPPLYSNINGER },
  { key: PleiepengerSluttfaseBehandlingApiKeys.SOKNAD },
  { key: PleiepengerSluttfaseBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING },
  { key: PleiepengerSluttfaseBehandlingApiKeys.BEREGNINGSGRUNNLAG },
  { key: PleiepengerSluttfaseBehandlingApiKeys.BEREGNINGREFERANSER_TIL_VURDERING },
  { key: PleiepengerSluttfaseBehandlingApiKeys.SIMULERING_RESULTAT },
  { key: PleiepengerSluttfaseBehandlingApiKeys.UTTAK },
  { key: PleiepengerSluttfaseBehandlingApiKeys.OVERLAPPENDE_YTELSER },
];

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

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

const BehandlingPleiepengerSluttfaseIndex = ({
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
    requestPleiepengerSluttfaseApi.resetCache();
    requestPleiepengerSluttfaseApi.setLinks(nyBehandling.links);
    setBehandlinger(prevState => ({ current: nyBehandling, previous: prevState.current }));
  }, []);

  const {
    startRequest: hentBehandling,
    data: behandlingRes,
    state: behandlingState,
  } = restApiPleiepengerSluttfaseHooks.useRestApiRunner<Behandling>(
    PleiepengerSluttfaseBehandlingApiKeys.BEHANDLING_PP,
  );
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiPleiepengerSluttfaseHooks.useRestApiRunner(
    PleiepengerSluttfaseBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: settBehandlingPaVent } = restApiPleiepengerSluttfaseHooks.useRestApiRunner(
    PleiepengerSluttfaseBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: taBehandlingAvVent } = restApiPleiepengerSluttfaseHooks.useRestApiRunner<Behandling>(
    PleiepengerSluttfaseBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: henleggBehandling } = restApiPleiepengerSluttfaseHooks.useRestApiRunner(
    PleiepengerSluttfaseBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: settPaVent } = restApiPleiepengerSluttfaseHooks.useRestApiRunner(
    PleiepengerSluttfaseBehandlingApiKeys.UPDATE_ON_HOLD,
  );
  const { startRequest: opprettVerge } = restApiPleiepengerSluttfaseHooks.useRestApiRunner(
    PleiepengerSluttfaseBehandlingApiKeys.VERGE_OPPRETT,
  );
  const { startRequest: fjernVerge } = restApiPleiepengerSluttfaseHooks.useRestApiRunner(
    PleiepengerSluttfaseBehandlingApiKeys.VERGE_FJERN,
  );
  const { startRequest: lagreRisikoklassifiseringAksjonspunkt } = restApiPleiepengerSluttfaseHooks.useRestApiRunner(
    PleiepengerSluttfaseBehandlingApiKeys.SAVE_AKSJONSPUNKT,
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

    requestPleiepengerSluttfaseApi.setRequestPendingHandler(setRequestPendingMessage);
    requestPleiepengerSluttfaseApi.setAddErrorMessageHandler(addErrorMessage);

    hentBehandling({ behandlingId }, false);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state } = restApiPleiepengerSluttfaseHooks.useMultipleRestApi<FetchedData>(pleiepengerData, {
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
      <RawIntlProvider value={intl}>
        <PleiepengerSluttfasePaneler
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
      </RawIntlProvider>
    </>
  );
};

export default BehandlingPleiepengerSluttfaseIndex;
