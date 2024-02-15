import { Kodeverk } from '../kodeverk';

export interface ArbeidsforholdDto {
  navn: string;
  organisasjonsnummer: string;
  arbeidsforholdId: string;
  arbeidsforholdHandlingType: Kodeverk;
  brukPermisjon: boolean;
}

export default ArbeidsforholdDto;
