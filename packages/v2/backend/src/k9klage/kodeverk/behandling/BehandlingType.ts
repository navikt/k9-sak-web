import { type BehandlingDtoType as uniontype, BehandlingDtoType } from '../../generated';
import type { Kodeverk } from '../../../shared/Kodeverk.js';

export type BehandlingType = uniontype;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

export const behandlingType = BehandlingDtoType;
