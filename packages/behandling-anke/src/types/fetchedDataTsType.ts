import { Aksjonspunkt, Vilkar, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

import AnkeVurdering from './ankeVurderingTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  ankeVurdering: AnkeVurdering;
  arbeidsgivere: {
    arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  };
}

export default FetchedData;
