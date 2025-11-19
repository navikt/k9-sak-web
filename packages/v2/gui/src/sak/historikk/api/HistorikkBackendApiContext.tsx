import { createContext } from 'react';
import type { HistorikkBackendApi } from './HistorikkBackendApi.js';

export const HistorikkBackendApiContext = createContext<HistorikkBackendApi | null>(null);
