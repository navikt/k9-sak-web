import type { k9_sak_kontrakt_opplæringspenger_langvarigsykdom_LangvarigSykdomVurderingDto as LangvarigSykdomVurderingDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

import { k9_kodeverk_vilkår_Avslagsårsak as Avslagsårsak } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Resultat } from '../../../shared/vurderingsperiode-navigasjon/VurderingsperiodeNavigasjon';

export const utledResultat = (element: LangvarigSykdomVurderingDto) => {
  if (element.godkjent) {
    return Resultat.OPPFYLT;
  }
  if (element.godkjent === false) {
    return Resultat.IKKE_OPPFYLT;
  }
  return Resultat.IKKE_VURDERT;
};

export const utledGodkjent = (element: LangvarigSykdomVurderingDto) => {
  if (element.godkjent) {
    return 'ja' as const;
  }
  if (element.avslagsårsak === Avslagsårsak.MANGLENDE_DOKUMENTASJON) {
    return 'mangler_dokumentasjon' as const;
  }
  return 'nei' as const;
};
