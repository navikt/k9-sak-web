import { useState, useEffect, DependencyList, useRef } from 'react';

import { AbstractRequestApi } from '@k9-sak-web/rest-api';

import RestApiState from '../RestApiState';

const notEqual = (array1, array2) =>
  !(array1.length === array2.length && array1.every((value, index) => value === array2[index]));
const format = name =>
  name
    .toLowerCase()
    .replace(/_([a-z])/g, m => m.toUpperCase())
    .replace(/_/g, '');

export interface RestApiData<T> {
  state: RestApiState;
  error?: Error;
  data?: T;
}

export interface EndpointData {
  key: string;
  params?: any;
}

export interface Options {
  updateTriggers?: DependencyList;
  keepData?: boolean;
  suspendRequest?: boolean;
  isCachingOn?: boolean;
}

const defaultOptions = {
  updateTriggers: [],
  keepData: false,
  suspendRequest: false,
  isCachingOn: false,
};

/**
 * For mocking i unit-test
 */
export const getUseMultipleRestApiMock = (requestApi: AbstractRequestApi) =>
  (function useMultipleRestApi<T>(endpoints: EndpointData[], options: Options = defaultOptions): RestApiData<T> {
    const endpointData = endpoints.reduce(
      (acc, endpoint) => ({
        ...acc,
        [format(endpoint.key)]: requestApi.startRequest(endpoint.key, endpoint.params),
      }),
      {},
    );
    return {
      state: options.suspendRequest ? RestApiState.NOT_STARTED : RestApiState.SUCCESS,
      error: undefined,
      // @ts-ignore
      data: options.suspendRequest ? undefined : endpointData,
    };
  });

const DEFAULT_STATE = {
  state: RestApiState.NOT_STARTED,
  error: undefined,
  data: undefined,
};

/**
 * Hook som utfører et restkall ved mount. En kan i tillegg legge ved en dependencies-liste som kan trigge ny henting når data
 * blir oppdatert. Hook returnerer rest-kallets status/resultat/feil
 */
const getUseMultipleRestApi = (requestApi: AbstractRequestApi) =>
  (function useMultipleRestApi<T>(endpoints: EndpointData[], options: Options = defaultOptions): RestApiData<T> {
    const [data, setData] = useState(DEFAULT_STATE);

    const ref = useRef<DependencyList>();
    useEffect(() => {
      ref.current = options.updateTriggers;
    }, [options.updateTriggers]);
    const previousTriggers = ref.current;

    useEffect(() => {
      if (!options.suspendRequest) {
        setData(oldState => ({
          state: RestApiState.LOADING,
          error: undefined,
          data: options.keepData ? oldState.data : undefined,
        }));

        const filteredEndpoints = endpoints.filter(e => requestApi.hasPath(e.key));

        Promise.all(filteredEndpoints.map(e => requestApi.startRequest(e.key, e.params, options.isCachingOn)))
          .then(dataRes => {
            setData({
              state: RestApiState.SUCCESS,
              data: dataRes.reduce(
                (acc, result, index) => ({
                  ...acc,
                  [format(filteredEndpoints[index].key)]: result.payload,
                }),
                {},
              ),
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
      } else {
        setData(DEFAULT_STATE);
      }
    }, [...options.updateTriggers]);

    return previousTriggers && notEqual(previousTriggers, options.updateTriggers)
      ? { ...DEFAULT_STATE, data: options.keepData ? data.data : undefined }
      : data;
  });

export default getUseMultipleRestApi;
