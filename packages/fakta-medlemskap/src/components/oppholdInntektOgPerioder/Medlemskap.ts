import { Kodeverk } from '@k9-sak-web/types';
import { k9_sak_kontrakt_person_PersonopplysningDto as PersonopplysningDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
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
