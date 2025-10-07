import { arbeidsgiver_getArbeidsgiverOpplysninger } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import type { k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import {
  kontroll_hentKontrollerInntekt,
  ung_getSatsOgUtbetalingPerioder,
  ung_getUngdomsprogramInformasjon,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type {
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
  async getArbeidsgiverOpplysninger(
    behandlingUuid: string,
  ): Promise<k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto> {
    return (await arbeidsgiver_getArbeidsgiverOpplysninger({ query: { behandlingUuid } })).data;
  }
}
