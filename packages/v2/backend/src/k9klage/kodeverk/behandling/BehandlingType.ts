import type { BehandlingDto } from '../../generated';
import type { Kodeverk } from '../../../shared/Kodeverk.js';

export type BehandlingType = BehandlingDto['type'];

export type BehandlingTypeKodeverk = Kodeverk<BehandlingType, 'BEHANDLING_TYPE'>;

// Sidan verdiane er litt abstrakte bruker vi namn frå java enum i k9-klage kodebasen som nøkler for denne
type BehandlingTypeName =
  | 'FØRSTEGANGSSØKNAD'
  | 'KLAGE'
  | 'REVURDERING'
  | 'TILBAKEKREVING'
  | 'REVURDERING_TILBAKEKREVING'
  | 'UDEFINERT';

export const behandlingType: Readonly<Record<BehandlingTypeName, BehandlingType>> = {
  FØRSTEGANGSSØKNAD: 'BT-002',
  KLAGE: 'BT-003',
  REVURDERING: 'BT-004',
  TILBAKEKREVING: 'BT-007',
  REVURDERING_TILBAKEKREVING: 'BT-009',
  UDEFINERT: '-',
};
