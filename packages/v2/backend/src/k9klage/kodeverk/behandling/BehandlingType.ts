import type { Kodeverk } from '../../../shared/Kodeverk.js';
import {
  k9_klage_kodeverk_behandling_BehandlingType,
  type k9_klage_kodeverk_behandling_BehandlingType as uniontype,
} from '../../generated/types.js';

export type BehandlingType = uniontype;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

export const behandlingType = k9_klage_kodeverk_behandling_BehandlingType;
