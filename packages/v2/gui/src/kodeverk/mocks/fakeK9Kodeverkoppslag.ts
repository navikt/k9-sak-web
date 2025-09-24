import type { K9Kodeverkoppslag } from "../oppslag/useK9Kodeverkoppslag.js";
import { K9SakKodeverkoppslag } from "../oppslag/K9SakKodeverkoppslag.js";
import { oppslagKodeverkSomObjektK9Sak } from "./oppslagKodeverkSomObjektK9Sak.js";
import { K9KlageKodeverkoppslag } from "../oppslag/K9KlageKodeverkoppslag.js";
import { oppslagKodeverkSomObjektK9Klage } from "./oppslagKodeverkSomObjektK9Klage.js";
import { K9TilbakeKodeverkoppslag } from "../oppslag/K9TilbakeKodeverkoppslag.js";
import { oppslagKodeverkSomObjektK9Tilbake } from "./oppslagKodeverkSomObjektK9Tilbake.js";

/** Kun for bruk i testing */
export const fakeK9Kodeverkoppslag = (): K9Kodeverkoppslag => {
  return {
    isPending: false,
    k9sak: new K9SakKodeverkoppslag(oppslagKodeverkSomObjektK9Sak),
    k9klage: new K9KlageKodeverkoppslag(oppslagKodeverkSomObjektK9Klage),
    k9tilbake: new K9TilbakeKodeverkoppslag(oppslagKodeverkSomObjektK9Tilbake),
  }
}
