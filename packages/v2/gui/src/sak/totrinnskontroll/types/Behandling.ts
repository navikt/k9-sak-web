import type { BehandlingDto } from '@navikt/k9-sak-typescript-client';

export type Behandling = {
  behandlingsresultat: BehandlingDto['behandlingsresultat'];
  status: BehandlingDto['status'];
  toTrinnsBehandling: BehandlingDto['toTrinnsBehandling'];
  type: BehandlingDto['type'];
};
