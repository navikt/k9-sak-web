import type {
  GetSatsOgUtbetalingPerioderAktivitetspengerResponse,
} from '@k9-sak-web/backend/ungsak/generated/types.js';

export type AktivitetspengerSatsOgUtbetalingBackendApiType = {
  getSatsOgUtbetalingPerioder(behandlingUuid: string): Promise<GetSatsOgUtbetalingPerioderAktivitetspengerResponse>;
};
