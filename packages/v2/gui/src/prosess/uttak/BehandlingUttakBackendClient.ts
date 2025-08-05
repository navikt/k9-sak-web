import type {
  K9SakClient,
  EgneOverlappendeSakerDto,
  BekreftResponse,
  BekreftData,
  GetOverstyrtUttakResponse,
  OverstyrbareUttakAktiviterDto,
  OverstyrbareAktiviteterForUttakRequest,
} from '@k9-sak-web/backend/k9sak/generated';
import type { OverstyringUttakRequest } from './types/OverstyringUttakTypes';

export default class BehandlingUttakBackendClient {
  #k9sak: K9SakClient;

  constructor(k9sakClient: K9SakClient) {
    this.#k9sak = k9sakClient;
  }

  async getEgneOverlappendeSaker(behandlingUuid: string): Promise<EgneOverlappendeSakerDto> {
    return (await this.#k9sak.behandlingUttak.hentEgneOverlappendeSaker(behandlingUuid)) ?? null;
  }

  async bekreftAksjonspunkt(requestBody: BekreftData['requestBody']): Promise<BekreftResponse> {
    return this.#k9sak.aksjonspunkt.bekreft(requestBody);
  }

  async hentOverstyringUttak(behandlingUuid: string): Promise<GetOverstyrtUttakResponse> {
    const result = await this.#k9sak.behandlingUttak.getOverstyrtUttak(behandlingUuid);
    return result ?? { overstyringer: [] };
  }

  async hentAktuelleAktiviteter(
    behandlingUuid: OverstyrbareAktiviteterForUttakRequest['behandlingIdDto'],
    fom: OverstyrbareAktiviteterForUttakRequest['fom'],
    tom: OverstyrbareAktiviteterForUttakRequest['tom'],
  ): Promise<OverstyrbareUttakAktiviterDto> {
    return this.#k9sak.behandlingUttak.hentOverstyrbareAktiviterForUttak({
      behandlingIdDto: behandlingUuid,
      fom,
      tom,
    });
  }

  async overstyringUttak(requestBody: OverstyringUttakRequest): Promise<BekreftResponse> {
    return this.#k9sak.aksjonspunkt.overstyr(requestBody);
  }
}
