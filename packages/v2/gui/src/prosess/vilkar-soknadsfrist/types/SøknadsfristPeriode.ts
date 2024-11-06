import type { VilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';

export type SøknadsfristPeriode = {
  periode: {
    fom: string;
    tom: string;
  };
  status?: VilkårStatus;
};
