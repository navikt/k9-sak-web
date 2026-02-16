import type { FormidlingClient } from '@k9-sak-web/backend/k9formidling/client/FormidlingClient.js';
import { avsenderApplikasjon } from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.js';
import { brev_bestillDokument } from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9klage/kontrakt/dokument/BestillBrevDto.js';
import { BaseMeldingerBackendClient } from './BaseMeldingerBackendClient.js';
import type { MessagesApi } from './MessagesApi.js';

export class K9KlageMeldingerBackendClient extends BaseMeldingerBackendClient implements MessagesApi {
  readonly backend = 'k9klage';

  constructor(formidlingClient: FormidlingClient) {
    super(avsenderApplikasjon.K9KLAGE, formidlingClient);
  }

  async bestillDokument(bestilling: BestillBrevDto): Promise<void> {
    await brev_bestillDokument({ body: bestilling });
  }
}
