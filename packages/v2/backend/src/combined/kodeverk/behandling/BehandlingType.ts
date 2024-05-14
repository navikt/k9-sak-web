import {
  behandlingType as behandlingTypeK9Sak,
  type BehandlingType as BehandlingTypeK9Sak,
} from '../../../k9sak/kodeverk/behandling/BehandlingType.js';
import {
  behandlingType as behandlingTypeK9Klage,
  type BehandlingType as BehandlingTypeK9Klage,
} from '../../../k9klage/kodeverk/behandling/BehandlingType.js';
import type { Kodeverk } from '../../../shared/Kodeverk.ts';

// DOKUMENTINNSYN - Denne er sannsynlegvis ikkje i bruk og bør fjernast. Ikkje definert i nokon backend kodebase.
// Leggast derfor til manuelt her midlerditig til vi har funne ut om den kan fjernast.
export type DeprecatedBehandlingType = 'BT-006';
type DeprecatedBehandlingTypeName = 'DOKUMENTINNSYN';

export const deprecatedBehandlingType: Readonly<Record<DeprecatedBehandlingTypeName, DeprecatedBehandlingType>> = {
  DOKUMENTINNSYN: 'BT-006',
};

export type BehandlingType = BehandlingTypeK9Sak | BehandlingTypeK9Klage | DeprecatedBehandlingType;

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

const values: string[] = [
  ...Object.values(behandlingTypeK9Sak),
  ...Object.values(behandlingTypeK9Klage),
  ...Object.values(deprecatedBehandlingType),
];

export const isBehandlingType = (t: string): t is BehandlingType => values.includes(t);
