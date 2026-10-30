export { default } from './src/UnntakProsessIndex';

// Kompileringsfeil her betyr at BRUK_V2_PROSESS_UNNTAK er fjernet fra FeatureToggles.
// Slett hele packages/prosess-unntak og fjern v1-grenen i UnntakProsessStegPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_PROSESS_UNNTAK'];
