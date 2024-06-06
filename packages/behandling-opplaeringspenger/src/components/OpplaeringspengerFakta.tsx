import React, { useEffect, useState } from 'react';

import { Rettigheter, SideMenuWrapper, faktaHooks, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import {
  Behandling,
  ArbeidsgiverOpplysningerPerId,
  FagsakPerson,
  Fagsak,
  Dokument,
  FeatureToggles,
} from '@k9-sak-web/types';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import ErrorBoundary from '@k9-sak-web/sak-app/src/app/ErrorBoundary';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import { AlleKodeverk } from '@k9-sak-web/lib/types/index.js';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaOpplaeringspengerPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';
import {
  restApiOpplaeringspengerHooks,
  OpplaeringspengerBehandlingApiKeys,
} from '../data/opplaeringspengerBehandlingApi';

const overstyringApCodes = [ac.OVERSTYRING_AV_BEREGNINGSAKTIVITETER, ac.OVERSTYRING_AV_BEREGNINGSGRUNNLAG];

interface OwnProps {
  data: FetchedData;
  fagsak: Fagsak;
  fagsakPerson: FagsakPerson;
  behandling: Behandling;
  alleKodeverk: AlleKodeverk;
  rettigheter: Rettigheter;
  hasFetchError: boolean;
  oppdaterProsessStegOgFaktaPanelIUrl: (prosessPanel?: string, faktanavn?: string) => void;
  valgtFaktaSteg?: string;
  valgtProsessSteg?: string;
  setApentFaktaPanel: (faktaPanelInfo: { urlCode: string; textCode: string }) => void;
  setBehandling: (behandling: Behandling) => void;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  dokumenter: Dokument[];
  featureToggles: FeatureToggles;
  beregningErBehandlet?: boolean;
}

const OpplaeringspengerFakta = ({
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
  dokumenter,
  featureToggles,
  beregningErBehandlet,
}: OwnProps) => {
  const { aksjonspunkter, ...rest } = data;
  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } =
    restApiOpplaeringspengerHooks.useRestApiRunner<Behandling>(OpplaeringspengerBehandlingApiKeys.SAVE_AKSJONSPUNKT);
  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const { startRequest: lagreOverstyrteAksjonspunkter, data: apOverstyrtBehandlingRes } =
    restApiOpplaeringspengerHooks.useRestApiRunner<Behandling>(
      OpplaeringspengerBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
    );
  useSetBehandlingVedEndring(apOverstyrtBehandlingRes, setBehandling);

  const dataTilUtledingAvOpplaeringspengerPaneler = {
    fagsak,
    fagsakPerson,
    behandling,
    hasFetchError,
    arbeidsgiverOpplysningerPerId,
    ...rest,
  };

  const [faktaPaneler, valgtPanel, sidemenyPaneler] = faktaHooks.useFaktaPaneler(
    faktaPanelDefinisjoner,
    dataTilUtledingAvOpplaeringspengerPaneler,
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
  // TODO FetchedData er feil type her
  const { data: faktaData, state } = restApiOpplaeringspengerHooks.useMultipleRestApi<FetchedData>(endepunkter, {
    updateTriggers: [behandling.versjon, valgtPanel],
    suspendRequest: !valgtPanel,
    isCachingOn: true,
  });

  const { data: faktaDataUtenCaching, state: stateForEndepunkterUtenCaching } =
    restApiOpplaeringspengerHooks.useMultipleRestApi<FetchedData>(endepunkterUtenCaching, {
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
              featureToggles,
              submitCallback: bekreftAksjonspunktCallback,
              ...valgtPanel.getKomponentData(rettigheter, dataTilUtledingAvOpplaeringspengerPaneler, hasFetchError),
              dokumenter,
              beregningErBehandlet,
              formData,
              setFormData,
            })}
          </ErrorBoundary>
        )}
      </SideMenuWrapper>
    );
  }
  return null;
};

export default OpplaeringspengerFakta;
