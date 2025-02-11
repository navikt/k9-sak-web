import type { Behandling } from './types/Behandling';
import type { PerioderMedBehandlingsId } from './types/PerioderMedBehandlingsId';

export type BehandlingVelgerBackendApiType = {
  getBehandlingPerioderÅrsaker(behandling: Behandling): Promise<PerioderMedBehandlingsId>;
};
