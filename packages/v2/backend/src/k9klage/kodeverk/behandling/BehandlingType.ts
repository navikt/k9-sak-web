import type { Kodeverk } from '../../../shared/Kodeverk.js';
import { type BehandlingDtoType as uniontype, BehandlingDtoType } from '../../generated';

export type BehandlingType = uniontype;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

export const behandlingType = BehandlingDtoType;
