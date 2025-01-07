import type { BehandlingsresultatDto } from '@k9-sak-web/backend/ungsak/generated';

type Behandlingsresultat = {
  type: BehandlingsresultatDto['type'];
};

export type UngVedtakBehandlingDto = {
  behandlingsresultat: Behandlingsresultat;
  id: number;
};
