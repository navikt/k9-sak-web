import type { k9_kodeverk_behandling_FagsakStatus as FagsakStatus } from '../../generated/types.js';
import type { Kodeverk } from '../../../shared/Kodeverk.js';

export { k9_kodeverk_behandling_FagsakStatus as fagsakStatus } from '../../generated/types.js';
export type { FagsakStatus };

export type FagsakStatusKodeverk = Kodeverk<FagsakStatus, 'FAGSAK_STATUS'>;
