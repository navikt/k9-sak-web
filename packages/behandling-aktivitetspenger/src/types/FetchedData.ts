import { Aksjonspunkt, Personopplysninger, SimuleringResultat, Soknad, Vilkar } from '@k9-sak-web/types';

export interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  soknad: Soknad;
  simuleringResultat: SimuleringResultat;
}

export default FetchedData;
