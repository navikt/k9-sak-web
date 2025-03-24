import type { PersonopplysningDto } from '@navikt/k9-sak-typescript-client';
import type { Periode } from './Periode';

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
    [key: string]: PersonopplysningDto;
  };
}
