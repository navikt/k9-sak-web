import {
  getArbeidsgiverOpplysninger,
  hentKontrollerInntekt,
  getSatsOgUtbetalingPerioder,
  getUngdomsprogramInformasjon,
} from '@k9-sak-web/backend/ungsak/sdk.js';
import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/ungsak/kontrakt/arbeidsforhold/ArbeidsgiverOversiktDto.js';
import type { GetSatsOgUtbetalingPerioderResponse } from '@k9-sak-web/backend/ungsak/tjenester/GetSatsOgUtbetalingPerioderResponse.js';
import type { GetUngdomsprogramInformasjonResponse } from '@k9-sak-web/backend/ungsak/tjenester/GetUngdomsprogramInformasjonResponse.js';
import type { KontrollerInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/KontrollerInntektDto.js';

export default class UngBeregningBackendClient {
  async getSatsOgUtbetalingPerioder(behandlingUuid: string): Promise<GetSatsOgUtbetalingPerioderResponse> {
    return (await getSatsOgUtbetalingPerioder({ query: { behandlingUuid } })).data;
  }

  async getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto> {
    return (await hentKontrollerInntekt({ query: { behandlingUuid } })).data;
  }

  async getUngdomsprogramInformasjon(behandlingUuid: string): Promise<GetUngdomsprogramInformasjonResponse> {
    return (await getUngdomsprogramInformasjon({ query: { behandlingUuid } })).data;
  }
  async getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<ArbeidsgiverOversiktDto> {
    return (await getArbeidsgiverOpplysninger({ query: { behandlingUuid } })).data;
  }
}
