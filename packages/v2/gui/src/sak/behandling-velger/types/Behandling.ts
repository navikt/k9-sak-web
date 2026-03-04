import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingDto.js';
import type { UngBehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/UngBehandlingDto.js';

export type Behandling = {
  ansvarligSaksbehandler: BehandlingDto['ansvarligSaksbehandler'];
  avsluttet: BehandlingDto['avsluttet'];
  behandlingsresultat: BehandlingDto['behandlingsresultat'];
  behandlingÅrsaker: BehandlingDto['behandlingÅrsaker'] | UngBehandlingDto['behandlingÅrsaker'];
  id: number;
  links: BehandlingDto['links'];
  opprettet: BehandlingDto['opprettet'];
  status: BehandlingDto['status'];
  type: BehandlingDto['type'];
  uuid: BehandlingDto['uuid'];
  sakstype: BehandlingDto['sakstype'];
  visningsnavn?: UngBehandlingDto['visningsnavn'];
};
