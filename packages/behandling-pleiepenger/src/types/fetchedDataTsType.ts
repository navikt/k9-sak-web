import {
  Aksjonspunkt,
  Beregningsgrunnlag,
  Personopplysninger,
  SimuleringResultat,
  Soknad,
  Vilkar,
  BeregningsresultatUtbetalt,
  ArbeidsgiverOpplysningerPerId,
} from '@k9-sak-web/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  soknad: Soknad;
  beregningsresultatUtbetaling: BeregningsresultatUtbetalt;
  beregningsgrunnlag: Beregningsgrunnlag;
  simuleringResultat: SimuleringResultat;
  arbeidsgivere: {
    arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  };
}

export default FetchedData;
