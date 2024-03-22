import React, { useEffect, useState, useCallback } from 'react';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { Rettigheter, ReduxFormStateCleaner, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import { Fagsak, Behandling, KodeverkMedNavn, FagsakPerson } from '@k9-sak-web/types';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import AnkePaneler from './components/AnkePaneler';
import FetchedData from './types/fetchedDataTsType';
import { restApiAnkeHooks, requestAnkeApi, AnkeBehandlingApiKeys } from './data/ankeBehandlingApi';

const ankeData = [
  { key: AnkeBehandlingApiKeys.AKSJONSPUNKTER },
  { key: AnkeBehandlingApiKeys.VILKAR },
  { key: AnkeBehandlingApiKeys.ANKE_VURDERING },
];

interface OwnProps {
  behandlingId: number;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  rettigheter: Rettigheter;
  kodeverk: { [key: string]: KodeverkMedNavn[] };
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
    type: string;
    avsluttet?: string;
  }[];
  setRequestPendingMessage: (message: string) => void;
}

const BehandlingAnkeIndex = ({
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
  setRequestPendingMessage,
}: OwnProps) => {
  const [nyOgForrigeBehandling, setBehandlinger] = useState<{ current?: Behandling; previous?: Behandling }>({
    current: undefined,
    previous: undefined,
  });
  const behandling = nyOgForrigeBehandling.current;
  const forrigeBehandling = nyOgForrigeBehandling.previous;

  const setBehandling = useCallback(nyBehandling => {
    requestAnkeApi.resetCache();
    requestAnkeApi.setLinks(nyBehandling.links);
    setBehandlinger(prevState => ({ current: nyBehandling, previous: prevState.current }));
  }, []);

  const { startRequest: hentBehandling, data: behandlingRes } = restApiAnkeHooks.useRestApiRunner<Behandling>(
    AnkeBehandlingApiKeys.BEHANDLING_ANKE,
  );
  useSetBehandlingVedEndring(behandlingRes, setBehandling);

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: nyBehandlendeEnhet } = restApiAnkeHooks.useRestApiRunner(
    AnkeBehandlingApiKeys.BEHANDLING_NY_BEHANDLENDE_ENHET,
  );
  const { startRequest: settBehandlingPaVent } = restApiAnkeHooks.useRestApiRunner(
    AnkeBehandlingApiKeys.BEHANDLING_ON_HOLD,
  );
  const { startRequest: taBehandlingAvVent } = restApiAnkeHooks.useRestApiRunner<Behandling>(
    AnkeBehandlingApiKeys.RESUME_BEHANDLING,
  );
  const { startRequest: henleggBehandling } = restApiAnkeHooks.useRestApiRunner(
    AnkeBehandlingApiKeys.HENLEGG_BEHANDLING,
  );
  const { startRequest: settPaVent } = restApiAnkeHooks.useRestApiRunner(AnkeBehandlingApiKeys.UPDATE_ON_HOLD);

  useEffect(() => {
    behandlingEventHandler.setHandler({
      endreBehandlendeEnhet: params => nyBehandlendeEnhet(params).then(() => hentBehandling({ behandlingId }, true)),
      settBehandlingPaVent: params => settBehandlingPaVent(params).then(() => hentBehandling({ behandlingId }, true)),
      taBehandlingAvVent: params =>
        taBehandlingAvVent(params).then(behandlingResTaAvVent => setBehandling(behandlingResTaAvVent)),
      henleggBehandling: params => henleggBehandling(params),
    });

    requestAnkeApi.setRequestPendingHandler(setRequestPendingMessage);
    requestAnkeApi.setAddErrorMessageHandler(addErrorMessage);

    hentBehandling({ behandlingId }, false);

    return () => {
      behandlingEventHandler.clear();
    };
  }, []);

  const { data, state } = restApiAnkeHooks.useMultipleRestApi<FetchedData>(ankeData, {
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
      <AnkePaneler
        behandling={hasNotFinished ? forrigeBehandling : behandling}
        fetchedData={data}
        fagsak={fagsak}
        fagsakPerson={fagsakPerson}
        rettigheter={rettigheter}
        alleKodeverk={kodeverk}
        valgtProsessSteg={valgtProsessSteg}
        oppdaterProsessStegOgFaktaPanelIUrl={oppdaterProsessStegOgFaktaPanelIUrl}
        oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
        settPaVent={settPaVent}
        opneSokeside={opneSokeside}
        alleBehandlinger={alleBehandlinger}
        setBehandling={setBehandling}
      />
    </>
  );
};

export default BehandlingAnkeIndex;
