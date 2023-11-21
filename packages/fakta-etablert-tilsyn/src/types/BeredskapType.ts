import { Period } from '@navikt/k9-fe-period-utils';
import Beskrivelse from './Beskrivelse';
import Vurderingsperiode from './Vurderingsperiode';
import { Beredskap } from './TilsynResponse';

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
