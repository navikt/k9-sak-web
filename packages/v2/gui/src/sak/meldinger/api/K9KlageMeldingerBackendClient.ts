import type { MessagesApi } from './MessagesApi.js';
import type { FormidlingClient } from '@k9-sak-web/backend/k9formidling/client/FormidlingClient.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9klage/kontrakt/dokument/BestillBrevDto.js';
import { brev_bestillDokument } from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import { avsenderApplikasjon } from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.js';
import { BaseMeldingerBackendClient } from './BaseMeldingerBackendClient.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export class K9KlageMeldingerBackendClient extends BaseMeldingerBackendClient implements MessagesApi {
  readonly backend = backendNavn.k9klage;

  constructor(formidlingClient: FormidlingClient) {
    super(avsenderApplikasjon.K9KLAGE, formidlingClient);
  }

  async bestillDokument(bestilling: BestillBrevDto): Promise<void> {
    await brev_bestillDokument({ body: bestilling });
  }
}
