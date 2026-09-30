import {
  behandlingfakta_hentFeilutbetalingFakta,
  kodeverk_hentAlleFeilutbetalingÅrsaker,
} from '@k9-sak-web/backend/ungtilbake/api/feilutbetaling.js';
import type { FeilutbetalingFaktaApi } from './FeilutbetalingFaktaApi.js';
import type {
  FeilutbetalingFaktaViewModel,
  FeilutbetalingÅrsakerPerYtelseViewModel,
} from './FeilutbetalingFaktaViewModel.js';
import { backendNavn } from '@k9-sak-web/gui/utils/BackendTilhørighet.js';

export class UngTilbakeFeilutbetalingFaktaBackendClient implements FeilutbetalingFaktaApi {
  readonly backend = backendNavn.ungtilbake;

  async hentFeilutbetalingFakta(behandlingUuid: string): Promise<FeilutbetalingFaktaViewModel> {
    const response = await behandlingfakta_hentFeilutbetalingFakta({
      query: { behandlingUuid },
    });
    return response.data;
  }

  async hentFeilutbetalingÅrsaker(): Promise<FeilutbetalingÅrsakerPerYtelseViewModel[]> {
    const response = await kodeverk_hentAlleFeilutbetalingÅrsaker();
    return response.data;
  }
}
