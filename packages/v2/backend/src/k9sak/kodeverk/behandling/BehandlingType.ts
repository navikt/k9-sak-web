import { type BehandlingDtoType as typeUnion, BehandlingDtoType as enumObj } from '../../generated';
import type { Kodeverk } from '../../../shared/Kodeverk.js';

export type BehandlingType = typeUnion;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

export const behandlingType = enumObj;
