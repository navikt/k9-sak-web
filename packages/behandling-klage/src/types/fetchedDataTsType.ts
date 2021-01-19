import { Aksjonspunkt, KlageVurdering, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

import KlagePart from './klagePartTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  klageVurdering: KlageVurdering;
  arbeidsgivere: {
    arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  };
  parterMedKlagerett?: KlagePart[];
  valgtPartMedKlagerett?: KlagePart;
}

export default FetchedData;
