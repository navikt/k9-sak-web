import { Aksjonspunkt, Personopplysninger, Rammevedtak, Vilkar } from '@k9-sak-web/types';
import UtvidetRettSoknad from './UtvidetRettSoknad';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  soknad: UtvidetRettSoknad;
  rammevedtak: Rammevedtak[];
}

export default FetchedData;
