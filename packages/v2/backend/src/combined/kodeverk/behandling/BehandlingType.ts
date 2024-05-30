import {
  behandlingType as behandlingTypeK9Sak,
  type BehandlingType as BehandlingTypeK9Sak,
} from '../../../k9sak/kodeverk/behandling/BehandlingType.js';
import {
  behandlingType as behandlingTypeK9Klage,
  type BehandlingType as BehandlingTypeK9Klage,
} from '../../../k9klage/kodeverk/behandling/BehandlingType.js';
import type { Kodeverk } from '../../../shared/Kodeverk.ts';

export type BehandlingType = BehandlingTypeK9Sak | BehandlingTypeK9Klage;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

const values: string[] = [...Object.values(behandlingTypeK9Sak), ...Object.values(behandlingTypeK9Klage)];

export const isBehandlingType = (t: string): t is BehandlingType => values.includes(t);
