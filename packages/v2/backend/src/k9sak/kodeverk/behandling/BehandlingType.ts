import type { K9SakKodeverkBehandling } from '../../generated';
import type { Kodeverk } from '../../../shared/Kodeverk.js';

export type BehandlingType = K9SakKodeverkBehandling['behandlingType'];

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

// Sidan verdiane er litt abstrakte bruker vi namn frå java enum i k9-sak kodebasen som nøkler for denne
type BehandlingTypeName = 'FØRSTEGANGSSØKNAD' | 'REVURDERING' | 'UNNTAKSBEHANDLING' | 'UDEFINERT';

export const behandlingType: Readonly<Record<BehandlingTypeName, BehandlingType>> = {
  FØRSTEGANGSSØKNAD: 'BT-002',
  REVURDERING: 'BT-004',
  UNNTAKSBEHANDLING: 'BT-010',
  UDEFINERT: '-',
};
