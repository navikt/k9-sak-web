import type { k9_sak_kontrakt_kompletthet_aksjonspunkt_KompletthetsPeriode } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { Vurdering } from '@k9-sak-web/backend/k9sak/kodeverk/kompletthet/Vurdering.js';

// Overstyrer den genererte vurdering-typen fordi backend bruker den faktiske verdien 'FORTSETT' for KAN_FORTSETTE.
// TODO: Kun midlertidig, fjern når endring i Vurdering type er rulla ut til prod i backend
export type KompletthetsPeriode = Omit<k9_sak_kontrakt_kompletthet_aksjonspunkt_KompletthetsPeriode, 'vurdering'> & {
  vurdering: Vurdering;
};
