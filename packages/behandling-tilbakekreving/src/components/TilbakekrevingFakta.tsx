import { faktaHooks, Rettigheter, SideMenuWrapper, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import ErrorBoundary from '@k9-sak-web/sak-app/src/app/ErrorBoundary';
import { LoadingPanel } from '@k9-sak-web/shared-components';
import { Behandling, Fagsak, KodeverkMedNavn } from '@k9-sak-web/types';
import React from 'react';

import { restApiTilbakekrevingHooks, TilbakekrevingBehandlingApiKeys } from '../data/tilbakekrevingBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaTilbakekrevingPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [];

interface OwnProps {
  data: FetchedData;
  fagsak: Fagsak;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  fpsakKodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  hasFetchError: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  setBehandling: (behandling: Behandling) => void;
}

const TilbakekrevingFakta = ({
  data,
  fagsak,
  behandling,
  rettigheter,
  alleKodeverk,
  fpsakKodeverk,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  hasFetchError,
  setBehandling,
}: OwnProps) => {
  const { aksjonspunkter, perioderForeldelse, beregningsresultat, feilutbetalingFakta } = data;
  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } =
    restApiTilbakekrevingHooks.useRestApiRunner<Behandling>(TilbakekrevingBehandlingApiKeys.SAVE_AKSJONSPUNKT);
  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const dataTilUtledingAvTilbakekrevingPaneler = {
    fagsak,
    behandling,
    perioderForeldelse,
    beregningsresultat,
    feilutbetalingFakta,
    fpsakKodeverk,
  };

  const [faktaPaneler, valgtPanel, sidemenyPaneler] = faktaHooks.useFaktaPaneler(
    faktaPanelDefinisjoner,
    dataTilUtledingAvTilbakekrevingPaneler,
    behandling,
    rettigheter,
    aksjonspunkter,
    valgtFaktaSteg,
  );

  const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = faktaHooks.useCallbacks(
    faktaPaneler,
    fagsak,
    behandling,
    oppdaterProsessStegOgFaktaPanelIUrl,
    'default',
    overstyringApCodes,
    lagreAksjonspunkter,
  );

  const endepunkter = valgtPanel
    ? valgtPanel
        .getPanelDef()
        .getEndepunkter()
        .map(e => ({ key: e }))
    : [];
  const endepunkterUtenCaching = valgtPanel
    ? valgtPanel
        .getPanelDef()
        .getEndepunkterUtenCaching()
        .map(e => ({ key: e }))
    : [];
  const { data: faktaData, state } = restApiTilbakekrevingHooks.useMultipleRestApi<FetchedData>(endepunkter, {
    updateTriggers: [behandling.versjon, valgtPanel],
    suspendRequest: !valgtPanel,
    isCachingOn: true,
  });

  const { data: faktaDataUtenCaching, state: stateForEndepunkterUtenCaching } =
    restApiTilbakekrevingHooks.useMultipleRestApi<FetchedData>(endepunkterUtenCaching, {
      updateTriggers: [behandling.versjon, valgtPanel],
      suspendRequest: !valgtPanel,
    });

  if (sidemenyPaneler.length > 0) {
    const isLoading =
      state === RestApiState.NOT_STARTED ||
      state === RestApiState.LOADING ||
      stateForEndepunkterUtenCaching === RestApiState.NOT_STARTED ||
      stateForEndepunkterUtenCaching === RestApiState.LOADING;
    return (
      <SideMenuWrapper paneler={sidemenyPaneler} onClick={velgFaktaPanelCallback}>
        {valgtPanel && isLoading && <LoadingPanel />}
        {valgtPanel && !isLoading && (
          <ErrorBoundary errorMessageCallback={addErrorMessage}>
            {valgtPanel.getPanelDef().getKomponent({
              ...faktaData,
              ...faktaDataUtenCaching,
              behandling,
              alleKodeverk,
              fpsakKodeverk,
              submitCallback: bekreftAksjonspunktCallback,
              ...valgtPanel.getKomponentData(rettigheter, dataTilUtledingAvTilbakekrevingPaneler, hasFetchError),
            })}
          </ErrorBoundary>
        )}
      </SideMenuWrapper>
    );
  }
  return null;
};

export default TilbakekrevingFakta;
