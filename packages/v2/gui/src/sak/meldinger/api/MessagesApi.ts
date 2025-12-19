import type { BackendApi as TredjepartsmottakerBackendApi } from '../TredjepartsmottakerInput.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { AvsenderApplikasjon } from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.js';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9sak/kontrakt/dokument/BestillBrevDto.js';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.ts';
import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';

export interface MessagesApi extends TredjepartsmottakerBackendApi {
  backend: 'k9sak';
  hentInnholdBrevmal(
    fagsakYtelsestype: FagsakYtelsesType,
    eksternReferanse: string,
    avsenderApplikasjon: AvsenderApplikasjon,
    maltype: string,
  ): Promise<FritekstbrevDokumentdata[]>;
  bestillDokument(bestilling: BestillBrevDto): Promise<void>;
  lagForhåndsvisningPdf(data: ForhåndsvisDto): Promise<Blob>;
  hentMaler(
    fagsakYtelsestype: FagsakYtelsesType,
    behandlingUuid: string,
    avsenderApplikasjon: AvsenderApplikasjon,
  ): Promise<Template[]>;
}
