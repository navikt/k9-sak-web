import type { K9Kodeverkoppslag } from './useK9Kodeverkoppslag.jsx';
import { FailingK9SakKodeverkoppslag } from './K9SakKodeverkoppslag.js';
import { createContext } from 'react';
import { FailingK9KlageKodeverkoppslag } from './K9KlageKodeverkoppslag.js';
import { FailingK9TilbakeKodeverkoppslag } from './K9TilbakeKodeverkoppslag.js';

export const K9KodeverkoppslagContext = createContext<K9Kodeverkoppslag>({
  isPending: true,
  k9sak: new FailingK9SakKodeverkoppslag(),
  k9klage: new FailingK9KlageKodeverkoppslag(),
  k9tilbake: new FailingK9TilbakeKodeverkoppslag(),
});
