import type { BehandlingVelgerBackendApiType } from '../../sak/behandling-velger/BehandlingVelgerBackendApiType.js';
import type { Behandling } from '../../sak/behandling-velger/types/Behandling.js';
import { type PerioderMedBehandlingsId } from '../../sak/behandling-velger/types/PerioderMedBehandlingsId';

type PerioderUtenId = Omit<PerioderMedBehandlingsId, 'id'>;

export class FakeBehandlingVelgerBackendApi implements BehandlingVelgerBackendApiType {
  readonly #perioderPerBehandlingId: Record<number, PerioderUtenId>;

  constructor(perioderPerBehandlingId: Record<number, PerioderUtenId> = {}) {
    this.#perioderPerBehandlingId = perioderPerBehandlingId;
  }

  async getBehandlingPerioderÅrsaker(behandling: Behandling): Promise<PerioderMedBehandlingsId> {
    const perioder = this.#perioderPerBehandlingId[behandling.id];
    return {
      id: behandling.id,
      perioder: perioder?.perioder ?? [],
      perioderMedÅrsak: perioder?.perioderMedÅrsak ?? [],
    };
  }
}
