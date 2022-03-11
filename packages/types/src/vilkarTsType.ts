import Kodeverk from './kodeverkTsType';
import Vilkarperiode from './vilkarperiode';

export type Vilkar = Readonly<{
  lovReferanse?: string;
  vilkarType: string;
  perioder: Vilkarperiode[];
  overstyrbar: boolean;
}>;

export default Vilkar;
