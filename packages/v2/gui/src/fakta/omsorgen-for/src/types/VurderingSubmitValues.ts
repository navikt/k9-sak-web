import type { Periode } from '@k9-sak-web/backend/k9sak/kontrakt/Periode.js';
import type Vurderingsresultat from './Vurderingsresultat';

export type VurderingSubmitValues = {
  periode: Periode | undefined;
  resultat: Vurderingsresultat;
  begrunnelse: string;
};
