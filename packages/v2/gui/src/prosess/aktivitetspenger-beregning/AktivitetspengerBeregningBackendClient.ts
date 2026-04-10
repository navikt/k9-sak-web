import {
  arbeidsgiver_getArbeidsgiverOpplysninger,
  kontroll_hentKontrollerInntekt,
} from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import type {
  ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  ung_sak_kontrakt_kontroll_KontrollerInntektDto as KontrollerInntektDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import type { AktivitetspengerBeregningBackendApiType } from './AktivitetspengerBeregningBackendApiType';

export class AktivitetspengerBeregningBackendClient implements AktivitetspengerBeregningBackendApiType {
  async getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto> {
    return (await kontroll_hentKontrollerInntekt({ query: { behandlingUuid } })).data;
  }

  async getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<ArbeidsgiverOversiktDto> {
    return (await arbeidsgiver_getArbeidsgiverOpplysninger({ query: { behandlingUuid } })).data;
  }
}
