import { createContext } from 'react';
import MenyEndreFristBackendClient from './MenyEndreFristBackendClient.js';
import type { MenyEndreFristApi } from './MenyEndreFristApi.js';

export const MenyEndreFristApiContext = createContext<MenyEndreFristApi>(new MenyEndreFristBackendClient());
