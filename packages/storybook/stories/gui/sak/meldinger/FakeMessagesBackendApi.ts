import type { BackendApi } from '@k9-sak-web/gui/sak/meldinger/Messages.js';
import { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import { EregOrganizationLookupResponse } from '@k9-sak-web/gui/sak/meldinger/EregOrganizationLookupResponse.js';
import type { BestillBrevDto } from '@k9-sak-web/backend/k9sak/generated';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import { action } from '@storybook/addon-actions';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { fakePdf } from '../../../mocks/fakePdf.js';

// XXX Should be moved out somewhere so other fake implementations can use it
const sleep = timeMs =>
  new Promise(resolve => {
    setTimeout(resolve, timeMs);
  });

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
    abort.addEventListener('abort', () => {
      throw abort.reason;
    });
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
    await sleep(1_400);
    action('bestillDokument')(bestilling);
  }

  async forhåndsvis(data: ForhåndsvisDto): Promise<Blob> {
    await sleep(1_000);
    return fakePdf();
  }
}
