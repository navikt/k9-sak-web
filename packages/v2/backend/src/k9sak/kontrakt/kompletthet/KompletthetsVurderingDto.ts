import type { KompletthetsTilstandPåPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsTilstandPåPeriodeDto.js';

// Bruker den overstyrte tilstand-typen slik at vurdering får den korrekte KAN_FORTSETTE-verdien ('FORTSETT').
// TODO: Kun midlertidig, fjern når endring i Vurdering type er rulla ut til prod i backend
export type KompletthetsVurderingDto = {
  tilstand: KompletthetsTilstandPåPeriodeDto[];
};
