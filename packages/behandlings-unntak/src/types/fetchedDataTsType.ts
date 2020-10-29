import {
  Aksjonspunkt,
  Beregningsgrunnlag,
  Personopplysninger,
  SimuleringResultat,
  Vilkar,
  BeregningsresultatUtbetalt,
} from '@k9-sak-web/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  beregningsresultatUtbetalt: BeregningsresultatUtbetalt;
  beregningsgrunnlag: Beregningsgrunnlag;
  simuleringResultat: SimuleringResultat;
}

export default FetchedData;
