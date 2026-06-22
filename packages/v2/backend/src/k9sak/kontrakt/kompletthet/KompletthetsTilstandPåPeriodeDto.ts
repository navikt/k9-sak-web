import type { k9_sak_kontrakt_kompletthet_KompletthetsTilstandPåPeriodeDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Vurdering } from '@k9-sak-web/backend/k9sak/kodeverk/kompletthet/Vurdering.js';

// Overstyrer den genererte vurdering-typen fordi backend bruker den faktiske verdien 'FORTSETT' for KAN_FORTSETTE.
export type KompletthetsTilstandPåPeriodeDto = Omit<
  k9_sak_kontrakt_kompletthet_KompletthetsTilstandPåPeriodeDto,
  'vurdering'
> & {
  vurdering?: Vurdering;
};
