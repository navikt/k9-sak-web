import type { Kodeverk } from '../../../shared/Kodeverk.js';
import {
  type k9_klage_kodeverk_behandling_BehandlingType as uniontype,
  k9_klage_kodeverk_behandling_BehandlingType,
} from '../../generated/types.js';

export type BehandlingType = uniontype;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

export const behandlingType = k9_klage_kodeverk_behandling_BehandlingType;
