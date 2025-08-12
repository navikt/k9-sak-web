import { k9_sak_kontrakt_behandling_BehandlingsresultatDto as BehandlingsresultatDto } from '@navikt/k9-sak-typescript-client';

export type BeregningResultat = BehandlingsresultatDto & {
  antallBarn?: number;
};
