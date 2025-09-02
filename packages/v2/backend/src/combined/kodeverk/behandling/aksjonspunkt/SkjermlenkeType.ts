import { k9_kodeverk_behandling_aksjonspunkt_SkjermlenkeType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { k9_klage_kodeverk_behandling_aksjonspunkt_SkjermlenkeType } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { foreldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import { ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { sif_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType } from '@k9-sak-web/backend/ungtilbake/generated/types.js';

export type SkjermlenkeType =
  | k9_kodeverk_behandling_aksjonspunkt_SkjermlenkeType
  | k9_klage_kodeverk_behandling_aksjonspunkt_SkjermlenkeType
  | foreldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType
  | ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType
  | sif_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType;

export const SkjermlenkeType = {
  ...k9_kodeverk_behandling_aksjonspunkt_SkjermlenkeType,
  ...k9_klage_kodeverk_behandling_aksjonspunkt_SkjermlenkeType,
  ...foreldrepenger_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType,
  ...ung_kodeverk_behandling_aksjonspunkt_SkjermlenkeType,
  ...sif_tilbakekreving_behandlingslager_behandling_skjermlenke_SkjermlenkeType,
};

export const isSkjermlenkeType = (v: string): v is SkjermlenkeType =>
  Object.values(SkjermlenkeType).some(skjerlenkeTypeVerdi => v === skjerlenkeTypeVerdi);
