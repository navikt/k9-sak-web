import type {
  ung_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  ung_sak_kontrakt_kontroll_KontrollerInntektDto as KontrollerInntektDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export type AktivitetspengerBeregningBackendApiType = {
  getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto>;
  getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<ArbeidsgiverOversiktDto>;
};
