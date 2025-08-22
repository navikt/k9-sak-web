import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  type k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { BehandlingAvregningBackendApiType } from '../../prosess/avregning/AvregningBackendApiType';

export class FakeBehandlingAvregningBackendApi implements BehandlingAvregningBackendApiType {
  #bekreftAksjonspunktSjekkHøyEtterbetaling: k9_sak_kontrakt_aksjonspunkt_BekreftedeAksjonspunkterDto | undefined;

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
