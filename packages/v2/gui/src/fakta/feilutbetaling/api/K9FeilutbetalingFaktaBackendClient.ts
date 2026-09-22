import {
  behandlingfakta_hentFeilutbetalingFakta,
  kodeverk_hentAlleFeilutbetalingÅrsaker,
} from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import type { BehandlingFeilutbetalingFaktaDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTyperPrYtelseTypeDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';
import type { FeilutbetalingFaktaApi } from './FeilutbetalingFaktaApi.js';

export class K9FeilutbetalingFaktaBackendClient implements FeilutbetalingFaktaApi {
  readonly backend = 'k9tilbake' as const;

  async hentFeilutbetalingFakta(behandlingUuid: string): Promise<BehandlingFeilutbetalingFaktaDto> {
    const response = await behandlingfakta_hentFeilutbetalingFakta({
      query: { uuid: { behandlingId: behandlingUuid } },
    });
    return response.data;
  }

  async hentFeilutbetalingÅrsaker(): Promise<HendelseTyperPrYtelseTypeDto[]> {
    const response = await kodeverk_hentAlleFeilutbetalingÅrsaker();
    if (!Array.isArray(response.data)) {
      throw new Error('Feilutbetaling årsaker-endepunktet returnerte ikke en liste');
    }
    return response.data as unknown as HendelseTyperPrYtelseTypeDto[];
  }
}
