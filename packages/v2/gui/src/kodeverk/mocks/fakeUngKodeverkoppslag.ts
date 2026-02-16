import { UngSakKodeverkoppslag } from '../oppslag/UngSakKodeverkoppslag.js';
import { UngTilbakeKodeverkoppslag } from '../oppslag/UngTilbakeKodeverkoppslag.js';
import type { UngKodeverkoppslag } from '../oppslag/useUngKodeverkoppslag.js';
import { oppslagKodeverkSomObjektUngSak } from './oppslagKodeverkSomObjektUngSak.js';
import { oppslagKodeverkSomObjektUngTilbake } from './oppslagKodeverkSomObjektUngTilbake.js';

/** Kun for bruk i testing */
export const fakeUngKodeverkoppslag = (): UngKodeverkoppslag => {
  return {
    ungSak: new UngSakKodeverkoppslag(oppslagKodeverkSomObjektUngSak),
    ungTilbake: new UngTilbakeKodeverkoppslag(oppslagKodeverkSomObjektUngTilbake),
  };
};
