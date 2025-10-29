import { ReactElement, useEffect } from 'react';

import { LoadingPanel } from '@k9-sak-web/gui/shared/loading-panel/LoadingPanel.js';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { qFeatureToggles } from '@k9-sak-web/gui/featuretoggles/ung/qFeatureToggles.js';
import { useFeatureToggles } from '@k9-sak-web/gui/featuretoggles/useFeatureToggles.js';
import { requestApi, restApiHooks, UngSakApiKeys } from '../data/ungsakApi';
import useHentInitLenker from './useHentInitLenker';
import useHentKodeverk from './useHentKodeverk';
import { InnloggetAnsattProvider } from '@k9-sak-web/gui/saksbehandler/InnloggetAnsattProvider.js';
import { UngSakInnloggetAnsattBackendClient } from '@k9-sak-web/gui/saksbehandler/UngSakInnloggetAnsattBackendClient.js';
import { KlageVurderingApiContext } from '@k9-sak-web/gui/prosess/klagevurdering/api/KlageVurderingApiContext.js';
import UngKlageVurderingBackendClient from '@k9-sak-web/gui/prosess/klagevurdering/api/UngKlageVurderingBackendClient.js';
import useGetEnabledApplikasjonContext from './useGetEnabledApplikasjonContext';
import ApplicationContextPath from '@k9-sak-web/sak-app/src/app/ApplicationContextPath';
import { useUngKodeverkoppslag } from '@k9-sak-web/gui/kodeverk/oppslag/useUngKodeverkoppslag.js';
import { UngKodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/UngKodeverkoppslagContext.js';

interface OwnProps {
  children: ReactElement<any>;
}

const NO_PARAMS = {};

/**
 * Komponent som henter backend-data som skal kunne aksesseres globalt i applikasjonen. Denne dataen blir kun hentet en gang.
 */
const AppConfigResolver = ({ children }: OwnProps) => {
  const { addErrorMessage } = useRestApiErrorDispatcher();
  useEffect(() => {
    requestApi.setAddErrorMessageHandler(addErrorMessage);
  }, []);

  const [harHentetFerdigInitLenker, harK9sakInitKallFeilet] = useHentInitLenker();

  const options = {
    suspendRequest: harK9sakInitKallFeilet || !harHentetFerdigInitLenker,
    updateTriggers: [harHentetFerdigInitLenker],
  };

  const { state: navAnsattState } = restApiHooks.useGlobalStateRestApi(UngSakApiKeys.NAV_ANSATT, NO_PARAMS, options);

  const { featureToggles } = useFeatureToggles();

  const { state: sprakFilState } = restApiHooks.useGlobalStateRestApi(UngSakApiKeys.LANGUAGE_FILE, NO_PARAMS);

  const harHentetFerdigKodeverk = useHentKodeverk(harHentetFerdigInitLenker);

  const enabledApplicationContexts = useGetEnabledApplikasjonContext();
  const tilbakeAktivert = enabledApplicationContexts.includes(ApplicationContextPath.TILBAKE);
  const ungKodeverkOppslag = useUngKodeverkoppslag(tilbakeAktivert);

  const harFeilet = harK9sakInitKallFeilet && sprakFilState === RestApiState.SUCCESS;

  const erFerdig =
    harHentetFerdigInitLenker &&
    harHentetFerdigKodeverk &&
    navAnsattState === RestApiState.SUCCESS &&
    sprakFilState === RestApiState.SUCCESS &&
    !ungKodeverkOppslag.isPending &&
    !!featureToggles;

  return (
    <FeatureTogglesContext.Provider value={featureToggles ?? qFeatureToggles}>
      <UngKodeverkoppslagContext value={ungKodeverkOppslag}>
        <KlageVurderingApiContext value={new UngKlageVurderingBackendClient()}>
          <InnloggetAnsattProvider api={new UngSakInnloggetAnsattBackendClient()}>
            {harFeilet || erFerdig ? children : <LoadingPanel />}
          </InnloggetAnsattProvider>
        </KlageVurderingApiContext>
      </UngKodeverkoppslagContext>
    </FeatureTogglesContext.Provider>
  );
};

export default AppConfigResolver;
