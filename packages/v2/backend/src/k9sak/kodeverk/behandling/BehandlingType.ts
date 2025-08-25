import {
  type k9_kodeverk_behandling_BehandlingType as typeUnion,
  k9_kodeverk_behandling_BehandlingType as enumObj,
} from '../../generated/types.js';
import type { Kodeverk } from '../../../shared/Kodeverk.js';

export type BehandlingType = typeUnion;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

export const behandlingType = enumObj;
