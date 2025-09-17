import { type k9_sak_typer_Periode as Periode } from '@k9-sak-web/backend/k9sak/generated/types.js';
import type Vurderingsresultat from './Vurderingsresultat';

export type VurderingSubmitValues = {
  periode: Periode | undefined;
  resultat: Vurderingsresultat;
  begrunnelse: string;
};
