import type { BehandlingDto as KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { BehandlingDto } from '@navikt/k9-sak-typescript-client';

export type Behandling = {
  behandlingsresultat: BehandlingDto['behandlingsresultat'];
  status: BehandlingDto['status'];
  toTrinnsBehandling: BehandlingDto['toTrinnsBehandling'];
  type: BehandlingDto['type'] | KlageBehandlingDto['type'];
};
