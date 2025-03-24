import type { BehandlingType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';

export type Behandling = {
  id: number;
  versjon: number;
  type: BehandlingType;
};
