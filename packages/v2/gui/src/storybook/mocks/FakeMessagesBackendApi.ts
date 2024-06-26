import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9sak/generated';
import type { EregOrganizationLookupResponse } from '@k9-sak-web/gui/sak/meldinger/EregOrganizationLookupResponse.js';
import type { BackendApi } from '@k9-sak-web/gui/sak/meldinger/Messages.js';
import { action } from '@storybook/addon-actions';
import type { AvsenderApplikasjon } from "@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.ts";
import { requestIntentionallyAborted, type RequestIntentionallyAborted } from "@k9-sak-web/backend/shared/RequestIntentionallyAborted.ts";
import { fakePdf } from './fakePdf.js';
import { delay } from "../../utils/delay.js";

export class FakeMessagesBackendApi implements BackendApi {
  public static readonly dummyMalinnhold = [
    { tittel: 'Varsel nr 1', fritekst: 'Hei, du må sende inn ditt og datt før frist.' },
    { tittel: 'Varsel nr 2', fritekst: 'Brev tekst forslag nr 2.' },
  ];

  async hentInnholdBrevmal(
    sakstype: string,
    eksternReferanse: string,
    avsenderApplikasjon: AvsenderApplikasjon,
    maltype: string,
  ): Promise<FritekstbrevDokumentdata[]> {
    const x = eksternReferanse + sakstype + avsenderApplikasjon; // For å unngå unused variable feil
    if (x !== null && maltype === 'INNHENT_MEDISINSKE_OPPLYSNINGER') {
      return FakeMessagesBackendApi.dummyMalinnhold
    }
    return [];
  }

  async getBrevMottakerinfoEreg(orgnr: string, abort?: AbortSignal): Promise<EregOrganizationLookupResponse | RequestIntentionallyAborted> {
    if(abort?.aborted) {
      return requestIntentionallyAborted
    }
    if (orgnr.length === 9) {
      if (Number.isFinite(Number(orgnr))) {
        if (orgnr === '000000000') {
          // To test what happens when orgnr is not found
          return { notFound: true };
        }
        return { name: `Fake storybook org (${orgnr})` };
      }
    }
    return { invalidOrgnum: true };
  }

  async bestillDokument(bestilling: BestillBrevDto): Promise<void> {
    await delay(1_400);
    action('bestillDokument')(bestilling);
  }

  async lagForhåndsvisningPdf(data: ForhåndsvisDto): Promise<Blob> {
    action('lag pdf data')(data);
    await delay(1_000);
    return fakePdf();
  }
}
