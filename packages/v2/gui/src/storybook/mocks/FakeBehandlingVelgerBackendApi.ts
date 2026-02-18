import { type PerioderMedBehandlingsId } from '../../sak/behandling-velger/types/PerioderMedBehandlingsId';

export class FakeBehandlingVelgerBackendApi {
  async getBehandlingPerioderÅrsaker(): Promise<PerioderMedBehandlingsId> {
    return { perioderMedÅrsak: [], perioder: [], id: 1 };
  }
}
