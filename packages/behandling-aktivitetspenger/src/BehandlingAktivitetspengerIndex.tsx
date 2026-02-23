import { useCallback, useEffect } from 'react';

import { Rettigheter, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { ArbeidsgiverOpplysningerWrapper, Behandling, Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AktivitetspengerPaneler } from './components/AktivitetspengerPaneler';
import {
  UngdomsytelseBehandlingApiKeys,
  requestUngdomsytelseApi,
  restApiUngdomsytelseHooks,
} from './data/ungdomsytelseBehandlingApi';
import { UngSakProsessBackendClient } from './data/UngSakProsessBackendClient';
import { FetchedData } from './types';

const ungdomsytelseData = [
  { key: UngdomsytelseBehandlingApiKeys.AKSJONSPUNKTER },
  { key: UngdomsytelseBehandlingApiKeys.VILKAR },
  { key: UngdomsytelseBehandlingApiKeys.PERSONOPPLYSNINGER },
  { key: UngdomsytelseBehandlingApiKeys.SOKNAD },
  { key: UngdomsytelseBehandlingApiKeys.SIMULERING_RESULTAT },
  { key: UngdomsytelseBehandlingApiKeys.KONTROLLER_INNTEKT },
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
  kodeverk?: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerWrapper;
  setRequestPendingMessage: (message: string) => void;
  behandlingVersjon: number;
  behandlingUuid: string;
}

const BehandlingAktivitetspengerIndex = ({
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
  behandlingVersjon,
  behandlingUuid,
}: OwnProps) => {
  const ungSakProsessApi = new UngSakProsessBackendClient();

  const setBehandling = useCallback(nyBehandling => {
    requestUngdomsytelseApi.resetCache();
    requestUngdomsytelseApi.setLinks(nyBehandling.links);
  }, []);

  const { data: behandling } = useSuspenseQuery({
    queryKey: ['behandling', behandlingVersjon, behandlingUuid],
    queryFn: () => ungSakProsessApi.getBehandling(behandlingUuid),
  });
  const { data: aksjonspunkter } = useSuspenseQuery({
    queryKey: ['aksjonspunkter', behandlingUuid],
    queryFn: () => ungSakProsessApi.getAksjonspunkter(behandlingUuid),
  });

  const { data: vilkår } = useSuspenseQuery({
    queryKey: ['vilkår', behandlingUuid],
    queryFn: () => ungSakProsessApi.getVilkår(behandlingUuid),
  });

  const { data: personopplysninger } = useSuspenseQuery({
    queryKey: ['personopplysninger', behandlingUuid],
    queryFn: () => ungSakProsessApi.getPersonopplysninger(behandlingUuid),
  });

  const {
    startRequest: hentBehandling,
    data: behandlingRes,
    state: behandlingState,
  } = restApiUngdomsytelseHooks.useRestApiRunner<Behandling>(UngdomsytelseBehandlingApiKeys.BEHANDLING_UU);
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: settBehandlingPaVent } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: taBehandlingAvVent } = restApiUngdomsytelseHooks.useRestApiRunner<Behandling>(
    UngdomsytelseBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: henleggBehandling } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: settPaVent } = restApiUngdomsytelseHooks.useRestApiRunner(
    UngdomsytelseBehandlingApiKeys.UPDATE_ON_HOLD,
  );

  useEffect(() => {
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: params => nyBehandlendeEnhet(params).then(() => hentBehandling({ behandlingId }, true)),
      settBehandlingPaVent: params => settBehandlingPaVent(params).then(() => hentBehandling({ behandlingId }, true)),
      taBehandlingAvVent: params =>
        taBehandlingAvVent(params).then(behandlingResTaAvVent => setBehandling(behandlingResTaAvVent)),
      henleggBehandling: params => henleggBehandling(params),
    });

    requestUngdomsytelseApi.setRequestPendingHandler(setRequestPendingMessage);
    requestUngdomsytelseApi.setAddErrorMessageHandler(addErrorMessage);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state } = restApiUngdomsytelseHooks.useMultipleRestApi<FetchedData>(ungdomsytelseData, {
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
      {/* <ReduxFormStateCleaner
        behandlingId={behandling.id}
        behandlingVersjon={harIkkeHentetBehandlingsdata ? forrigeBehandling.versjon : behandling.versjon}
      /> */}
      <AktivitetspengerPaneler
        behandling={behandling}
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
        aksjonspunkter={aksjonspunkter}
        vilkår={vilkår}
        personopplysninger={personopplysninger}
      />
    </>
  );
};

export default BehandlingAktivitetspengerIndex;
