import type { AvsenderApplikasjon } from '@k9-sak-web/backend/k9formidling/models/AvsenderApplikasjon.js';
import type { ForhåndsvisDto } from '@k9-sak-web/backend/k9formidling/models/ForhåndsvisDto.js';
import type { FritekstbrevDokumentdata } from '@k9-sak-web/backend/k9formidling/models/FritekstbrevDokumentdata.js';
import type { sak_kontrakt_dokument_BestillBrevDto as BestillBrevDto } from '@k9-sak-web/backend/k9sak/generated';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import {
  requestIntentionallyAborted,
  type RequestIntentionallyAborted,
} from '@k9-sak-web/backend/shared/RequestIntentionallyAborted.js';
import type { EregOrganizationLookupResponse } from '@k9-sak-web/gui/sak/meldinger/EregOrganizationLookupResponse.js';
import type { BackendApi } from '@k9-sak-web/gui/sak/meldinger/Messages.js';
import { action } from 'storybook/actions';
import { delay } from '../../utils/delay.js';
import { fakePdf } from './fakePdf.js';

export class FakeMessagesBackendApi implements BackendApi {
  public static readonly dummyMalinnhold = [
    { tittel: 'Varsel nr 1', fritekst: 'Hei, du må sende inn ditt og datt før frist.' },
    { tittel: 'Varsel nr 2', fritekst: 'Brev tekst forslag nr 2.' },
  ];

  // Some state for storybook testing
  public fakeDelayMillis = 800; // Set this to zero when running in storybook play
  #sisteFakeDokumentBestilling: BestillBrevDto | undefined;

  reset() {
    this.fakeDelayMillis = 800;
    this.resetSisteFakeDokumentBestilling();
  }

  async hentInnholdBrevmal(
    sakstype: FagsakYtelsesType,
    eksternReferanse: string,
    avsenderApplikasjon: AvsenderApplikasjon,
    maltype: string,
  ): Promise<FritekstbrevDokumentdata[]> {
    const x = eksternReferanse + sakstype + avsenderApplikasjon; // For å unngå unused variable feil
    if (x !== null && maltype === 'INNHENT_MEDISINSKE_OPPLYSNINGER') {
      return FakeMessagesBackendApi.dummyMalinnhold;
    }
    return [];
  }

  async getBrevMottakerinfoEreg(
    orgnr: string,
    abort?: AbortSignal,
  ): Promise<EregOrganizationLookupResponse | RequestIntentionallyAborted> {
    if (abort?.aborted) {
      return requestIntentionallyAborted;
    }
    if (orgnr.trim().length === 9) {
      if (Number.isFinite(Number(orgnr.trim()))) {
        if (orgnr.trim() === '000000000') {
          // To test what happens when orgnr is not found
          return { notFound: true };
        }
        if (orgnr.trim() === '999999999') {
          // To test what happens when orgnr is opphørt
          return { name: `Fake konkurs firma (${orgnr.trim()})`, utilgjengelig: 'ORG_OPPHØRT' };
        }
        return { name: `Fake storybook org (${orgnr.trim()})` };
      }
    }
    return { invalidOrgnum: true };
  }

  private async doDelay() {
    if (this.fakeDelayMillis > 0) await delay(this.fakeDelayMillis);
  }

  get sisteFakeDokumentBestilling() {
    return this.#sisteFakeDokumentBestilling;
  }
  resetSisteFakeDokumentBestilling() {
    this.#sisteFakeDokumentBestilling = undefined;
  }

  async bestillDokument(bestilling: BestillBrevDto): Promise<void> {
    this.#sisteFakeDokumentBestilling = bestilling;
    await this.doDelay();
    action('bestillDokument')(bestilling);
  }

  async lagForhåndsvisningPdf(data: ForhåndsvisDto): Promise<Blob> {
    action('lag pdf data')(data);
    await this.doDelay();
    return fakePdf();
  }
}
