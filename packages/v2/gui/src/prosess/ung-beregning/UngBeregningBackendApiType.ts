import type { k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type {
  GetSatsOgUtbetalingPerioderResponse,
  GetUngdomsprogramInformasjonResponse,
  ung_sak_kontrakt_kontroll_KontrollerInntektDto as KontrollerInntektDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export type UngBeregningBackendApiType = {
  getSatsOgUtbetalingPerioder(behandlingUuid: string): Promise<GetSatsOgUtbetalingPerioderResponse>;
  getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto>;
  getUngdomsprogramInformasjon(behandlingUuid: string): Promise<GetUngdomsprogramInformasjonResponse>;
  getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto>;
};
