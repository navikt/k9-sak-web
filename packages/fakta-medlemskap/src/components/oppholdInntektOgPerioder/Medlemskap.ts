import { Kodeverk } from '@k9-sak-web/types';
import { PersonopplysningDto } from '@navikt/k9-sak-typescript-client';
import { Periode } from './Periode';

export interface MedlemskapPeriode {
  fom: string;
  tom: string;
  medlemskapType: Kodeverk;
  dekningType: Kodeverk;
  kildeType: Kodeverk;
  beslutningsdato: string | null;
}

export interface Medlemskap {
  fom: string;
  medlemskapPerioder: MedlemskapPeriode[];
  perioder: Periode[];
  personopplysninger?: {
    [key: string]: PersonopplysningDto;
  };
}
