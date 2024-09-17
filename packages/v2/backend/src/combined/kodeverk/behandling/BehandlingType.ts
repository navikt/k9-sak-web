import {
  behandlingType as behandlingTypeK9Sak,
  type BehandlingType as BehandlingTypeK9Sak,
} from '../../../k9sak/kodeverk/behandling/BehandlingType.js';
import {
  behandlingType as behandlingTypeK9Klage,
  type BehandlingType as BehandlingTypeK9Klage,
} from '../../../k9klage/kodeverk/behandling/BehandlingType.js';

export type BehandlingType = BehandlingTypeK9Sak | BehandlingTypeK9Klage;

const values: string[] = [...Object.values(behandlingTypeK9Sak), ...Object.values(behandlingTypeK9Klage)];

export const isBehandlingType = (t: string): t is BehandlingType => values.includes(t);
