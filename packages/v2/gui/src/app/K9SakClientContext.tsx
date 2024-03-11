import { createContext } from 'react';
import { K9SakClient } from '@k9-sak-web/backend/k9sak/generated';

/**
 * This shall be a top level context providing the K9SakClient instance that will be used for communicating with the backend server.
 */
export const K9SakClientContext = createContext(
  new K9SakClient({
    BASE: '/k9/sak/api',
  }),
);
