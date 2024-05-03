import React, { useEffect, useState } from 'react';

import { Rettigheter, SideMenuWrapper, faktaHooks, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import ac from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import ErrorBoundary from '@k9-sak-web/sak-app/src/app/ErrorBoundary';
import { LoadingPanel } from '@k9-sak-web/shared-components';
import {
  ArbeidsgiverOpplysningerPerId,
  Behandling,
  Fagsak,
  FagsakPerson,
  FeatureToggles,
  KodeverkMedNavn,
} from '@k9-sak-web/types';

import { FrisinnBehandlingApiKeys, restApiFrisinnHooks } from '../data/frisinnBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaFrisinnPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';

const overstyringApCodes = [ac.OVERSTYRING_AV_BEREGNINGSAKTIVITETER, ac.OVERSTYRING_AV_BEREGNINGSGRUNNLAG];

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
  featureToggles: FeatureToggles;
}

const FrisinnFakta = ({
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
  featureToggles,
}: OwnProps) => {
  const { aksjonspunkter, ...rest } = data;
  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } = restApiFrisinnHooks.useRestApiRunner<Behandling>(
    FrisinnBehandlingApiKeys.SAVE_AKSJONSPUNKT,
  );
  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const { startRequest: lagreOverstyrteAksjonspunkter, data: apOverstyrtBehandlingRes } =
    restApiFrisinnHooks.useRestApiRunner<Behandling>(FrisinnBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT);
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
    featureToggles,
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
  // TODO FetchedData er feil type
  const { data: faktaData, state } = restApiFrisinnHooks.useMultipleRestApi<FetchedData>(endepunkter, {
    updateTriggers: [behandling.versjon, valgtPanel],
    suspendRequest: !valgtPanel,
    isCachingOn: true,
  });

  const { data: faktaDataUtenCaching, state: stateForEndepunkterUtenCaching } =
    restApiFrisinnHooks.useMultipleRestApi<FetchedData>(endepunkterUtenCaching, {
      updateTriggers: [behandling.versjon, valgtPanel],
      suspendRequest: !valgtPanel,
    });

  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (formData) {
      setFormData(undefined);
    }
  }, [behandling.versjon]);

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
              formData,
              setFormData,
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

export default FrisinnFakta;
