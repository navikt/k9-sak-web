import type {
  Aksjonspunkt,
  BeregningsresultatUtbetalt,
  Personopplysninger,
  SimuleringResultat,
  Vilkar,
} from '@k9-sak-web/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  beregningsresultatUtbetalt: BeregningsresultatUtbetalt;
  simuleringResultat: SimuleringResultat;
}

export default FetchedData;
