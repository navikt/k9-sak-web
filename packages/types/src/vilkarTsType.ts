import Kodeverk from './kodeverkTsType';
import Vilkarperiode from './vilkarperiode';

export type InnvilgetUtfallType = Readonly<{
  innvilgetType: Kodeverk,
  navn: string
}>;

export type Vilkar = Readonly<{
  lovReferanse?: string;
  vilkarType: Kodeverk;
  perioder: Vilkarperiode[];
  overstyrbar: boolean;
  relevanteInnvilgetUtfall: InnvilgetUtfallType[]
}>;

export default Vilkar;
