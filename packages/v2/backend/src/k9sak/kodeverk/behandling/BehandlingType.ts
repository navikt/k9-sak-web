import type { Kodeverk } from '../../../shared/Kodeverk.js';
import {
  type k9_kodeverk_behandling_BehandlingType as typeUnion,
  k9_kodeverk_behandling_BehandlingType as enumObj,
} from '../../generated/types.js';

export type BehandlingType = typeUnion;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

export const behandlingType = enumObj;

export const isBehandlingType = (verdi: string): verdi is BehandlingType =>
  Object.values(behandlingType).some(b => b === verdi);

export const toBehandlingType = (verdi: string): BehandlingType => {
  if (!isBehandlingType(verdi)) {
    throw new Error('Ukjent behandlingstype: ' + verdi);
  }
  return verdi;
};
