import {
  aksjonspunkt_bekreft,
  behandlingfakta_hentFeilutbetalingFakta,
  kodeverk_hentAlleFeilutbetalingÅrsaker,
} from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BehandlingFeilutbetalingFaktaDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTyperPrYtelseTypeDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';
import type { FeilutbetalingFaktaApi } from './FeilutbetalingFaktaApi.js';

export class K9FeilutbetalingFaktaBackendClient implements FeilutbetalingFaktaApi {
  async hentFeilutbetalingFakta(behandlingUuid: string): Promise<BehandlingFeilutbetalingFaktaDto> {
    const response = await behandlingfakta_hentFeilutbetalingFakta({
      query: { uuid: { behandlingId: behandlingUuid } },
    });
    return response.data;
  }

  async hentFeilutbetalingÅrsaker(): Promise<HendelseTyperPrYtelseTypeDto[]> {
    const response = await kodeverk_hentAlleFeilutbetalingÅrsaker();
    return response.data as unknown as HendelseTyperPrYtelseTypeDto[];
  }

  async bekreftAksjonspunkt(
    behandlingUuid: string,
    behandlingVersjon: number,
    aksjonspunkter: BekreftetAksjonspunktDto[],
  ): Promise<void> {
    await aksjonspunkt_bekreft({
      body: {
        behandlingId: { behandlingId: behandlingUuid },
        behandlingVersjon,
        bekreftedeAksjonspunktDtoer: aksjonspunkter,
      },
    });
  }
}
