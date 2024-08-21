import { createContext } from 'react';
import { K9SakClient, OpenAPI } from '@k9-sak-web/backend/k9sak/generated';
import { addNavCallidToRequestInit } from '@k9-sak-web/backend/shared/interceptors/navCallid.ts';

const requestInterceptors = OpenAPI.interceptors.request;
requestInterceptors.use(addNavCallidToRequestInit);

/**
 * This shall be a top level context providing the K9SakClient instance that will be used for communicating with the backend server.
 */
export const K9SakClientContext = createContext(
  new K9SakClient({
    BASE: '/k9/sak/api',
    interceptors: {
      request: requestInterceptors,
      response: OpenAPI.interceptors.response,
    },
  }),
);
