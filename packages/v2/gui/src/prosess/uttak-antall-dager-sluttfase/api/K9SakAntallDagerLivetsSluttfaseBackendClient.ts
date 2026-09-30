import type { KvoteInfo } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/KvoteInfo.js';
import { behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder } from '@k9-sak-web/backend/k9sak/sdk/AntallDagerLivetsSluttfaseSdk.js';
import type { AntallDagerLivetsSluttfaseBackendApiType } from './AntallDagerLivetsSluttfaseBackendApiType.js';

export class K9SakAntallDagerLivetsSluttfaseBackendClient implements AntallDagerLivetsSluttfaseBackendApiType {
  readonly backend = 'k9sak';

  async hentKvoteInfo(behandlingUuid: string): Promise<KvoteInfo | null> {
    const response = await behandlingPleiepengerUttak_uttaksplanMedUtsattePerioder({ query: { behandlingUuid } });
    // Backend svarer uten innhold når uttaksplan ikke finnes ennå
    return response.data?.uttaksplan?.kvoteInfo ?? null;
  }
}
