import { Kodeverk } from '@k9-sak-web/types';

interface OverlappendeYtelseType {
  ytelseType: Kodeverk;
  kilde: Kodeverk;
  saksnummer: string;
  overlappendePerioder: {
    fom: string;
    tom: string;
  }[];
}

export default OverlappendeYtelseType;
