import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { SideMenuWrapper, faktaHooks, useSetBehandlingVedEndring } from '@k9-sak-web/behandling-felles';
import { Behandling } from '@k9-sak-web/types';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';
import ErrorBoundary from '@k9-sak-web/sak-app/src/app/ErrorBoundary';
import { restApiUtvidetRettHooks, UtvidetRettBehandlingApiKeys } from '../data/utvidetRettBehandlingApi';
import faktaUtvidetRettPanelDefinisjoner from '../panelDefinisjoner/faktaUtvidetRettPanelDefinisjoner';
import FetchedData from '../types/fetchedDataTsType';
import { FaktaProps } from '../types/FaktaProps';

const UtvidetRettFakta = ({
  intl,
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
  featureToggles,
  arbeidsgiverOpplysningerPerId,
}: FaktaProps & WrappedComponentProps) => {
  const { aksjonspunkter, ...rest } = data;
  const { addErrorMessage } = useRestApiErrorDispatcher();

  const { startRequest: lagreAksjonspunkter, data: apBehandlingRes } =
    restApiUtvidetRettHooks.useRestApiRunner<Behandling>(UtvidetRettBehandlingApiKeys.SAVE_AKSJONSPUNKT);
  useSetBehandlingVedEndring(apBehandlingRes, setBehandling);

  const dataTilUtledingAvUtvidetRettPaneler = {
    fagsak,
    fagsakPerson,
    behandling,
    hasFetchError,
    arbeidsgiverOpplysningerPerId,
    ...rest,
  };

  const [faktaPaneler, valgtPanel, sidemenyPaneler] = faktaHooks.useFaktaPaneler(
    faktaUtvidetRettPanelDefinisjoner,
    dataTilUtledingAvUtvidetRettPaneler,
    behandling,
    rettigheter,
    aksjonspunkter,
    valgtFaktaSteg,
    intl,
  );

  faktaHooks.useFaktaAksjonspunktNotifikator(faktaPaneler, setApentFaktaPanel, behandling.versjon);

  const [velgFaktaPanelCallback, bekreftAksjonspunktCallback] = faktaHooks.useCallbacks(
    faktaPaneler,
    fagsak,
    behandling,
    oppdaterProsessStegOgFaktaPanelIUrl,
    valgtProsessSteg,
    [],
    lagreAksjonspunkter,
  );

  const endepunkter = valgtPanel
    ? valgtPanel
        .getPanelDef()
        .getEndepunkter(featureToggles)
        .map(e => ({ key: e }))
    : [];
  const { data: faktaData, state } = restApiUtvidetRettHooks.useMultipleRestApi<FetchedData>(endepunkter, {
    updateTriggers: [behandling.versjon, valgtPanel],
    suspendRequest: !valgtPanel,
    isCachingOn: true,
  });

  if (sidemenyPaneler.length > 0) {
    const isLoading = state === RestApiState.NOT_STARTED || state === RestApiState.LOADING;
    return (
      <SideMenuWrapper paneler={sidemenyPaneler} onClick={velgFaktaPanelCallback}>
        {valgtPanel && isLoading && <LoadingPanel />}
        {valgtPanel && !isLoading && (
          <ErrorBoundary errorMessageCallback={addErrorMessage}>
            {valgtPanel.getPanelDef().getKomponent({
              ...faktaData,
              behandling,
              alleKodeverk,
              submitCallback: bekreftAksjonspunktCallback,
              ...valgtPanel.getKomponentData(rettigheter, dataTilUtledingAvUtvidetRettPaneler, hasFetchError),
            })}
          </ErrorBoundary>
        )}
      </SideMenuWrapper>
    );
  }
  return null;
};

export default injectIntl(UtvidetRettFakta);
