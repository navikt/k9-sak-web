import {
  Aksjonspunkt,
  Beregningsgrunnlag,
  Personopplysninger,
  SimuleringResultat,
  Vilkar,
  BeregningsresultatUtbetalt,
  ArbeidsgiverOpplysningerPerId,
} from '@k9-sak-web/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  beregningsresultatUtbetalt: BeregningsresultatUtbetalt;
  beregningsgrunnlag: Beregningsgrunnlag;
  simuleringResultat: SimuleringResultat;
  arbeidsgivere: {
    arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  };
}

export default FetchedData;
