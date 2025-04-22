import Kodeverk from './kodeverkTsType';
import Vilkarperiode from './vilkarperiode';

export type InnvilgetMerknad = Readonly<{
  merknad: Kodeverk;
  navn: string;
}>;

export type Vilkar = Readonly<{
  lovReferanse?: string;
  vilkarType: Kodeverk;
  perioder: Vilkarperiode[];
  overstyrbar: boolean;
  relevanteInnvilgetMerknader: InnvilgetMerknad[];
}>;

export default Vilkar;
