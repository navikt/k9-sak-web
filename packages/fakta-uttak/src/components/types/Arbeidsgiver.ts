import { Arbeidsforhold } from './Arbeidfsforhold';

interface Arbeidsgiver {
  organisasjonsnummer: string;
  navn: string;
  arbeidsforhold: Arbeidsforhold[];
}

export default Arbeidsgiver;
