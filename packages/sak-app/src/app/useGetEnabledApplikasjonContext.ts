import { K9sakApiKeys, restApiHooks } from '../data/k9sakApi';
import ApplicationContextPath from './ApplicationContextPath';

const useGetEnabledApplikasjonContext = (): ApplicationContextPath[] => {
  const enabledApplicationContexts = [ApplicationContextPath.K9SAK];

  const initTilbake = restApiHooks.useGlobalStateRestApiData(K9sakApiKeys.INIT_FETCH_TILBAKE);
  const initKlage = restApiHooks.useGlobalStateRestApiData(K9sakApiKeys.INIT_FETCH_KLAGE);

  if (initTilbake) {
    enabledApplicationContexts.push(ApplicationContextPath.TILBAKE);
  }
  if (initKlage) {
    enabledApplicationContexts.push(ApplicationContextPath.KLAGE);
  }

  return enabledApplicationContexts;
};

export default useGetEnabledApplikasjonContext;
