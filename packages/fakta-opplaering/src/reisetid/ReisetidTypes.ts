import { Period } from '@k9-sak-web/utils';

import { Vurderingsresultat } from '@k9-sak-web/types';

export interface ReisetidPeriode {
  opplæringPeriode: Period;
  reisetidHjem: Period;
  reisetidTil: Period;
  beskrivelseFraSoeker?: string;
}

export interface ReisetidVurdering {
  begrunnelse: string;
  resultat: Vurderingsresultat;
  perioderFraSoeknad: ReisetidPeriode;
  periode: Period;
  til: boolean;
  vurdertAv?: string;
  vurdertTidspunkt?: string;
}
