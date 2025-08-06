import type { Kodeverk } from '../../../shared/Kodeverk.js';
import {
  type klage_kodeverk_behandling_BehandlingType as uniontype,
  klage_kodeverk_behandling_BehandlingType,
} from '../../generated/types.js';

export type BehandlingType = uniontype;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

export const behandlingType = klage_kodeverk_behandling_BehandlingType;
