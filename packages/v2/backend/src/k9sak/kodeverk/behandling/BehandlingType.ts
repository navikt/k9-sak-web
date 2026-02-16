import type { Kodeverk } from '../../../shared/Kodeverk.js';
import {
  k9_kodeverk_behandling_BehandlingType as enumObj,
  type k9_kodeverk_behandling_BehandlingType as typeUnion,
} from '../../generated/types.js';

export type BehandlingType = typeUnion;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

export const behandlingType = enumObj;
