import { AbstractRequestApi } from '@k9-sak-web/rest-api';

import getUseRestApi, { getUseRestApiMock } from './local-data/useRestApi';
import getUseMultipleRestApi, { getUseMultipleRestApiMock } from './local-data/useMultipleRestApi';
import getUseRestApiRunner, { getUseRestApiRunnerMock } from './local-data/useRestApiRunner';
import getUseGlobalStateRestApi, { getUseGlobalStateRestApiMock } from './global-data/useGlobalStateRestApi';
import useGlobalStateRestApiData, { useGlobalStateRestApiDataMock } from './global-data/useGlobalStateRestApiData';

const initHooks = (requestApi: AbstractRequestApi) => {
  if (requestApi.isMock()) {
    return {
      useRestApi: getUseRestApiMock(requestApi),
      useMultipleRestApi: getUseMultipleRestApiMock(requestApi),
      useRestApiRunner: getUseRestApiRunnerMock(requestApi),
      useGlobalStateRestApi: getUseGlobalStateRestApiMock(requestApi),
      useGlobalStateRestApiData: useGlobalStateRestApiDataMock(requestApi),
    };
  }

  return {
    useRestApi: getUseRestApi(requestApi),
    useMultipleRestApi: getUseMultipleRestApi(requestApi),
    useRestApiRunner: getUseRestApiRunner(requestApi),
    useGlobalStateRestApi: getUseGlobalStateRestApi(requestApi),
    useGlobalStateRestApiData,
  };
};

export default { initHooks };
