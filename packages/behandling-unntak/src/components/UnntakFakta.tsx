import { Rettigheter, SideMenuWrapper, faktaHooks, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import ac from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import ErrorBoundary from '@k9-sak-web/sak-app/src/app/ErrorBoundary';
import { LoadingPanel } from '@k9-sak-web/shared-components';
import { ArbeidsgiverOpplysningerPerId, Behandling, Fagsak, FagsakPerson, KodeverkMedNavn } from '@k9-sak-web/types';
import React from 'react';

import { UnntakBehandlingApiKeys, restApiUnntakHooks } from '../data/unntakBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [ac.OVERSTYRING_AV_BEREGNINGSAKTIVITETER];

interface OwnProps {
  data: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  rettigheter: Rettigheter;
  hasFetchError: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  valgtProsessSteg?: string;
  setApentFaktaPanel: (faktaPanelInfo: { urlCode: string; textCode: string }) => void;
  setBehandling: (behandling: Behandling) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

const UnntakFakta = ({
  data,
  behandling,
  fagsak,
  fagsakPerson,
  rettigheter,
  alleKodeverk,
  oppdaterProsessStegOgFaktaPanelIUrl,
  valgtFaktaSteg,
  valgtProsessSteg,
  hasFetchError,
  setApentFaktaPanel,
  setBehandling,
  arbeidsgiverOpplysningerPerId,
}: OwnProps) => {
  const { aksjonspunkter, ...rest } = data;

  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } = restApiUnntakHooks.useRestApiRunner<Behandling>(
    UnntakBehandlingApiKeys.SAVE_AKSJONSPUNKT,
  );
  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const { startRequest: lagreOverstyrteAksjonspunkter, data: apOverstyrtBehandlingRes } =
    restApiUnntakHooks.useRestApiRunner<Behandling>(UnntakBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT);
  useSetBehandlingVedEndring(apOverstyrtBehandlingRes, setBehandling);

  const dataTilUtledingAvFpPaneler = {
    fagsak,
    fagsakPerson,
    behandling,
    hasFetchError,
    arbeidsgiverOpplysningerPerId,
    ...rest,
  };

  const [faktaPaneler, valgtPanel, sidemenyPaneler] = faktaHooks.useFaktaPaneler(
    faktaPanelDefinisjoner,
    dataTilUtledingAvFpPaneler,
    behandling,
    rettigheter,
    aksjonspunkter,
    valgtFaktaSteg,
  );

  faktaHooks.useFaktaAksjonspunktNotifikator(faktaPaneler, setApentFaktaPanel, behandling.versjon);

  const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = faktaHooks.useCallbacks(
    faktaPaneler,
    fagsak,
    behandling,
    oppdaterProsessStegOgFaktaPanelIUrl,
    valgtProsessSteg,
    overstyringApCodes,
    lagreAksjonspunkter,
    lagreOverstyrteAksjonspunkter,
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
  // TODO type FetchedData er feil her
  const { data: faktaData, state } = restApiUnntakHooks.useMultipleRestApi<FetchedData>(endepunkter, {
    updateTriggers: [behandling.versjon, valgtPanel],
    suspendRequest: !valgtPanel,
    isCachingOn: true,
  });

  const { data: faktaDataUtenCaching, state: stateForEndepunkterUtenCaching } =
    restApiUnntakHooks.useMultipleRestApi<FetchedData>(endepunkterUtenCaching, {
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
              submitCallback: bekreftAksjonspunktCallback,
              ...valgtPanel.getKomponentData(rettigheter, dataTilUtledingAvFpPaneler, hasFetchError),
            })}
          </ErrorBoundary>
        )}
      </SideMenuWrapper>
    );
  }
  return null;
};

export default UnntakFakta;
