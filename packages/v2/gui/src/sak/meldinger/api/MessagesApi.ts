import type { BackendApi as TredjepartsmottakerBackendApi } from '../TredjepartsmottakerInput.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9sak/kontrakt/dokument/BestillBrevDto.js';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.ts';
import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';

export type LagForhåndsvisningRequest = Omit<ForhåndsvisDto, 'avsenderApplikasjon'>;

export interface MessagesApi extends TredjepartsmottakerBackendApi {
  backend: 'k9sak' | 'k9klage';
  hentInnholdBrevmal(
    fagsakYtelsestype: FagsakYtelsesType,
    eksternReferanse: string,
    maltype: string,
  ): Promise<FritekstbrevDokumentdata[]>;
  bestillDokument(bestilling: BestillBrevDto): Promise<void>;
  lagForhåndsvisningPdf(data: LagForhåndsvisningRequest): Promise<Blob>;
  hentMaler(fagsakYtelsestype: FagsakYtelsesType, behandlingUuid: string): Promise<Template[]>;
}
