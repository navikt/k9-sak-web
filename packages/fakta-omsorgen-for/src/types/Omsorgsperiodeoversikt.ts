import Omsorgsperiode from './Omsorgsperiode';
import OmsorgsperioderResponse from './OmsorgsperioderResponse';

class Omsorgsperiodeoversikt {
  perioder: Omsorgsperiode[];

  registrertSammeBosted: boolean;

  registrertForeldrerelasjon: boolean;

  tvingManuellVurdering: boolean;

  constructor({
    tvingManuellVurdering,
    omsorgsperioder,
    registrertForeldrerelasjon,
    registrertSammeBosted,
  }: OmsorgsperioderResponse) {
    this.perioder = omsorgsperioder.map(omsorgsperiode => new Omsorgsperiode(omsorgsperiode));
    this.tvingManuellVurdering = tvingManuellVurdering;
    this.registrertForeldrerelasjon = registrertForeldrerelasjon;
    this.registrertSammeBosted = registrertSammeBosted;
  }

  harPerioderTilVurdering(): boolean {
    return this.perioder.some(omsorgspeiode => omsorgspeiode.manglerVurdering());
  }

  finnVurdertePerioder(): Omsorgsperiode[] {
    return this.perioder.filter(omsorgsperiode => omsorgsperiode.erVurdert());
  }

  finnPerioderTilVurdering(): Omsorgsperiode[] {
    return this.perioder.filter(omsorgsperiode => omsorgsperiode.manglerVurdering());
  }
}

export default Omsorgsperiodeoversikt;
