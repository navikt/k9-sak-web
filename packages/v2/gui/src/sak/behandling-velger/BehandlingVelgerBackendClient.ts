import type { HentPerioderMedVilkårForBehandlingResponse, K9SakClient } from '@k9-sak-web/backend/k9sak/generated';
import type { Behandling } from './types/Behandling';

export default class BehandlingVelgerBackendClient {
  #k9sak: K9SakClient;
  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getBehandlingPerioderÅrsaker(behandling: Behandling): Promise<HentPerioderMedVilkårForBehandlingResponse> {
    return this.#k9sak.perioder.hentPerioderMedVilkårForBehandling(`${behandling.uuid}`);
  }
}
