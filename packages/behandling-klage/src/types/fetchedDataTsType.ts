import { Aksjonspunkt } from '@k9-sak-web/types';

import KlageVurdering from './klageVurderingTsType';
import KlagePart from './klagePartTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  klageVurdering: KlageVurdering;
  parterMedKlagerett?: KlagePart[];
  valgtPartMedKlagerett?: KlagePart;
}

export default FetchedData;
