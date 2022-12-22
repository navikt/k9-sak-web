import { Period } from '@navikt/k9-period-utils';

import { Vurderingsresultat } from '@k9-sak-web/types';

export interface ReisetidPeriode {
  periode: Period;
  resultat: Vurderingsresultat;
}

export interface ReisetidVurdering {
  begrunnelse: string;
  resultat: Vurderingsresultat;
  opplæringPeriode: Period;
  periode: Period;
  til: boolean;
}
