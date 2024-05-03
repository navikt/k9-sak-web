import { Period } from '@k9-sak-web/utils';
import { beregnDagerTimer } from '../util/dateUtils';
import Kilde from './Kilde';
import { EtablertTilsynPeriode } from './TilsynResponse';

class EtablertTilsynType {
  periode: Period;

  tidPerDag: number;

  kilde: Kilde;

  constructor({ periode, tidPerDag, kilde }: EtablertTilsynPeriode) {
    this.periode = new Period(periode.fom, periode.tom);
    this.tidPerDag = beregnDagerTimer(tidPerDag);
    this.kilde = kilde;
  }
}

export default EtablertTilsynType;
