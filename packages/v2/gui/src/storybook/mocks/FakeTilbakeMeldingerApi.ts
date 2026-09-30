import type { BrevmalDto } from '@k9-sak-web/backend/combined/tilbakekreving/dokumentbestilling/BrevmalDto.js';
import type {
  TilbakeBestillBrevDto,
  TilbakeMeldingerApi,
} from '@k9-sak-web/gui/sak/meldinger/tilbake/api/TilbakeMeldingerApi.js';
import { action } from 'storybook/actions';
import { delay } from '../../utils/delay.js';
import { fakePdf } from './fakePdf.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export class FakeTilbakeMeldingerApi implements TilbakeMeldingerApi {
  readonly backend = backendNavn.k9tilbake;

  // State for storybook testing
  public fakeDelayMillis = 800;
  #sisteFakeDokumentBestilling: TilbakeBestillBrevDto | undefined;

  reset() {
    this.fakeDelayMillis = 800;
    this.resetSisteFakeDokumentBestilling();
  }

  get sisteFakeDokumentBestilling() {
    return this.#sisteFakeDokumentBestilling;
  }

  resetSisteFakeDokumentBestilling() {
    this.#sisteFakeDokumentBestilling = undefined;
  }

  private async doDelay() {
    if (this.fakeDelayMillis > 0) await delay(this.fakeDelayMillis);
  }

  async bestillDokument(bestilling: TilbakeBestillBrevDto): Promise<void> {
    this.#sisteFakeDokumentBestilling = bestilling;
    await this.doDelay();
    action('bestillDokument')(bestilling);
  }

  async lagForhåndsvisningPdf(data: TilbakeBestillBrevDto): Promise<Blob> {
    action('lag pdf data')(data);
    await this.doDelay();
    return fakePdf();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async hentMaler(_behandlingUuid: string): Promise<BrevmalDto[]> {
    // Not used in stories, as maler are passed in as props
    return [];
  }
}
