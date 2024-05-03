import { Period } from '@k9-sak-web/utils';
import Kilde from './Kilde';
import { Vurdering } from './TilsynResponse';
import Vurderingsresultat from './Vurderingsresultat';

class Vurderingsperiode {
  periode: Period;

  kilde: Kilde;

  resultat: Vurderingsresultat | null;

  begrunnelse: string;

  id: number;

  opprettetAv: string;

  opprettetTidspunkt: string;

  constructor({ periode, kilde, resultat, begrunnelse, id, opprettetAv, opprettetTidspunkt }: Vurdering) {
    this.periode = new Period(periode.fom, periode.tom);
    this.kilde = kilde;
    this.resultat = resultat;
    this.begrunnelse = begrunnelse;
    this.id = id;
    this.opprettetAv = opprettetAv;
    this.opprettetTidspunkt = opprettetTidspunkt;
  }

  skalVurderes() {
    return this.resultat === Vurderingsresultat.IKKE_VURDERT;
  }

  erVurdert() {
    return this.resultat === Vurderingsresultat.OPPFYLT || this.resultat === Vurderingsresultat.IKKE_OPPFYLT;
  }
}

export default Vurderingsperiode;
