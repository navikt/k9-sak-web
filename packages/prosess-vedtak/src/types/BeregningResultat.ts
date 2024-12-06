import { BehandlingsresultatDto } from '@navikt/k9-sak-typescript-client';

export type BeregningResultat = BehandlingsresultatDto & {
  antallBarn?: number;
};
