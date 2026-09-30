import type { KvoteInfo } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/KvoteInfo.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface AntallDagerLivetsSluttfaseBackendApiType extends BackendTilhørighet {
  hentKvoteInfo(behandlingUuid: string): Promise<KvoteInfo | null>;
}
