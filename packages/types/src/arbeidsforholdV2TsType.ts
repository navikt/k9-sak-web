import Kodeverk from './kodeverkTsType';
import ArbeidsforholdId from './arbeidsforholdIdTsType';
import Arbeidsgiver from './arbeidsgiverTsType';
import Periode from './periodeTsType';
import Inntektsmelding from './inntektsmeldingTsType';

export type ArbeidsforholdV2 = Readonly<{
  id?: string;
  arbeidsforhold?: ArbeidsforholdId;
  arbeidsgiver?: Arbeidsgiver;
  yrkestittel?: string;
  begrunnelse?: string;
  perioder: Periode[];
  handlingType: string;
  kilde: string[];
  permisjoner?: {
    permisjonFom?: string;
    permisjonTom?: string;
    permisjonsprosent?: number;
    type?: string;
  }[];
  stillingsprosent?: number;
  aksjonspunktÅrsaker: string[];
  inntektsmeldinger: Inntektsmelding[];
}>;

export default ArbeidsforholdV2;
