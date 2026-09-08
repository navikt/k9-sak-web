import { BostedsavklaringKildeType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsavklaringKildeType.js';
import { BostedsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsvilkårIkkeOppfyltÅrsak.js';
export { BostedsvilkårIkkeOppfyltÅrsak, BostedsavklaringKildeType };

export const opphørsårsakLabels: Record<BostedsvilkårIkkeOppfyltÅrsak, string> = {
  [BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM]: 'Ikke bosatt adresse i Trondheim',
  [BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSTEDSADRESSE_OG_IKKE_FOLKEREGISTRERT_I_TRONDHEIM]:
    'Ikke bostedsadresse i Trondheim, og heller ikke folkeregistrert i Trondheim',
  [BostedsvilkårIkkeOppfyltÅrsak.STUDIE_ELLER_ARBEIDSSTED_UTENFOR_TRONDHEIM]:
    'Har studie/arbeidssted utenfor Trondheim',
  [BostedsvilkårIkkeOppfyltÅrsak.ANNET]: 'Annet',
  [BostedsvilkårIkkeOppfyltÅrsak.UDEFINERT]: '-',
  [BostedsvilkårIkkeOppfyltÅrsak.AVKORTET]: 'Avkortet',
};

export const kildeLabels: Record<BostedsavklaringKildeType, string> = {
  [BostedsavklaringKildeType.BRUKER]: 'Bruker',
  [BostedsavklaringKildeType.FOLKEREGISTER]: 'Folkeregisteret',
  [BostedsavklaringKildeType.ANNET]: 'Annet',
};
