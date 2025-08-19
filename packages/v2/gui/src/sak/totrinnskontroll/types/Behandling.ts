import type { klage_kontrakt_behandling_BehandlingDto as KlageBehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import type { k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto } from '@k9-sak-web/backend/k9sak/generated';

export type Behandling = {
  behandlingsresultat: BehandlingDto['behandlingsresultat'];
  status: BehandlingDto['status'];
  toTrinnsBehandling: BehandlingDto['toTrinnsBehandling'];
  type: BehandlingDto['type'] | KlageBehandlingDto['type'];
};
