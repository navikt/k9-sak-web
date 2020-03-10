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
  Ytelsefordeling,
} from '@k9-sak-web/types';
import { Sykdom } from '@k9-sak-web/types/src/medisinsk-vilkår/MedisinskVilkår';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  ytelsefordeling: Ytelsefordeling;
  soknad: Soknad;
  inntektArbeidYtelse: InntektArbeidYtelse;
  beregningresultatForeldrepenger: BeregningsresultatFp;
  beregningsgrunnlag: Beregningsgrunnlag;
  uttakStonadskontoer: UttakStonadskontoer;
  uttaksresultatPerioder: UttaksresultatPeriode[];
  simuleringResultat: SimuleringResultat;
  sykdom: Sykdom;
}

export default FetchedData;
