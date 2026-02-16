import type { AleneOmOmsorgenProps } from './AleneOmOmsorgenProps';
import type Komponenter from './Komponenter';
import type { KorrigerePerioderProps } from './KorrigerePerioderProps';
import type { OmsorgProps } from './OmsorgProps';
import type { VilkarKroniskSyktBarnProps } from './VilkarKroniskSyktBarnProps';
import type { VilkarMidlertidigAleneProps } from './VilkarMidlertidigAleneProps';

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
