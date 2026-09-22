import type { RelatertYtelseResponse } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/RelatertYtelseResponse.js';

export interface YtelserApi {
  hentYtelser(behandlingUuid: string): Promise<RelatertYtelseResponse[]>;
}
