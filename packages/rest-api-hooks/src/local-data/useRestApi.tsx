import { useState, useEffect, DependencyList } from 'react';

import { REQUEST_POLLING_CANCELLED, AbstractRequestApi } from '@k9-sak-web/rest-api';

import RestApiState from '../RestApiState';

interface RestApiData<T> {
  state: RestApiState;
  error?: Error;
  data?: T;
}

interface Options {
  updateTriggers?: DependencyList;
  keepData?: boolean;
  suspendRequest?: boolean;
}

const defaultOptions = {
  updateTriggers: [],
  keepData: false,
  suspendRequest: false,
};

/**
 * For mocking i unit-test
 */
export const getUseRestApiMock = (requestApi: AbstractRequestApi) =>
  (function useRestApi<T>(key: string, params?: any, options: Options = defaultOptions): RestApiData<T> {
    return {
      state: options.suspendRequest ? RestApiState.NOT_STARTED : RestApiState.SUCCESS,
      error: undefined,
      data: options.suspendRequest ? undefined : requestApi.startRequest(key, params),
    };
  });

/**
 * Hook som utfører et restkall ved mount. En kan i tillegg legge ved en dependencies-liste som kan trigge ny henting når data
 * blir oppdatert. Hook returnerer rest-kallets status/resultat/feil
 */
const getUseRestApi = (requestApi: AbstractRequestApi) =>
  (function useRestApi<T>(key: string, params?: any, options?: Options): RestApiData<T> {
    const allOptions = { ...defaultOptions, ...options };

    const [data, setData] = useState({
      state: RestApiState.NOT_STARTED,
      error: undefined,
      data: undefined,
    });

    useEffect(() => {
      if (requestApi.hasPath(key) && !allOptions.suspendRequest) {
        setData(oldState => ({
          state: RestApiState.LOADING,
          error: undefined,
          data: allOptions.keepData ? oldState.data : undefined,
        }));

        requestApi
          .startRequest(key, params)
          .then(dataRes => {
            if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
              setData({
                state: RestApiState.SUCCESS,
                data: dataRes.payload,
                error: undefined,
              });
            }
          })
          .catch(error => {
            setData({
              state: RestApiState.ERROR,
              data: undefined,
              error,
            });
          });
      } else if (!requestApi.hasPath(key)) {
        setData({
          state: RestApiState.NOT_STARTED,
          error: undefined,
          data: undefined,
        });
      }
    }, [...allOptions.updateTriggers]);

    return data;
  });

export default getUseRestApi;
