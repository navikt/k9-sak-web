import type { HentAlleInnslagV2Response } from '@k9-sak-web/backend/k9sak/generated';

export interface HistorikkBackendApi {
  hentAlleInnslagK9sak(saksnummer: string): Promise<HentAlleInnslagV2Response>;
}
