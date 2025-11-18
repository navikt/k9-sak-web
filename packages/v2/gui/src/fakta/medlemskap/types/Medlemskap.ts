import type { Periode } from './Periode';
import type { Personopplysninger } from './Personopplysninger';

export interface MedlemskapPeriode {
  fom: string;
  tom: string;
  medlemskapType: string;
  dekningType: string;
  kildeType: string;
  beslutningsdato: string | null;
}

export interface Medlemskap {
  fom: string;
  medlemskapPerioder: MedlemskapPeriode[];
  perioder: Periode[];
  personopplysninger: {
    [key: string]: Personopplysninger;
  };
}
