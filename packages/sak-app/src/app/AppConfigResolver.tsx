import { ReactElement, useEffect } from 'react';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import FeatureTogglesContext from '@k9-sak-web/gui/utils/featureToggles/FeatureTogglesContext.js';
import { useFeatureToggles } from '@k9-sak-web/gui/utils/featureToggles/useFeatureToggles.js';
import { K9sakApiKeys, requestApi, restApiHooks } from '../data/k9sakApi';
import useHentInitLenker from './useHentInitLenker';
import useHentKodeverk from './useHentKodeverk';

interface OwnProps {
  children: ReactElement;
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

  const { state: navAnsattState } = restApiHooks.useGlobalStateRestApi(K9sakApiKeys.NAV_ANSATT, NO_PARAMS, options);

  const [featureToggles] = useFeatureToggles();

  const { state: sprakFilState } = restApiHooks.useGlobalStateRestApi(K9sakApiKeys.LANGUAGE_FILE, NO_PARAMS);

  const harHentetFerdigKodeverk = useHentKodeverk(harHentetFerdigInitLenker);

  const harFeilet = harK9sakInitKallFeilet && sprakFilState === RestApiState.SUCCESS;

  const erFerdig =
    harHentetFerdigInitLenker &&
    harHentetFerdigKodeverk &&
    navAnsattState === RestApiState.SUCCESS &&
    sprakFilState === RestApiState.SUCCESS &&
    !!featureToggles;

  return (
    <FeatureTogglesContext.Provider value={featureToggles}>
      {harFeilet || erFerdig ? children : <LoadingPanel />}
    </FeatureTogglesContext.Provider>
  );
};

export default AppConfigResolver;
