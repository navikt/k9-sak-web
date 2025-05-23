import { createContext } from 'react';
import type { HistorikkBackendApi } from './HistorikkBackendApi.js';

const HistorikkBackendApiContext = createContext<HistorikkBackendApi | null>(null);
export default HistorikkBackendApiContext;
