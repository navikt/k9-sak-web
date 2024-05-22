import type { BackendApi } from '@k9-sak-web/gui/sak/meldinger/Messages.js';
import { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import { EregOrganizationLookupResponse } from '@k9-sak-web/gui/sak/meldinger/EregOrganizationLookupResponse.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9sak/generated';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import { action } from '@storybook/addon-actions';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { delay } from '@k9-sak-web/gui/utils/delay.js';
import { fakePdf } from '../../../mocks/fakePdf.js';

export class FakeMessagesBackendApi implements BackendApi {
  async hentInnholdBrevmal(
    sakstype: string,
    eksternReferanse: string,
    maltype: string,
  ): Promise<FritekstbrevDokumentdata[]> {
    if (sakstype === fagsakYtelsesType.OMP && maltype === 'VARSEL_FRITEKST') {
      return [
        { tittel: 'Varsel nr 1', fritekst: 'Hei, du må sende inn ditt og datt før frist.' },
        { tittel: 'Varsel nr 2', fritekst: 'Brev tekst forslag nr 2.' },
      ];
    }
    return [];
  }

  async getBrevMottakerinfoEreg(orgnr: string, abort?: AbortSignal): Promise<EregOrganizationLookupResponse> {
    const abortListenerRemover = new AbortController();
    try {
      await delay(100, abort);
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
    } finally {
      abortListenerRemover.abort();
    }
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
