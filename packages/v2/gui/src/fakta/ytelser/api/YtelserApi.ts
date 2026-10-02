import type { RelatertYtelseResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/RelatertYtelseResponse.js';
import type { BackendTilhørighet } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export interface YtelserApi extends BackendTilhørighet {
  hentYtelser(behandlingUuid: string): Promise<RelatertYtelseResponse[]>;
}
