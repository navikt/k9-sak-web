import { createContext } from "react";
import type { UngKodeverkoppslag } from "./useUngKodeverkoppslag.js";
import { FailingUngSakKodeverkoppslag } from "./UngSakKodeverkoppslag.js";
import { FailingUngTilbakeKodeverkoppslag } from "./UngTilbakeKodeverkoppslag.js";

export const UngKodeverkoppslagContext = createContext<UngKodeverkoppslag>({
  isPending: true,
  ungSak: new FailingUngSakKodeverkoppslag(),
  ungTilbake: new FailingUngTilbakeKodeverkoppslag(),
})
