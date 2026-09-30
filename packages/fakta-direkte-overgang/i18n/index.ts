// Kompileringsfeil her betyr at BRUK_V2_DIREKTE_OVERGANG er fjernet fra FeatureToggles.
// Slett hele packages/fakta-direkte-overgang og fjern v1-grenen i FaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_DIREKTE_OVERGANG'];

import messages from './nb_NO.json';

export { messages };
