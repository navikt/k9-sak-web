import { useEffect, useState } from 'react';

import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { Rettigheter, SideMenuWrapper, faktaHooks, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import ErrorBoundary from '@k9-sak-web/gui/app/feilmeldinger/ErrorBoundary.js';
import {
  ArbeidsgiverOpplysningerPerId,
  Behandling,
  Dokument,
  Fagsak,
  FagsakPerson,
  FeatureToggles,
  KodeverkMedNavn,
} from '@k9-sak-web/types';

import {
  PleiepengerSluttfaseBehandlingApiKeys,
  restApiPleiepengerSluttfaseHooks,
} from '../data/pleiepengerSluttfaseBehandlingApi';
import faktaPanelDefinisjoner from '../panelDefinisjoner/faktaPleiepengerSluttfasePanelDefinisjoner';
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
  dokumenter: Dokument[];
  featureToggles: FeatureToggles;
  beregningErBehandlet?: boolean;
}

const PleiepengerSluttfaseFakta = ({
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
    restApiPleiepengerSluttfaseHooks.useRestApiRunner<Behandling>(
      PleiepengerSluttfaseBehandlingApiKeys.SAVE_AKSJONSPUNKT,
    );
  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const { startRequest: lagreOverstyrteAksjonspunkter, data: apOverstyrtBehandlingRes } =
    restApiPleiepengerSluttfaseHooks.useRestApiRunner<Behandling>(
      PleiepengerSluttfaseBehandlingApiKeys.SAVE_OVERSTYRT_AKSJONSPUNKT,
    );
  useSetBehandlingVedEndring(apOverstyrtBehandlingRes, setBehandling);

  const dataTilUtledingAvPleiepengerPaneler = {
    fagsak,
    fagsakPerson,
    behandling,
    hasFetchError,
    arbeidsgiverOpplysningerPerId,
    ...rest,
  };

  const [faktaPaneler, valgtPanel, sidemenyPaneler] = faktaHooks.useFaktaPaneler(
    faktaPanelDefinisjoner,
    dataTilUtledingAvPleiepengerPaneler,
    behandling,
    rettigheter,
    aksjonspunkter,
    valgtFaktaSteg,
    featureToggles,
  );

  faktaHooks.useFaktaAksjonspunktNotifikator(faktaPaneler, setApentFaktaPanel, behandling.versjon, featureToggles);

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
  const { data: faktaData, state } = restApiPleiepengerSluttfaseHooks.useMultipleRestApi<FetchedData>(endepunkter, {
    updateTriggers: [behandling.versjon, valgtPanel],
    suspendRequest: !valgtPanel,
    isCachingOn: true,
  });

  const { data: faktaDataUtenCaching, state: stateForEndepunkterUtenCaching } =
    restApiPleiepengerSluttfaseHooks.useMultipleRestApi<FetchedData>(endepunkterUtenCaching, {
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
              formData,
              setFormData,
              submitCallback: bekreftAksjonspunktCallback,
              ...valgtPanel.getKomponentData(rettigheter, dataTilUtledingAvPleiepengerPaneler, hasFetchError),
              dokumenter,
              beregningErBehandlet,
            })}
          </ErrorBoundary>
        )}
      </SideMenuWrapper>
    );
  }
  return null;
};

export default PleiepengerSluttfaseFakta;
