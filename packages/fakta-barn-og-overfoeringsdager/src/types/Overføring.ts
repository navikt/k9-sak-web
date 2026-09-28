import stringEnum from '@k9-sak-web/types/src/tsUtils';

export const OverføringstypeEnum = stringEnum({
  OVERFØRING: 'overføring',
  FORDELING: 'fordeling',
  KORONAOVERFØRING: 'koronaoverføring',
});
export type Overføringstype = (typeof OverføringstypeEnum)[keyof typeof OverføringstypeEnum];

export const OverføringsretningEnum = stringEnum({
  INN: 'inn',
  UT: 'ut',
});
export type Overføringsretning = (typeof OverføringsretningEnum)[keyof typeof OverføringsretningEnum];

interface Overføring {
  antallDager?: number;
  mottakerAvsenderFnr?: string;
  fom?: string;
  tom?: string;
}

export default Overføring;

// Kompileringsfeil her betyr at BRUK_V2_DELING_AV_DAGER er fjernet fra FeatureToggles.
// Slett denne fila (med tilhørende spec/css) og fjern v1-grenen i UttakFaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_DELING_AV_DAGER'];
