import {
  behandlingfakta_hentFeilutbetalingFakta,
  kodeverk_hentAlleFeilutbetalingÅrsaker,
} from '@k9-sak-web/backend/k9tilbake/api/feilutbetaling.js';
import type { FeilutbetalingFaktaApi } from './FeilutbetalingFaktaApi.js';
import type {
  FeilutbetalingFaktaViewModel,
  FeilutbetalingÅrsakerPerYtelseViewModel,
} from './FeilutbetalingFaktaViewModel.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export class K9TilbakeFeilutbetalingFaktaBackendClient implements FeilutbetalingFaktaApi {
  readonly backend = backendNavn.k9tilbake;

  async hentFeilutbetalingFakta(behandlingUuid: string): Promise<FeilutbetalingFaktaViewModel> {
    const response = await behandlingfakta_hentFeilutbetalingFakta({
      query: { uuid: { behandlingId: behandlingUuid } },
    });
    return response.data;
  }

  async hentFeilutbetalingÅrsaker(): Promise<FeilutbetalingÅrsakerPerYtelseViewModel[]> {
    const response = await kodeverk_hentAlleFeilutbetalingÅrsaker();
    return response.data;
  }
}
