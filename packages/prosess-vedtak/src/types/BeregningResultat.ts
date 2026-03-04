import type { BehandlingsresultatDto } from '@k9-sak-web/backend/k9sak/kontrakt/behandling/BehandlingsresultatDto.js';

export type BeregningResultat = BehandlingsresultatDto & {
  antallBarn?: number;
};
