import { Overføringsretning, Overføringstype } from '../types/Overføring';

export const rammevedtakFormName = 'rammevedtakFormName';

export function overføringerFormName(type: Overføringstype, retning: Overføringsretning) {
  return `${rammevedtakFormName}-${type}-${retning}`;
}

// Kompileringsfeil her betyr at BRUK_V2_DELING_AV_DAGER er fjernet fra FeatureToggles.
// Slett denne fila (med tilhørende spec/css) og fjern v1-grenen i DelingAvDagerFaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_DELING_AV_DAGER'];
