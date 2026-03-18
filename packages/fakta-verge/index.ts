export { default } from './src/VergeFaktaIndex';

// Kompileringsfeil her betyr at BRUK_V2_VERGE er fjernet fra FeatureToggles.
// Slett hele packages/fakta-verge og fjern v1-grenen i FaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting = import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_VERGE'];
