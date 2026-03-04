import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/ungsak/kontrakt/arbeidsforhold/ArbeidsgiverOversiktDto.js';
import type { GetSatsOgUtbetalingPerioderResponse } from '@k9-sak-web/backend/ungsak/tjenester/GetSatsOgUtbetalingPerioderResponse.js';
import type { GetUngdomsprogramInformasjonResponse } from '@k9-sak-web/backend/ungsak/tjenester/GetUngdomsprogramInformasjonResponse.js';
import type { KontrollerInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/KontrollerInntektDto.js';

export type UngBeregningBackendApiType = {
  getSatsOgUtbetalingPerioder(behandlingUuid: string): Promise<GetSatsOgUtbetalingPerioderResponse>;
  getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto>;
  getUngdomsprogramInformasjon(behandlingUuid: string): Promise<GetUngdomsprogramInformasjonResponse>;
  getArbeidsgiverOpplysninger(behandlingUuid: string): Promise<ArbeidsgiverOversiktDto>;
};
