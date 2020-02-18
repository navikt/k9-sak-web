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
} from '@fpsak-frontend/behandling-felles';
import { Sykdom } from '@k9-frontend/types/src/medisinsk-vilkår/MedisinskVilkår';

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
