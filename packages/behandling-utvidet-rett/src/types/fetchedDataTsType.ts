import { Aksjonspunkt, Personopplysninger, Rammevedtak, Soknad, Vilkar } from '@k9-sak-web/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  soknad: Soknad;
  rammevedtak: Rammevedtak[];
}

export default FetchedData;
