import { createContext } from 'react';
import { getK9SakClient } from '@k9-sak-web/backend/k9sak/client';

/**
 * This shall be a top level context providing the K9SakClient instance that will be used for communicating with the backend server.
 * XXX: Consider replacing uses of this with getK9SakClient. We never replace the K9SakClient with something else, so can be a singleton instead of context.
 */
export const K9SakClientContext = createContext(getK9SakClient());
