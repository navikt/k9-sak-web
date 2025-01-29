import type { HentPerioderMedVilkårForBehandlingResponse } from '@k9-sak-web/backend/k9sak/generated';
import type { Behandling } from './types/Behandling';

export type BehandlingVelgerBackendApiType = {
  getBehandlingPerioderÅrsaker(behandling: Behandling): Promise<HentPerioderMedVilkårForBehandlingResponse>;
};
