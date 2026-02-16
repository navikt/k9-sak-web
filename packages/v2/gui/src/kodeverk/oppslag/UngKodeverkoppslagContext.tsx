import { createContext } from 'react';
import { FailingUngSakKodeverkoppslag } from './UngSakKodeverkoppslag.js';
import { FailingUngTilbakeKodeverkoppslag } from './UngTilbakeKodeverkoppslag.js';
import type { UngKodeverkoppslag } from './useUngKodeverkoppslag.js';

export const UngKodeverkoppslagContext = createContext<UngKodeverkoppslag>({
  ungSak: new FailingUngSakKodeverkoppslag(),
  ungTilbake: new FailingUngTilbakeKodeverkoppslag(),
});
