import { createContext } from 'react';
import { HistorikkBackendClient } from './HistorikkBackendClient.js';
import { getK9SakClient } from '@k9-sak-web/backend/k9sak/client';
import type { HistorikkBackendApi } from './HistorikkBackendApi.js';

const HistorikkBackendApiContext = createContext<HistorikkBackendApi>(new HistorikkBackendClient(getK9SakClient()));
export default HistorikkBackendApiContext;
