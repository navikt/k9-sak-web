import { Aksjonspunkt, Personopplysninger, Soknad, Vilkar } from '@k9-sak-web/types';
import ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  personopplysninger: Personopplysninger;
  soknad: Soknad;
  forbrukteDager: ÅrskvantumForbrukteDager;
}

export default FetchedData;
