import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/ungsak/kontrakt/arbeidsforhold/ArbeidsgiverOversiktDto.js';
import type { KontrollerInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/KontrollerInntektDto.js';

export type AktivitetspengerBeregningBackendApiType = {
  getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto>;
  getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<ArbeidsgiverOversiktDto>;
};
