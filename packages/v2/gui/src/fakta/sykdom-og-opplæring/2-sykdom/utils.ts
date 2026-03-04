import type { LangvarigSykdomVurderingDto } from '@k9-sak-web/backend/k9sak/kontrakt/opplæringspenger/langvarigsykdom/LangvarigSykdomVurderingDto.js';

import { Avslagsårsak } from '@k9-sak-web/backend/k9sak/kodeverk/vilkår/Avslagsårsak.js';
import { Resultat } from '../../../shared/vurderingsperiode-navigasjon/Vurderingsnavigasjon';

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
