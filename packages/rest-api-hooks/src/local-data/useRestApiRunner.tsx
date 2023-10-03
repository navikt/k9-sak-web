import { useState, useCallback } from 'react';

import { REQUEST_POLLING_CANCELLED, ErrorType, AbstractRequestApi } from '@k9-sak-web/rest-api';

import RestApiState from '../RestApiState';

interface RestApiData<T> {
  startRequest: (params?: any, keepData?: boolean) => Promise<T>;
  resetRequestData: () => void;
  state: RestApiState;
  error?: ErrorType;
  data?: T;
}

/**
 * For mocking i unit-test
 */
export const getUseRestApiRunnerMock = (requestApi: AbstractRequestApi) =>
  (function useRestApiRunner<T>(key: string): RestApiData<T> {
    const [data, setData] = useState({
      state: RestApiState.NOT_STARTED,
      data: undefined,
      error: undefined,
    });

    const startRequest = (params?: any): Promise<T> => {
      const response = requestApi.startRequest(key, params);
      setData({
        state: RestApiState.SUCCESS,
        data: response,
        error: undefined,
      });
      return Promise.resolve(response);
    };

    return {
      startRequest,
      resetRequestData: () => undefined,
      ...data,
    };
  });

/**
 * Hook som gir deg ein funksjon til å starte restkall, i tillegg til kallets status/resultat/feil
 */
const getUseRestApiRunner = (requestApi: AbstractRequestApi) =>
  (function useRestApiRunner<T>(key: string): RestApiData<T> {
    const [data, setData] = useState({
      state: RestApiState.NOT_STARTED,
      data: undefined,
      error: undefined,
    });

    const startRequest = useCallback((params?: any, keepData = false): Promise<T> => {
      if (requestApi.hasPath(key)) {
        setData(oldState => ({
          state: RestApiState.LOADING,
          data: keepData ? oldState.data : undefined,
          error: undefined,
        }));

        return requestApi
          .startRequest(key, params)
          .then(dataRes => {
            if (dataRes.payload !== REQUEST_POLLING_CANCELLED) {
              setData({
                state: RestApiState.SUCCESS,
                data: dataRes.payload,
                error: undefined,
              });
            }
            return Promise.resolve(dataRes.payload);
          })
          .catch(error => {
            setData({
              state: RestApiState.ERROR,
              data: undefined,
              error,
            });
            throw error;
          });
      }
      setData({
        state: RestApiState.NOT_STARTED,
        error: undefined,
        data: undefined,
      });
      return undefined;
    }, []);

    const resetRequestData = useCallback(() => {
      setData({
        state: RestApiState.NOT_STARTED,
        data: undefined,
        error: undefined,
      });
    }, []);

    return {
      startRequest,
      resetRequestData,
      ...data,
    };
  });

export default getUseRestApiRunner;
