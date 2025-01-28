import type { HentPerioderMedVilkårForBehandlingResponse } from '@k9-sak-web/backend/k9sak/generated';

export class FakeBehandlingVelgerBackendApi {
  async getBehandlingPerioderÅrsaker(): Promise<HentPerioderMedVilkårForBehandlingResponse> {
    return { perioderMedÅrsak: {} };
  }
}
