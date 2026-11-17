import { behandlingType as k9BehandlingTypes } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import type { BehandlingType as K9BehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';

export type ProsessBehandling = Readonly<{
  id: number;
  uuid: string;
  versjon: number;
  type: Readonly<{ kode: string }>;
}>;

export const hentK9BehandlingType = (kode: string): K9BehandlingType => {
  const behandlingType = Object.values(k9BehandlingTypes).find(type => type === kode);
  if (behandlingType === undefined) {
    throw new Error('Ukjent K9-behandlingstype: ' + kode);
  }
  return behandlingType;
};
