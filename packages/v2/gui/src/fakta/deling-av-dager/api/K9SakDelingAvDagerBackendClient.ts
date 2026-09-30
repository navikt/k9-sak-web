import { behandlingÅrskvantumUttak_getForbrukteDager } from '@k9-sak-web/backend/k9sak/api/behandlingÅrskvantumUttak.js';
import type { RammevedtakDto } from '@k9-sak-web/backend/k9sak/kontrakt/omsorgspenger/RammevedtakDto.js';
import type { DelingAvDagerApi } from './DelingAvDagerApi.js';

export class K9SakDelingAvDagerBackendClient implements DelingAvDagerApi {
  readonly backend = 'k9sak';

  async hentRammevedtak(behandlingUuid: string): Promise<RammevedtakDto[]> {
    const response = await behandlingÅrskvantumUttak_getForbrukteDager({
      query: { behandlingUuid },
    });
    // Backend svarer 204 uten innhold når årskvantum ikke er fastsatt
    if (!response.data) {
      return [];
    }
    return response.data.rammevedtak ?? [];
  }
}
