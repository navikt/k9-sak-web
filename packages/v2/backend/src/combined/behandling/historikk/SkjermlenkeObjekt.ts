import type { foreldrepenger_tilbakekreving_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektForeldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType as K9TilbakeSkjermlenkeObjekt } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type { k9_sak_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektK9_kodeverk_behandling_aksjonspunkt_SkjermlenkeType as K9SakSkjermlenkeObjekt } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { k9_klage_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektK9_klage_kodeverk_behandling_aksjonspunkt_SkjermlenkeType as K9KlageSkjermlenkeObjekt } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { ung_kodeverk_KodeverdiSomObjektUng_kodeverk_behandling_aksjonspunkt_SkjermlenkeType as UngSakSkjermlenkeObjekt } from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { sif_tilbakekreving_web_app_tjenester_kodeverk_dto_KodeverdiSomObjektSif_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType as UngTilbakeSkjermlenkeObjekt } from '@k9-sak-web/backend/ungtilbake/generated/types.js';

export type SkjermlenkeObjekt =
  | K9TilbakeSkjermlenkeObjekt
  | K9SakSkjermlenkeObjekt
  | K9KlageSkjermlenkeObjekt
  | UngSakSkjermlenkeObjekt
  | UngTilbakeSkjermlenkeObjekt;
