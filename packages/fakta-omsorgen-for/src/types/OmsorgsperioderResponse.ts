import Omsorgsperiode from './Omsorgsperiode';

interface OmsorgsperioderResponse {
  omsorgsperioder: Omsorgsperiode[];
  registrertSammeBosted: boolean;
  registrertForeldrerelasjon: boolean;
  tvingManuellVurdering: boolean;
}

export default OmsorgsperioderResponse;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_OMSORGEN_FOR_V2'];
