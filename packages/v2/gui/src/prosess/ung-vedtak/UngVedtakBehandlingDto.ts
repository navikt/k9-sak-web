import type { UngBehandlingDto as BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/UngBehandlingDto.js';
import type { BehandlingsresultatDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingsresultatDto.js';

type Behandlingsresultat = {
  type: BehandlingsresultatDto['type'];
};

export type UngVedtakBehandlingDto = {
  behandlingsresultat: Behandlingsresultat;
  id: number;
  status: BehandlingDto['status'];
};
