import type { SatserData } from './SatserData';

export type UngBeregningBackendApiType = {
  getSatser(behandlingUuid: string): Promise<SatserData[]>;
};
