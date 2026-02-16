import { k9_klage_kodeverk_behandling_BehandlingResultatType } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { k9_kodeverk_behandling_BehandlingResultatType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { foreldrepenger_tilbakekreving_behandlingslager_behandling_BehandlingResultatType } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import { ung_kodeverk_behandling_BehandlingResultatType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { sif_tilbakekreving_behandlingslager_behandling_BehandlingResultatType } from '@k9-sak-web/backend/ungtilbake/generated/types.js';
import { safeConstCombine } from '../../../typecheck/safeConstCombine.js';

export type BehandlingResultatType =
  | k9_kodeverk_behandling_BehandlingResultatType
  | k9_klage_kodeverk_behandling_BehandlingResultatType
  | foreldrepenger_tilbakekreving_behandlingslager_behandling_BehandlingResultatType
  | ung_kodeverk_behandling_BehandlingResultatType
  | sif_tilbakekreving_behandlingslager_behandling_BehandlingResultatType;

export const BehandlingResultatType = safeConstCombine(
  k9_kodeverk_behandling_BehandlingResultatType,
  k9_klage_kodeverk_behandling_BehandlingResultatType,
  foreldrepenger_tilbakekreving_behandlingslager_behandling_BehandlingResultatType,
  ung_kodeverk_behandling_BehandlingResultatType,
  sif_tilbakekreving_behandlingslager_behandling_BehandlingResultatType,
);

export const isBehandlingResultatType = (v: string): v is BehandlingResultatType =>
  Object.values(BehandlingResultatType).some(e => e == v);
