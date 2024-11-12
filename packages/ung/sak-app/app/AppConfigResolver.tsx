import { ReactElement, useEffect } from 'react';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import { RestApiState, useRestApiErrorDispatcher } from '@k9-sak-web/rest-api-hooks';

import { requestApi, restApiHooks, UngSakApiKeys } from '../data/ungsakApi';
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

  const { state: navAnsattState } = restApiHooks.useGlobalStateRestApi(UngSakApiKeys.NAV_ANSATT, NO_PARAMS, options);

  const { state: featureToggleState } = restApiHooks.useGlobalStateRestApi<{
    featureToggles: { [key: string]: boolean };
  }>(
    UngSakApiKeys.FEATURE_TOGGLE,
    {},
    {
      ...options,
      suspendRequest: options.suspendRequest,
    },
  );

  const { state: sprakFilState } = restApiHooks.useGlobalStateRestApi(UngSakApiKeys.LANGUAGE_FILE, NO_PARAMS);

  const harHentetFerdigKodeverk = useHentKodeverk(harHentetFerdigInitLenker);

  const harFeilet = harK9sakInitKallFeilet && sprakFilState === RestApiState.SUCCESS;

  const erFerdig =
    harHentetFerdigInitLenker &&
    harHentetFerdigKodeverk &&
    navAnsattState === RestApiState.SUCCESS &&
    sprakFilState === RestApiState.SUCCESS &&
    (featureToggleState === RestApiState.NOT_STARTED || featureToggleState === RestApiState.SUCCESS);

  return harFeilet || erFerdig ? children : <LoadingPanel />;
};

export default AppConfigResolver;
