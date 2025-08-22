import type { Behandling } from './types/Behandling';
import type { PerioderMedBehandlingsId } from './types/PerioderMedBehandlingsId';
import { perioder_hentPerioderMedVilkårForBehandling as k9sak_perioder_hentPerioderMedVilkårForBehandling } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { perioder_hentPerioderMedVilkårForBehandling as ungsak_perioder_hentPerioderMedVilkårForBehandling } from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import { k9SakOrUngSak, type K9SakOrUngSak } from '../../utils/multibackend.js';

export default class BehandlingVelgerBackendClient {
  #backendChoice: K9SakOrUngSak;
  constructor(backendChoice: K9SakOrUngSak) {
    this.#backendChoice = backendChoice;
  }

  async getBehandlingPerioderÅrsaker(behandling: Behandling): Promise<PerioderMedBehandlingsId> {
    const data =
      this.#backendChoice == k9SakOrUngSak.ungSak
        ? (await ungsak_perioder_hentPerioderMedVilkårForBehandling({ query: { behandlingUuid: behandling.uuid } }))
            .data
        : (await k9sak_perioder_hentPerioderMedVilkårForBehandling({ query: { behandlingUuid: behandling.uuid } }))
            .data;

    return {
      id: behandling.id,
      perioder: data.perioderMedÅrsak.perioderTilVurdering ?? [],
      perioderMedÅrsak: data.perioderMedÅrsak.perioderMedÅrsak ?? [],
    };
  }
}
