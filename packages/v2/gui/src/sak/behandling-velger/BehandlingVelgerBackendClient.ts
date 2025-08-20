import type { UngSakClient } from '@k9-sak-web/backend/ungsak/generated';
import type { Behandling } from './types/Behandling';
import type { PerioderMedBehandlingsId } from './types/PerioderMedBehandlingsId';
import { getUngSakClient } from '@k9-sak-web/backend/ungsak/client';
import { perioder_hentPerioderMedVilkårForBehandling as k9sak_perioder_hentPerioderMedVilkårForBehandling } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { k9SakOrUngSak, type K9SakOrUngSak } from '../../utils/multibackend.js';

export default class BehandlingVelgerBackendClient {
  #backendChoice: K9SakOrUngSak;
  #backendClient: UngSakClient | null = null;
  constructor(backendChoice: K9SakOrUngSak) {
    this.#backendChoice = backendChoice;
    if (this.#backendChoice === k9SakOrUngSak.ungSak) {
      this.#backendClient = getUngSakClient();
    }
  }

  async getBehandlingPerioderÅrsaker(behandling: Behandling): Promise<PerioderMedBehandlingsId> {
    const data =
      this.#backendClient != null
        ? await this.#backendClient.perioder.hentPerioderMedVilkårForBehandling(behandling.uuid)
        : (await k9sak_perioder_hentPerioderMedVilkårForBehandling({ query: { behandlingUuid: behandling.uuid } }))
            .data;

    return {
      id: behandling.id,
      perioder: data.perioderMedÅrsak.perioderTilVurdering ?? [],
      perioderMedÅrsak: data.perioderMedÅrsak.perioderMedÅrsak ?? [],
    };
  }
}
