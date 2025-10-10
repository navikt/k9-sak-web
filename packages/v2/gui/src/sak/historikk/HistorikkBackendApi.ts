import type {
  KlageHistorikkInnslagV2,
  SakHistorikkInnslagV2,
  TilbakeHistorikkInnslagV2,
} from './historikkTypeBerikning.js';

export interface HistorikkBackendApi {
  hentAlleInnslagK9sak(saksnummer: string): Promise<SakHistorikkInnslagV2[]>;
  hentAlleInnslagK9klage(saksnummer: string): Promise<KlageHistorikkInnslagV2[]>;
  hentAlleInnslagK9tilbake(saksnummer: string): Promise<TilbakeHistorikkInnslagV2[]>;
}
