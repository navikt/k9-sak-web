import { Kodeverk } from '@k9-sak-web/types';

import FagsakPerson from './fagsakPersonTsType';

type FagsakInfo = Readonly<{
  saksnummer: string;
  fagsakYtelseType: Kodeverk;
  fagsakPerson: FagsakPerson;
  fagsakStatus: Kodeverk;
}>;

export default FagsakInfo;
