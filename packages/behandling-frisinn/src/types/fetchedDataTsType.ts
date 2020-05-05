import {
  Aksjonspunkt,
  Beregningsgrunnlag,
  BeregningsresultatFp,
  InntektArbeidYtelse,
  Personopplysninger,
  SimuleringResultat,
  UttaksresultatPeriode,
  UttakStonadskontoer,
  Vilkar,
  Sykdom,
  OmsorgenFor,
} from '@k9-sak-web/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  inntektArbeidYtelse: InntektArbeidYtelse;
  beregningresultatForeldrepenger: BeregningsresultatFp;
  beregningsgrunnlag: Beregningsgrunnlag;
  uttakStonadskontoer: UttakStonadskontoer;
  uttaksresultatPerioder: UttaksresultatPeriode[];
  simuleringResultat: SimuleringResultat;
  sykdom: Sykdom;
  omsorgenFor: OmsorgenFor;
}

export default FetchedData;
