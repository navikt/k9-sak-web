import { useState, useEffect, useContext, DependencyList } from 'react';

import { AbstractRequestApi } from '@k9-sak-web/rest-api';

import { RestApiDispatchContext } from './RestApiContext';
import RestApiState from '../RestApiState';

interface RestApiData<T> {
  state: RestApiState;
  error?: Error;
  data?: T;
}

interface Options {
  updateTriggers?: DependencyList;
  suspendRequest?: boolean;
}

const defaultOptions = {
  updateTriggers: [],
  suspendRequest: false,
};

/**
 * For mocking i unit-test
 */
export const getUseGlobalStateRestApiMock = (requestApi: AbstractRequestApi) =>
  (function useGlobalStateRestApi<T>(key: string, params?: any): RestApiData<T> {
    return {
      state: RestApiState.SUCCESS,
      error: undefined,
      data: requestApi.startRequest(key, params),
    };
  });

/**
 * Hook som henter data fra backend og deretter lagrer i @see RestApiContext
 */
const getUseGlobalStateRestApi = (requestApi: AbstractRequestApi) =>
  (function useGlobalStateRestApi<T>(key: string, params?: any, options: Options = defaultOptions): RestApiData<T> {
    const [data, setData] = useState({
      state: RestApiState.NOT_STARTED,
      error: undefined,
      data: undefined,
    });

    const dispatch = useContext(RestApiDispatchContext);

    useEffect(() => {
      if (!options.suspendRequest && requestApi.hasPath(key)) {
        dispatch({ type: 'remove', key });

        setData({
          state: RestApiState.LOADING,
          error: undefined,
          data: undefined,
        });

        requestApi
          .startRequest(key, params)
          .then(dataRes => {
            dispatch({ type: 'success', key, data: dataRes.payload });
            setData({
              state: RestApiState.SUCCESS,
              data: dataRes.payload,
              error: undefined,
            });
          })
          .catch(error => {
            setData({
              state: RestApiState.ERROR,
              data: undefined,
              error,
            });
          });
      }
    }, options.updateTriggers);

    return data;
  });

export default getUseGlobalStateRestApi;
