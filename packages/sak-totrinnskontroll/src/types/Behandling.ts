import { BehandlingDto } from '@navikt/k9-sak-typescript-client';

export type Behandling = {
  status: BehandlingDto['status'];
  toTrinnsBehandling: BehandlingDto['toTrinnsBehandling'];
  type: BehandlingDto['type'];
};
