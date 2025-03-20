import { RestApiState } from '@k9-sak-web/rest-api-hooks';

import { restApiHooks, UngSakApiKeys } from '../data/ungsakApi';

const NO_PARAMS = {};

const useHentKodeverk = (skalHenteKodeverk: boolean): boolean => {
  const { state: kodeverkK9SakStatus } = restApiHooks.useGlobalStateRestApi(UngSakApiKeys.KODEVERK, NO_PARAMS, {
    suspendRequest: !skalHenteKodeverk,
    updateTriggers: [skalHenteKodeverk],
  });

  const harHentetK9Sak =
    kodeverkK9SakStatus !== RestApiState.NOT_STARTED && kodeverkK9SakStatus !== RestApiState.LOADING;

  return harHentetK9Sak;
};

export default useHentKodeverk;
