import { KodeverkMedNavn } from '../kodeverk';

export interface ArbeidsforholdDto {
  navn: string;
  organisasjonsnummer: string;
  arbeidsforholdId: string;
  arbeidsforholdHandlingType: KodeverkMedNavn;
  brukPermisjon: boolean;
}

export default ArbeidsforholdDto;
