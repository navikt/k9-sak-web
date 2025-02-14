import type { K9SakClient } from '@k9-sak-web/backend/k9sak/generated';
import type { Behandling } from './types/Behandling';
import type { PerioderMedBehandlingsId } from './types/PerioderMedBehandlingsId';

export default class BehandlingVelgerK9BackendClient {
  #k9sak: K9SakClient;
  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getBehandlingPerioderÅrsaker(behandling: Behandling): Promise<PerioderMedBehandlingsId> {
    return this.#k9sak.perioder.hentPerioderMedVilkårForBehandling(behandling.uuid).then(response => ({
      id: behandling.id,
      perioder: response.perioderMedÅrsak?.perioderTilVurdering ?? [],
      perioderMedÅrsak: response.perioderMedÅrsak?.perioderMedÅrsak ?? [],
    }));
  }
}
