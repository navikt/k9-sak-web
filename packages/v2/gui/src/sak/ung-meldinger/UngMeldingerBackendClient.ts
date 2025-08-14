import type {
  BestillInformasjonsbrevResponse,
  ForhåndsvisInformasjonsbrevResponse,
  ung_sak_kontrakt_formidling_informasjonsbrev_InformasjonsbrevBestillingRequest as InformasjonsbrevBestillingRequest,
  InformasjonsbrevValgResponse,
  UngSakClient,
} from '@k9-sak-web/backend/ungsak/generated';

export default class UngMeldingerBackendClient {
  #ungsak: UngSakClient;

  constructor(ungsak: UngSakClient) {
    this.#ungsak = ungsak;
  }

  async hentMaler(behandlingId: number): Promise<InformasjonsbrevValgResponse> {
    return this.#ungsak.formidling.informasjonsbrevValg(`${behandlingId}`);
  }

  async bestillBrev(data: InformasjonsbrevBestillingRequest): Promise<BestillInformasjonsbrevResponse> {
    return this.#ungsak.formidling.bestillInformasjonsbrev(data);
  }

  async forhåndsvisBrev(data: InformasjonsbrevBestillingRequest): Promise<ForhåndsvisInformasjonsbrevResponse> {
    return this.#ungsak.formidling.forhåndsvisInformasjonsbrev(data);
  }
}
