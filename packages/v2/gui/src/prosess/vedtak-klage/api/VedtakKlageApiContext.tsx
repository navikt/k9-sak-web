import { createContext } from 'react';
import type { VedtakKlageApi } from './VedtakKlageApi.js';

export const VedtakKlageApiContext = createContext<VedtakKlageApi | null>(null);
