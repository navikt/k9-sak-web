import { BehandlingStatus as K9SakBehandlingStatus } from '../../../k9sak/kodeverk/behandling/BehandlingStatus.js';
import { safeConstCombine } from '../../../typecheck/safeConstCombine.js';
import { BehandlingStatus as UngSakBehandlingStatus } from '../../../ungsak/kodeverk/behandling/BehandlingStatus.js';

export type BehandlingStatus = K9SakBehandlingStatus | UngSakBehandlingStatus;

export const BehandlingStatus = safeConstCombine(K9SakBehandlingStatus, UngSakBehandlingStatus);
