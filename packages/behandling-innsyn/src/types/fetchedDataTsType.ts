import { Aksjonspunkt, Vilkar, Dokument, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

import Innsyn from './innsynTsType';

interface FetchedData {
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  innsyn: Innsyn;
  innsynDokumenter: Dokument[];
  arbeidsgivere: {
    arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  };
}

export default FetchedData;
