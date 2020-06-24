import { Kodeverk, FagsakPerson } from '@k9-sak-web/types';

type FagsakInfo = Readonly<{
  saksnummer: string;
  fagsakYtelseType: Kodeverk;
  fagsakPerson: FagsakPerson;
  fagsakStatus: Kodeverk;
}>;

export default FagsakInfo;
