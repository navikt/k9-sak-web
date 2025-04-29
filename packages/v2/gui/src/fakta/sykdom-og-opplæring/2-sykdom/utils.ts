import type { LangvarigSykdomVurderingDto } from '@k9-sak-web/backend/k9sak/generated';

import { LangvarigSykdomVurderingDtoAvslagsårsak } from '@k9-sak-web/backend/k9sak/generated';
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
    return 'ja';
  }
  if (element.avslagsårsak === LangvarigSykdomVurderingDtoAvslagsårsak.MANGLENDE_DOKUMENTASJON) {
    return 'mangler_dokumentasjon';
  }
  return 'nei';
};
