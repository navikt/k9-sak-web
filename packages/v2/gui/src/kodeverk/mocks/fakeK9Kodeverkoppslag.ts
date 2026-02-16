import { K9KlageKodeverkoppslag } from '../oppslag/K9KlageKodeverkoppslag.js';
import { K9SakKodeverkoppslag } from '../oppslag/K9SakKodeverkoppslag.js';
import { K9TilbakeKodeverkoppslag } from '../oppslag/K9TilbakeKodeverkoppslag.js';
import type { K9Kodeverkoppslag } from '../oppslag/useK9Kodeverkoppslag.js';
import { oppslagKodeverkSomObjektK9Klage } from './oppslagKodeverkSomObjektK9Klage.js';
import { oppslagKodeverkSomObjektK9Sak } from './oppslagKodeverkSomObjektK9Sak.js';
import { oppslagKodeverkSomObjektK9Tilbake } from './oppslagKodeverkSomObjektK9Tilbake.js';

/** Kun for bruk i testing */
export const fakeK9Kodeverkoppslag = (): K9Kodeverkoppslag => {
  return {
    k9sak: new K9SakKodeverkoppslag(oppslagKodeverkSomObjektK9Sak),
    k9klage: new K9KlageKodeverkoppslag(oppslagKodeverkSomObjektK9Klage),
    k9tilbake: new K9TilbakeKodeverkoppslag(oppslagKodeverkSomObjektK9Tilbake),
  };
};
