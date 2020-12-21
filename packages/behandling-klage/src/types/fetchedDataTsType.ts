import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

import KlageVurdering from './klageVurderingTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  klageVurdering: KlageVurdering;
  arbeidsgivere: {
    arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  };
}

export default FetchedData;
