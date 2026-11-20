import { foreldrepenger_tilbakekreving_behandlingslager_behandling_verge_VergeType } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import { sif_tilbakekreving_behandlingslager_behandling_verge_VergeType } from '@k9-sak-web/backend/ungtilbake/generated/types.js';
import { safeConstCombine } from '../../../../typecheck/safeConstCombine.js';

export type VergeType =
  | foreldrepenger_tilbakekreving_behandlingslager_behandling_verge_VergeType
  | sif_tilbakekreving_behandlingslager_behandling_verge_VergeType;

export const VergeType = safeConstCombine(
  foreldrepenger_tilbakekreving_behandlingslager_behandling_verge_VergeType,
  sif_tilbakekreving_behandlingslager_behandling_verge_VergeType,
);
