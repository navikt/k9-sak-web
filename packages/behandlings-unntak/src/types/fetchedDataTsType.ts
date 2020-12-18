import {
  Aksjonspunkt,
  Personopplysninger,
  SimuleringResultat,
  Vilkar,
  BeregningsresultatUtbetalt,
} from '@k9-sak-web/types';

interface Arbeidsgivere {
  identifikator: string;
  navn: string;
  referanse: string;
}

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  beregningsresultatUtbetalt: BeregningsresultatUtbetalt;
  simuleringResultat: SimuleringResultat;
  arbeidsgivere: { arbeidsgivere: { [key: string]: Arbeidsgivere[] } };
}

export default FetchedData;
