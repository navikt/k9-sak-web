import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';

import AnkeVurdering from './ankeVurderingTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  ankeVurdering: AnkeVurdering;
}

export default FetchedData;
