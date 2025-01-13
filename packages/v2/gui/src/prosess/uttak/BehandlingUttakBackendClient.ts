import type {
  K9SakClient,
  EgneOverlappendeSakerDto,
  BekreftResponse,
  BekreftData,
} from '@k9-sak-web/backend/k9sak/generated';

export default class BehandlingUttakBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto> {
    return this.#k9sak.behandlingUttak.hentEgneOverlappendeSaker(behandlingUuid);
  }

  async bekreftAksjonspunkt(requestBody: BekreftData['requestBody']): Promise<BekreftResponse> {
    return this.#k9sak.aksjonspunkt.bekreft(requestBody);
  }
}
