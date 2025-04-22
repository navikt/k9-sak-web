import type { K9SakClient } from '@k9-sak-web/backend/k9sak/generated';
import type { UngSakClient } from '@k9-sak-web/backend/ungsak/generated';
import type { Behandling } from './types/Behandling';
import type { PerioderMedBehandlingsId } from './types/PerioderMedBehandlingsId';

export default class BehandlingVelgerBackendClient {
  #backendClient: UngSakClient | K9SakClient;
  constructor(backendClient: UngSakClient | K9SakClient) {
    this.#backendClient = backendClient;
  }

  async getBehandlingPerioderÅrsaker(behandling: Behandling): Promise<PerioderMedBehandlingsId> {
    return this.#backendClient.perioder.hentPerioderMedVilkårForBehandling(behandling.uuid).then(response => ({
      id: behandling.id,
      perioder: response.perioderMedÅrsak?.perioderTilVurdering ?? [],
      perioderMedÅrsak: response.perioderMedÅrsak?.perioderMedÅrsak ?? [],
    }));
  }
}
