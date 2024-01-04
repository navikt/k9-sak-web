import { AleneOmOmsorgenProps } from './AleneOmOmsorgenProps';
import Komponenter from './Komponenter';
import { KorrigerePerioderProps } from './KorrigerePerioderProps';
import { OmsorgProps } from './OmsorgProps';
import { VilkarKroniskSyktBarnProps } from './VilkarKroniskSyktBarnProps';
import { VilkarMidlertidigAleneProps } from './VilkarMidlertidigAleneProps';

interface KorrigerePerioderContract {
  visKomponent: Komponenter.KORRIGERE_PERIODER;
  props: KorrigerePerioderProps;
}

interface VilkarMidlertidigAleneContract {
  visKomponent: Komponenter.VILKAR_MIDLERTIDIG_ALENE;
  props: VilkarMidlertidigAleneProps;
}

interface VilkarKroniskSyktBarnContract {
  visKomponent: Komponenter.VILKAR_KRONISK_SYKT_BARN;
  props: VilkarKroniskSyktBarnProps;
}

interface OmsorgContract {
  visKomponent: Komponenter.OMSORG;
  props: OmsorgProps;
}

interface AleneOmOmsorgenContract {
  visKomponent: Komponenter.ALENE_OM_OMSORGEN;
  props: AleneOmOmsorgenProps;
}

type ContainerContract =
  | KorrigerePerioderContract
  | VilkarMidlertidigAleneContract
  | VilkarKroniskSyktBarnContract
  | AleneOmOmsorgenContract
  | OmsorgContract;

export default ContainerContract;
