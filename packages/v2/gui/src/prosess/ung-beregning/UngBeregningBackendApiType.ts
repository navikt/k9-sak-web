import type { UngdomsytelseSatsPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';

export type UngBeregningBackendApiType = {
  getSatser(behandlingUuid: string): Promise<UngdomsytelseSatsPeriodeDto[]>;
};
