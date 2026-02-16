import { createContext } from 'react';
import { FailingK9KlageKodeverkoppslag } from './K9KlageKodeverkoppslag.js';
import { FailingK9SakKodeverkoppslag } from './K9SakKodeverkoppslag.js';
import { FailingK9TilbakeKodeverkoppslag } from './K9TilbakeKodeverkoppslag.js';
import type { K9Kodeverkoppslag } from './useK9Kodeverkoppslag.jsx';

export const K9KodeverkoppslagContext = createContext<K9Kodeverkoppslag>({
  k9sak: new FailingK9SakKodeverkoppslag(),
  k9klage: new FailingK9KlageKodeverkoppslag(),
  k9tilbake: new FailingK9TilbakeKodeverkoppslag(),
});
