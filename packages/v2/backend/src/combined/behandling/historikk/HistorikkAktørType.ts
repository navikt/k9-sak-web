import { k9_kodeverk_historikk_HistorikkAktør } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { k9_klage_kodeverk_historikk_HistorikkAktør } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { foreldrepenger_tilbakekreving_behandlingslager_historikk_HistorikkAktør } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import { ung_kodeverk_historikk_HistorikkAktør } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { sif_tilbakekreving_behandlingslager_historikk_HistorikkAktør } from '@k9-sak-web/backend/ungtilbake/generated/types.js';

export type HistorikkAktørType =
  | k9_kodeverk_historikk_HistorikkAktør
  | k9_klage_kodeverk_historikk_HistorikkAktør
  | foreldrepenger_tilbakekreving_behandlingslager_historikk_HistorikkAktør
  | ung_kodeverk_historikk_HistorikkAktør
  | sif_tilbakekreving_behandlingslager_historikk_HistorikkAktør;

export const HistorikkAktørType = {
  ...k9_klage_kodeverk_historikk_HistorikkAktør,
  ...k9_kodeverk_historikk_HistorikkAktør,
  ...foreldrepenger_tilbakekreving_behandlingslager_historikk_HistorikkAktør,
  ...ung_kodeverk_historikk_HistorikkAktør,
  ...sif_tilbakekreving_behandlingslager_historikk_HistorikkAktør,
};
