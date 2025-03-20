import type { UngdomsytelseSatsPeriodeDto } from '@k9-sak-web/backend/ungsak/generated';

export type UngBeregningBackendApiType = {
  getSatser(behandlingUuid: string): Promise<UngdomsytelseSatsPeriodeDto[]>;
};
