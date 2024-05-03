import { Period } from '@k9-sak-web/utils';
import Beskrivelse from './Beskrivelse';
import { Beredskap } from './TilsynResponse';
import Vurderingsperiode from './Vurderingsperiode';

class BeredskapType {
  beskrivelser: Beskrivelse[];

  vurderinger: Vurderingsperiode[];

  constructor({ beskrivelser, vurderinger }: Beredskap) {
    this.beskrivelser = beskrivelser.map(beskrivelse => ({
      ...beskrivelse,
      periode: new Period(beskrivelse.periode.fom, beskrivelse.periode.tom),
    }));

    this.vurderinger = vurderinger.map(vurdering => new Vurderingsperiode(vurdering));
  }

  finnPerioderTilVurdering() {
    return this.vurderinger.filter(vurdering => vurdering.skalVurderes());
  }

  finnVurdertePerioder() {
    return this.vurderinger.filter(vurdering => vurdering.erVurdert());
  }

  harPerioderTilVurdering() {
    return this.vurderinger.some(vurdering => vurdering.skalVurderes());
  }

  harPerioder() {
    return this.vurderinger.length > 0;
  }
}

export default BeredskapType;
