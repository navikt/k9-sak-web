import React, { FunctionComponent } from 'react';

import { injectIntl, WrappedComponentProps } from 'react-intl';
import { SideMenuWrapper, faktaHooks, Rettigheter, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import { KodeverkMedNavn, Behandling, Fagsak } from '@k9-sak-web/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState } from '@k9-sak-web/rest-api-hooks';

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

const TilbakekrevingFakta: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
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
}) => {
  const { aksjonspunkter, perioderForeldelse, beregningsresultat, feilutbetalingFakta } = data;

  const {
    startRequest: lagreAksjonspunkter,
    data: apBehandlingRes,
  } = restApiTilbakekrevingHooks.useRestApiRunner<Behandling>(TilbakekrevingBehandlingApiKeys.SAVE_AKSJONSPUNKT);
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
    intl,
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
  const { data: faktaData, state } = restApiTilbakekrevingHooks.useMultipleRestApi<FetchedData>(endepunkter, {
    updateTriggers: [behandling.versjon, valgtPanel],
    suspendRequest: !valgtPanel,
    isCachingOn: true,
  });

  if (sidemenyPaneler.length > 0) {
    const isLoading = state === RestApiState.NOT_STARTED || state === RestApiState.LOADING;
    return (
      <SideMenuWrapper paneler={sidemenyPaneler} onClick={velgFaktaPanelCallback}>
        {valgtPanel && isLoading && <LoadingPanel />}
        {valgtPanel &&
          !isLoading &&
          valgtPanel.getPanelDef().getKomponent({
            ...faktaData,
            behandling,
            alleKodeverk,
            fpsakKodeverk,
            submitCallback: bekreftAksjonspunktCallback,
            ...valgtPanel.getKomponentData(rettigheter, dataTilUtledingAvTilbakekrevingPaneler, hasFetchError),
          })}
      </SideMenuWrapper>
    );
  }
  return null;
};

export default injectIntl(TilbakekrevingFakta);
