import { k9_sak_kontrakt_behandling_BehandlingsresultatDto as BehandlingsresultatDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export type BeregningResultat = BehandlingsresultatDto & {
  antallBarn?: number;
};
