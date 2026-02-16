import type { FormidlingClient } from '@k9-sak-web/backend/k9formidling/client/FormidlingClient.ts';
import { avsenderApplikasjon } from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.js';
import { brev_bestillDokument } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9sak/kontrakt/dokument/BestillBrevDto.js';
import { BaseMeldingerBackendClient } from './BaseMeldingerBackendClient.js';
import type { MessagesApi } from './MessagesApi.js';

export default class K9SakMeldingerBackendClient extends BaseMeldingerBackendClient implements MessagesApi {
  readonly backend = 'k9sak';

  constructor(formidlingClient: FormidlingClient) {
    super(avsenderApplikasjon.K9SAK, formidlingClient);
  }

  async bestillDokument(bestilling: BestillBrevDto): Promise<void> {
    await brev_bestillDokument({ body: bestilling });
  }
}
