import { k9_kodeverk_behandling_aksjonspunkt_VurderÅrsak } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { k9_klage_kodeverk_behandling_aksjonspunkt_VurderÅrsak } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { ung_kodeverk_behandling_aksjonspunkt_VurderÅrsak } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_VurderÅrsak } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import { sif_tilbakekreving_behandlingslager_behandling_aksjonspunkt_VurderÅrsak } from '@k9-sak-web/backend/ungtilbake/generated/types.js';
import { safeConstCombine } from '../../../../typecheck/safeConstCombine.js';

export type VurderÅrsak =
  | k9_kodeverk_behandling_aksjonspunkt_VurderÅrsak
  | k9_klage_kodeverk_behandling_aksjonspunkt_VurderÅrsak
  | ung_kodeverk_behandling_aksjonspunkt_VurderÅrsak
  | foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_VurderÅrsak
  | sif_tilbakekreving_behandlingslager_behandling_aksjonspunkt_VurderÅrsak;

export const VurderÅrsak = safeConstCombine(
  k9_kodeverk_behandling_aksjonspunkt_VurderÅrsak,
  k9_klage_kodeverk_behandling_aksjonspunkt_VurderÅrsak,
  ung_kodeverk_behandling_aksjonspunkt_VurderÅrsak,
  foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_VurderÅrsak,
  sif_tilbakekreving_behandlingslager_behandling_aksjonspunkt_VurderÅrsak,
);
