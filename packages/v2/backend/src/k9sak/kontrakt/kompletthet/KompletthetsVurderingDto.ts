import type { KompletthetsTilstandPåPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsTilstandPåPeriodeDto.js';

// Bruker den overstyrte tilstand-typen slik at vurdering får den korrekte KAN_FORTSETTE-verdien ('FORTSETT').
export type KompletthetsVurderingDto = {
  tilstand: KompletthetsTilstandPåPeriodeDto[];
};
