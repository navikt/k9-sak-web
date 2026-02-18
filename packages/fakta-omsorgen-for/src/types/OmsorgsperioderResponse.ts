import Omsorgsperiode from './Omsorgsperiode';

interface OmsorgsperioderResponse {
  omsorgsperioder: Omsorgsperiode[];
  registrertSammeBosted: boolean;
  registrertForeldrerelasjon: boolean;
  tvingManuellVurdering: boolean;
}

export default OmsorgsperioderResponse;
