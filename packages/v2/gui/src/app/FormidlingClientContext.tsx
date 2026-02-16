import { FormidlingClient } from '@k9-sak-web/backend/k9formidling/client/FormidlingClient.js';
import { createContext } from 'react';

/**
 * This shall be a top level context providing the FormidlingClient instance that will be used for communicating with backend server.
 */
export const FormidlingClientContext = createContext(
  new FormidlingClient(new URL('/k9/formidling/api/', window.location.origin)),
);
