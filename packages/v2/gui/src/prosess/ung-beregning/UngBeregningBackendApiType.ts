import type {
  GetSatsOgUtbetalingPerioderResponse,
  GetUngdomsprogramInformasjonResponse,
  KontrollerInntektDto,
} from '@k9-sak-web/backend/ungsak/generated';

export type UngBeregningBackendApiType = {
  getSatser(behandlingUuid: string): Promise<GetSatsOgUtbetalingPerioderResponse>;
  getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto>;
  getUngdomsprogramInformasjon(behandlingUuid: string): Promise<GetUngdomsprogramInformasjonResponse>;
};
