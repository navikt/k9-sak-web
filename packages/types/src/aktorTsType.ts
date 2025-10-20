import Fagsak from './fagsakTsType';
import FagsakPerson from './fagsakPersonTsType';

type Aktor = Readonly<{
  fagsaker: Fagsak[];
  person: FagsakPerson;
}>;

export default Aktor;
