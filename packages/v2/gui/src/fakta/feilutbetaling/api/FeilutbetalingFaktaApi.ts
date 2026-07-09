import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BehandlingFeilutbetalingFaktaDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTyperPrYtelseTypeDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';

export interface FeilutbetalingFaktaApi {
  hentFeilutbetalingFakta(behandlingUuid: string): Promise<BehandlingFeilutbetalingFaktaDto>;
  hentFeilutbetalingÅrsaker(): Promise<HendelseTyperPrYtelseTypeDto[]>;
  bekreftAksjonspunkt(
    behandlingUuid: string,
    behandlingVersjon: number,
    aksjonspunkter: BekreftetAksjonspunktDto[],
  ): Promise<void>;
}
