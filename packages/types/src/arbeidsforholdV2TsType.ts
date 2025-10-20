import Kodeverk from './kodeverkTsType';
import ArbeidsforholdId from './arbeidsforholdIdTsType';
import Arbeidsgiver from './arbeidsgiverTsType';
import Periode from './periodeTsType';
import Inntektsmelding from './inntektsmeldingTsType';

type ArbeidsforholdV2 = Readonly<{
  id?: string;
  arbeidsforhold?: ArbeidsforholdId;
  arbeidsgiver?: Arbeidsgiver;
  yrkestittel?: string;
  begrunnelse?: string;
  perioder: Periode[];
  handlingType: Kodeverk;
  kilde: Kodeverk[];
  permisjoner?: {
    permisjonFom?: string;
    permisjonTom?: string;
    permisjonsprosent?: number;
    type?: Kodeverk;
  }[];
  stillingsprosent?: number;
  aksjonspunktÅrsaker: Kodeverk[];
  inntektsmeldinger: Inntektsmelding[];
}>;

export default ArbeidsforholdV2;
