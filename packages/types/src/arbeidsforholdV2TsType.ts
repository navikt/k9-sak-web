import type ArbeidsforholdId from './arbeidsforholdIdTsType';
import type Arbeidsgiver from './arbeidsgiverTsType';
import type Inntektsmelding from './inntektsmeldingTsType';
import type Kodeverk from './kodeverkTsType';
import type Periode from './periodeTsType';

export type ArbeidsforholdV2 = Readonly<{
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
