import {
  arbeidsgiver_getArbeidsgiverOpplysninger,
  kontroll_hentKontrollerInntekt,
  ung_getSatsOgUtbetalingPerioder,
  ung_getUngdomsprogramInformasjon,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type {
  GetArbeidsgiverOpplysningerResponses,
  GetSatsOgUtbetalingPerioderResponse,
  GetUngdomsprogramInformasjonResponse,
  ung_sak_kontrakt_kontroll_KontrollerInntektDto as KontrollerInntektDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export default class UngBeregningBackendClient {
  async getSatsOgUtbetalingPerioder(behandlingUuid: string): Promise<GetSatsOgUtbetalingPerioderResponse> {
    return (await ung_getSatsOgUtbetalingPerioder({ query: { behandlingUuid } })).data;
  }

  async getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto> {
    return (await kontroll_hentKontrollerInntekt({ query: { behandlingUuid } })).data;
  }

  async getUngdomsprogramInformasjon(behandlingUuid: string): Promise<GetUngdomsprogramInformasjonResponse> {
    return (await ung_getUngdomsprogramInformasjon({ query: { behandlingUuid } })).data;
  }
  async getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<GetArbeidsgiverOpplysningerResponses> {
    return (await arbeidsgiver_getArbeidsgiverOpplysninger({ query: { behandlingUuid } })).data;
  }
}
