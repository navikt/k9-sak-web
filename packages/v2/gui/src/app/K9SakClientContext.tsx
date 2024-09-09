import { createContext } from 'react';
import { K9SakClient } from '@k9-sak-web/backend/k9sak/generated';
import { generateNavCallidHeader } from '@k9-sak-web/backend/shared/instrumentation/navCallid.js';
import type { ApiRequestOptions } from '@k9-sak-web/backend/k9sak/generated';
import { K9SakHttpRequest } from '@k9-sak-web/backend/k9sak/errorhandling/K9SakHttpRequest.js';

const headerResolver = async (options: ApiRequestOptions<Record<string, string>>): Promise<Record<string, string>> => {
  const { headerName, headerValue } = generateNavCallidHeader();
  return {
    ...options.headers,
    [headerName]: headerValue,
  };
};

/**
 * This shall be a top level context providing the K9SakClient instance that will be used for communicating with the backend server.
 */
export const K9SakClientContext = createContext(
  new K9SakClient(
    {
      BASE: '/k9/sak/api',
      HEADERS: headerResolver,
    },
    K9SakHttpRequest,
  ),
);
