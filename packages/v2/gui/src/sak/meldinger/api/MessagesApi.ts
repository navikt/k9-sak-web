import type { FagsakYtelseType } from '@k9-sak-web/backend/combined/kodeverk/behandling/FagsakYtelseType.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/combined/kontrakt/dokument/BestillBrevDto.js';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.ts';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import type { Template } from '@k9-sak-web/backend/k9formidling/models/Template.js';
import type { BackendApi as TredjepartsmottakerBackendApi } from '../TredjepartsmottakerInput.js';

export type LagForhåndsvisningRequest = Omit<ForhåndsvisDto, 'avsenderApplikasjon'>;

export interface MessagesApi extends TredjepartsmottakerBackendApi {
  backend: 'k9sak' | 'k9klage';
  hentInnholdBrevmal(
    fagsakYtelsestype: FagsakYtelseType,
    eksternReferanse: string,
    maltype: string,
  ): Promise<FritekstbrevDokumentdata[]>;
  bestillDokument(bestilling: BestillBrevDto): Promise<void>;
  lagForhåndsvisningPdf(data: LagForhåndsvisningRequest): Promise<Blob>;
  hentMaler(fagsakYtelsestype: FagsakYtelseType, behandlingUuid: string): Promise<Template[]>;
}
