import { isAktivitetspenger } from '@k9-sak-web/gui/utils/urlUtils.js';
import ApplicationContextPath from '@k9-sak-web/sak-app/src/app/ApplicationContextPath';
import { restApiHooks, UngSakApiKeys } from '../data/ungsakApi';

const useGetEnabledApplikasjonContext = (): ApplicationContextPath[] => {
  const enabledApplicationContexts = [ApplicationContextPath.K9SAK, ApplicationContextPath.UNGSAK];
  const initTilbake = restApiHooks.useGlobalStateRestApiData(UngSakApiKeys.INIT_FETCH_TILBAKE);

  if (initTilbake && !isAktivitetspenger()) {
    enabledApplicationContexts.push(ApplicationContextPath.TILBAKE);
  }

  return enabledApplicationContexts;
};

export default useGetEnabledApplikasjonContext;
