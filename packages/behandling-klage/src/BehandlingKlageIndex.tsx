import React, { useEffect, useState, useCallback } from 'react';

import { Rettigheter, ReduxFormStateCleaner, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import {
  Behandling,
  Fagsak,
  FagsakPerson,
  Kodeverk,
  KodeverkMedNavn,
  ArbeidsgiverOpplysningerWrapper,
  FeatureToggles,
} from '@k9-sak-web/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import FetchedData from './types/fetchedDataTsType';
import KlagePaneler from './components/KlagePaneler';
import { restApiKlageHooks, requestKlageApi, KlageBehandlingApiKeys } from './data/klageBehandlingApi';

const klageData = [
  { key: KlageBehandlingApiKeys.AKSJONSPUNKTER },
  { key: KlageBehandlingApiKeys.KLAGE_VURDERING },
  { key: KlageBehandlingApiKeys.PARTER_MED_KLAGERETT },
  { key: KlageBehandlingApiKeys.VALGT_PART_MED_KLAGERETT },
];

interface OwnProps {
  behandlingId: number;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  kodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  oppdaterProsessStegOgFaktaPanelIUrl: (punktnavn?: string, faktanavn?: string) => void;
  valgtProsessSteg?: string;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  behandlingEventHandler: {
    setHandler: (events: { [key: string]: (params: any) => Promise<any> }) => void;
    clear: () => void;
  };
  opneSokeside: () => void;
  alleBehandlinger: {
    id: number;
    uuid: string;
    type: Kodeverk;
    status: Kodeverk;
    opprettet: string;
    avsluttet?: string;
  }[];
  arbeidsgiverOpplysninger?: ArbeidsgiverOpplysningerWrapper;
  setRequestPendingMessage: (message: string) => void;
  featureToggles: FeatureToggles;
}

const BehandlingKlageIndex = ({
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
  alleBehandlinger,
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
    requestKlageApi.resetCache();
    requestKlageApi.setLinks(nyBehandling.links);
    setBehandlinger(prevState => ({ current: nyBehandling, previous: prevState.current }));
  }, []);

  const { startRequest: hentBehandling, data: behandlingRes } = restApiKlageHooks.useRestApiRunner<Behandling>(
    KlageBehandlingApiKeys.BEHANDLING_KLAGE,
  );
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiKlageHooks.useRestApiRunner(
    KlageBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: settBehandlingPaVent } = restApiKlageHooks.useRestApiRunner(
    KlageBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: taBehandlingAvVent } = restApiKlageHooks.useRestApiRunner<Behandling>(
    KlageBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: henleggBehandling } = restApiKlageHooks.useRestApiRunner(
    KlageBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: settPaVent } = restApiKlageHooks.useRestApiRunner(KlageBehandlingApiKeys.UPDATE_ON_HOLD);

  useEffect(() => {
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: params => nyBehandlendeEnhet(params).then(() => hentBehandling({ behandlingId }, true)),
      settBehandlingPaVent: params => settBehandlingPaVent(params).then(() => hentBehandling({ behandlingId }, true)),
      taBehandlingAvVent: params =>
        taBehandlingAvVent(params).then(behandlingResTaAvVent => setBehandling(behandlingResTaAvVent)),
      henleggBehandling: params => henleggBehandling(params),
    });

    requestKlageApi.setRequestPendingHandler(setRequestPendingMessage);
    requestKlageApi.setAddErrorMessageHandler(addErrorMessage);

    hentBehandling({ behandlingId }, false);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state } = restApiKlageHooks.useMultipleRestApi<FetchedData>(klageData, {
    keepData: true,
    updateTriggers: [behandling?.versjon],
    suspendRequest: !behandling,
  });

  const hasNotFinished = state === RestApiState.LOADING || state === RestApiState.NOT_STARTED;
  if (!behandling || (hasNotFinished && data === undefined)) {
    return <LoadingPanel />;
  }

  return (
    <>
      <ReduxFormStateCleaner
        behandlingId={behandling.id}
        behandlingVersjon={hasNotFinished ? forrigeBehandling.versjon : behandling.versjon}
      />
      <KlagePaneler
        behandling={hasNotFinished ? forrigeBehandling : behandling}
        fetchedData={data}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        kodeverk={kodeverk}
        rettigheter={rettigheter}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        settPaVent={settPaVent}
        opneSokeside={opneSokeside}
        alleBehandlinger={alleBehandlinger}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysninger ? arbeidsgiverOpplysninger.arbeidsgivere : {}}
        setBehandling={setBehandling}
        featureToggles={featureToggles}
      />
    </>
  );
};

export default BehandlingKlageIndex;
