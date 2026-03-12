import type {
  ung_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
  ung_sak_kontrakt_behandling_BehandlingsresultatDto as BehandlingsresultatDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

type Behandlingsresultat = Pick<BehandlingsresultatDto, 'type'>;

export type UngVedtakBehandlingDto = {
  behandlingsresultat?: Behandlingsresultat;
  id?: number;
  status: BehandlingDto['status'];
};
