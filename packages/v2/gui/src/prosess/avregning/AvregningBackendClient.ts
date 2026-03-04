import type { BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import { bekreftAksjonspunkt } from '@k9-sak-web/backend/k9sak/sdk.js';
import { aksjonspunktCodes as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';

export default class BehandlingAvregningBackendClient {
  async bekreftAksjonspunktSjekkHøyEtterbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
  ): Promise<void> {
    const body: BekreftedeAksjonspunkterDto = {
      behandlingId: `${behandlingId}`,
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
          begrunnelse,
        },
      ],
    };
    await bekreftAksjonspunkt({ body });
  }
}
