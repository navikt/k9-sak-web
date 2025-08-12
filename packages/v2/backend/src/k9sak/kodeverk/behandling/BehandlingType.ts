import {
  type kodeverk_behandling_BehandlingType as typeUnion,
  kodeverk_behandling_BehandlingType as enumObj,
} from '../../generated';
import type { Kodeverk } from '../../../shared/Kodeverk.js';

export type BehandlingType = typeUnion;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

export const behandlingType = enumObj;
