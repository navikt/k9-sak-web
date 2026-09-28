export { default } from './src/FaktaRammevedtakIndex';

// Kompileringsfeil her betyr at BRUK_V2_DELING_AV_DAGER er fjernet fra FeatureToggles.
// Slett denne fila (med tilhørende spec/css) og fjern v1-grenen i UttakFaktaPanelDef når migreringen er ferdig.
// NB: src/components/Seksjon.tsx brukes av fakta-barn-oms og må flyttes dit før pakken kan slettes.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_DELING_AV_DAGER'];
