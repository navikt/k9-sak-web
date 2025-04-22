import type { BekreftData } from '@k9-sak-web/backend/k9sak/generated';
import type { BehandlingAvregningBackendApiType } from '../../prosess/avregning/AvregningBackendApiType';

export class FakeBehandlingAvregningBackendApi implements BehandlingAvregningBackendApiType {
  #bekreftAksjonspunkt: BekreftData['requestBody'] | undefined;

  async bekreftAksjonspunkt(requestBody: BekreftData['requestBody']) {
    console.log('Bekreft aksjonspunkt', requestBody);
    this.#bekreftAksjonspunkt = requestBody;
  }

  get sisteBekreftAksjonspunktResultat() {
    return this.#bekreftAksjonspunkt;
  }

  reset() {
    this.#bekreftAksjonspunkt = undefined;
  }
}
