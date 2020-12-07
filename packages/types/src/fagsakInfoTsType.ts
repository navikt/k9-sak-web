import Kodeverk from './kodeverk';
import FagsakPerson from './fagsakPersonTsType';

export type FagsakInfo = Readonly<{
  saksnummer: string;
  fagsakYtelseType: Kodeverk;
  fagsakPerson: FagsakPerson;
  fagsakStatus: Kodeverk;
  isForeldrepengerFagsak: boolean;
  kanRevurderingOpprettes: boolean;
  skalBehandlesAvInfotrygd: boolean;
}>;

export default FagsakInfo;
