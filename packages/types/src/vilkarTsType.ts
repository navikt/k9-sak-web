import Kodeverk from './kodeverk';

type Vilkar = Readonly<{
  lovReferanse?: string,
  vilkarType: Kodeverk,
  vilkarStatus: Kodeverk,
}>;

export default Vilkar;
