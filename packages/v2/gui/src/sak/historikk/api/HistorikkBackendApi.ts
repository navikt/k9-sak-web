import type { BeriketHistorikkInnslag } from '../historikkTypeBerikning.js';

export interface HistorikkBackendApi {
  hentAlleInnslagK9sak(saksnummer: string): Promise<BeriketHistorikkInnslag[]>;
  hentAlleInnslagK9klage(saksnummer: string): Promise<BeriketHistorikkInnslag[]>;
  hentAlleInnslagK9tilbake(saksnummer: string): Promise<BeriketHistorikkInnslag[]>;
}
