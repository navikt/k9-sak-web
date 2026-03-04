import { aksjonspunktCodes as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import type { BekreftedeAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftedeAksjonspunkterDto.js';
import type { BehandlingAvregningBackendApiType } from '../../prosess/avregning/AvregningBackendApiType';

export class FakeBehandlingAvregningBackendApi implements BehandlingAvregningBackendApiType {
  #bekreftAksjonspunktSjekkHøyEtterbetaling: BekreftedeAksjonspunkterDto | undefined;

  async bekreftAksjonspunktSjekkHøyEtterbetaling(
    behandlingId: number,
    behandlingVersjon: number,
    begrunnelse: string,
  ): Promise<void> {
    this.#bekreftAksjonspunktSjekkHøyEtterbetaling = {
      behandlingId: `${behandlingId}`,
      behandlingVersjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
          begrunnelse,
        },
      ],
    };
    console.debug('Bekreftet aksjonspunkt', this.#bekreftAksjonspunktSjekkHøyEtterbetaling);
  }

  get sisteBekreftAksjonspunktResultat() {
    return this.#bekreftAksjonspunktSjekkHøyEtterbetaling;
  }

  reset() {
    this.#bekreftAksjonspunktSjekkHøyEtterbetaling = undefined;
  }
}
