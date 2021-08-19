import Kodeverk from './kodeverkTsType';
import Arbeidsforhold from './arbeidsforholdTsType';

export type UttaksresultatPeriode = Readonly<{
  perioderSøker: {
    fom: string;
    tom: string;
    aktiviteter: {
      arbeidsforholdId?: string;
      eksternArbeidsforholdId?: string;
      arbeidsgiver?: Arbeidsforhold;
      gradering?: boolean;
      prosentArbeid?: number;
      stønadskontoType?: Kodeverk;
      trekkdagerDesimaler?: number;
      utbetalingsgrad?: number;
    }[];
    periodeResultatType: Kodeverk;
  }[];
  perioderAnnenpart: [];
  annenForelderHarRett: boolean;
  aleneomsorg: boolean;
}>;

export default UttaksresultatPeriode;
