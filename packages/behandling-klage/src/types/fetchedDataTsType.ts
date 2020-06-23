import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';

import KlageVurdering from './klageVurderingTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  klageVurdering: KlageVurdering;
}

export default FetchedData;
