import type { K9Kodeverkoppslag } from './useK9Kodeverkoppslag.jsx';
import { FailingK9SakKodeverkoppslag } from './K9SakKodeverkoppslag.js';
import { createContext } from 'react';

export const K9KodeverkoppslagContext = createContext<K9Kodeverkoppslag>({
  isPending: true,
  k9sak: new FailingK9SakKodeverkoppslag(),
});
