import { k9_kodeverk_beregningsgrunnlag_kompletthet_Vurdering } from '@k9-sak-web/backend/k9sak/generated/types.js';

// Backend returnerer 'FORTSETT' for KAN_FORTSETTE, men den genererte typen deklarerer feilaktig 'KAN_FORTSETTE'.
// Vi gjenbruker den genererte konstanten og overstyrer kun KAN_FORTSETTE med den faktiske verdien 'FORTSETT'.
// TODO Dette er kun midlertidig til backend fiks er rulla ut i prod. Fjern når det er gjort.
export const Vurdering = {
  ...k9_kodeverk_beregningsgrunnlag_kompletthet_Vurdering,
  KAN_FORTSETTE: 'FORTSETT',
} as const;

// TODO Dette er kun midlertidig til backend fiks er rulla ut i prod. Fjern når det er gjort.
export type Vurdering = (typeof Vurdering)[keyof typeof Vurdering];
