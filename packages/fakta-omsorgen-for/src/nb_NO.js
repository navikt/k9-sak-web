export const felles = {};

export const omsorgspenger = {
  ...felles,
  'vurdering.tittel': 'Vurdering',
  'vurdering.harOmsorgenFor': 'Er vilkåret oppfylt for denne perioden?',
  'vurdering.hjemmel': 'Vurder om søker har omsorg for barn etter § 9-5.',
  'vurdering.hjemmel.hjelpetekst':
    'Hvis søker ikke oppfyller vilkåret etter § 9-5, så skal vilkåret likevel settes oppfylt dersom søker kan ha fått fordelt eller overført dager etter § 9-6, femte og sjette ledd',
  'vurdering.advarsel': 'Vurder om søker har omsorgen for barn i perioden.',
};

export const pleiepenger = {
  ...felles,
  'vurdering.tittel': 'Vurdering av omsorg',
  'vurdering.harOmsorgenFor': 'Har søker omsorgen for barnet i denne perioden?',
  'vurdering.hjemmel': 'Vurder om søker har omsorgen for barnet etter § 9-10, første ledd.',
  'vurdering.advarsel': 'Vurder om søker har omsorgen for barnet i {perioder}.',
};
