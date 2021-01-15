import { Aksjonspunkt, AnkeVurdering, Vilkar } from '@k9-sak-web/types';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  ankeVurdering: AnkeVurdering;
}

export default FetchedData;
