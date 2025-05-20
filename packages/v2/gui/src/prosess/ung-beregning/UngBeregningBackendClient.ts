import type {
  GetSatsOgUtbetalingPerioderResponse,
  GetUngdomsprogramInformasjonResponse,
  KontrollerInntektDto,
  UngSakClient,
} from '@k9-sak-web/backend/ungsak/generated';

export default class UngBeregningBackendClient {
  #ungsak: UngSakClient;

  constructor(ungsakClient: UngSakClient) {
    this.#ungsak = ungsakClient;
  }

  async getSatser(behandlingUuid: string): Promise<GetSatsOgUtbetalingPerioderResponse> {
    return this.#ungsak.ung.getSatsOgUtbetalingPerioder(behandlingUuid);
  }

  async getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto> {
    return this.#ungsak.kontroll.hentKontrollerInntekt(behandlingUuid);
  }

  async getUngdomsprogramInformasjon(behandlingUuid: string): Promise<GetUngdomsprogramInformasjonResponse> {
    return this.#ungsak.ung.getUngdomsprogramInformasjon(behandlingUuid);
  }
}
