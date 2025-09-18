import { k9_kodeverk_behandling_FagsakYtelseType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { k9_klage_kodeverk_behandling_FagsakYtelseType } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { foreldrepenger_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import { ung_kodeverk_behandling_FagsakYtelseType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { sif_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType } from '@k9-sak-web/backend/ungtilbake/generated/types.js';
import { safeConstCombine } from '../../../typecheck/safeConstCombine.js';

export type FagsakYtelseType =
  | k9_kodeverk_behandling_FagsakYtelseType
  | k9_klage_kodeverk_behandling_FagsakYtelseType
  | foreldrepenger_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType
  | ung_kodeverk_behandling_FagsakYtelseType
  | sif_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType;

export const FagsakYtelseType = safeConstCombine(
  k9_kodeverk_behandling_FagsakYtelseType,
  k9_klage_kodeverk_behandling_FagsakYtelseType,
  foreldrepenger_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType,
  sif_tilbakekreving_behandlingslager_fagsak_FagsakYtelseType,
);
