import {
  Aksjonspunkt,
  Beregningsgrunnlag,
  BeregningsresultatFp,
  InntektArbeidYtelse,
  Personopplysninger,
  SimuleringResultat,
  Soknad,
  UttaksresultatPeriode,
  UttakStonadskontoer,
  Vilkar,
  Sykdom,
  OmsorgenFor,
} from '@k9-sak-web/types';
import ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  soknad: Soknad;
  inntektArbeidYtelse: InntektArbeidYtelse;
  beregningresultatForeldrepenger: BeregningsresultatFp;
  beregningsgrunnlag: Beregningsgrunnlag;
  uttakStonadskontoer: UttakStonadskontoer;
  uttaksresultatPerioder: UttaksresultatPeriode[];
  simuleringResultat: SimuleringResultat;
  sykdom: Sykdom;
  omsorgenFor: OmsorgenFor;
  forbrukteDager: ÅrskvantumForbrukteDager;
}

export default FetchedData;
