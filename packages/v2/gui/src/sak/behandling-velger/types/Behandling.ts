import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/generated';

export type Behandling = {
  ansvarligSaksbehandler: BehandlingDto['ansvarligSaksbehandler'];
  avsluttet: BehandlingDto['avsluttet'];
  behandlingsresultat: BehandlingDto['behandlingsresultat'];
  id: number;
  links: BehandlingDto['links'];
  opprettet: BehandlingDto['opprettet'];
  status: BehandlingDto['status'];
  type: BehandlingDto['type'];
  uuid: BehandlingDto['uuid'];
  sakstype: BehandlingDto['sakstype'];
};
