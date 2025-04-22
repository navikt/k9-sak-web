import type { K9SakClient, BekreftResponse, BekreftData } from '@k9-sak-web/backend/k9sak/generated';

export default class BehandlingAvregningBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async bekreftAksjonspunkt(requestBody: BekreftData['requestBody']): Promise<BekreftResponse> {
    return this.#k9sak.aksjonspunkt.bekreft(requestBody);
  }
}
