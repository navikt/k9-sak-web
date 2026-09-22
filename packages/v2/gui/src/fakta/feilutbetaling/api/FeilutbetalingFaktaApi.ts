import type { BehandlingFeilutbetalingFaktaDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTyperPrYtelseTypeDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';

export interface FeilutbetalingFaktaApi {
  readonly backend: 'k9tilbake' | 'ungtilbake';
  hentFeilutbetalingFakta(behandlingUuid: string): Promise<BehandlingFeilutbetalingFaktaDto>;
  hentFeilutbetalingÅrsaker(): Promise<HendelseTyperPrYtelseTypeDto[]>;
}
