import Kodeverk from './kodeverkTsType';
import Vilkarperiode from './vilkarperiode';

type Vilkar = Readonly<{
  lovReferanse?: string;
  vilkarType: Kodeverk;
  perioder: Vilkarperiode[];
  overstyrbar: boolean;
}>;

export default Vilkar;
