import type {
  GetUngdomsprogramInformasjonResponse,
  KontrollerInntektDto,
  UngdomsytelseSatsPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated';

export type UngBeregningBackendApiType = {
  getSatser(behandlingUuid: string): Promise<UngdomsytelseSatsPeriodeDto[]>;
  getKontrollerInntekt(behandlingUuid: string): Promise<KontrollerInntektDto>;
  getUngdomsprogramInformasjon(behandlingUuid: string): Promise<GetUngdomsprogramInformasjonResponse>;
};
