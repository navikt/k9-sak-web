import { behandlingÅrskvantumUttak_getBarnOgRammevedtak } from '@k9-sak-web/backend/k9sak/api/behandlingÅrskvantumUttak.js';
import type { BarnOgRammevedtak, BarnOmsBackendApiType } from './BarnOmsBackendApiType.js';

export class K9SakBarnOmsBackendClient implements BarnOmsBackendApiType {
  readonly backend = 'k9sak';

  async hentBarnOgRammevedtak(behandlingUuid: string): Promise<BarnOgRammevedtak> {
    const { data, response } = await behandlingÅrskvantumUttak_getBarnOgRammevedtak({ query: { behandlingUuid } });
    // 204 betyr at registeropplysninger ikke er innhentet. Generert klient gir da tomt objekt som data.
    if (response.status === 204) {
      return { barn: [], rammevedtak: [] };
    }
    return {
      barn: data?.barn ?? [],
      rammevedtak: data?.rammevedtak ?? [],
    };
  }
}
