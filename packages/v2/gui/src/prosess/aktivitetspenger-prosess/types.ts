import { BostedsavklaringKildeType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsavklaringKildeType.js';
import { BostedsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsvilkårIkkeOppfyltÅrsak.js';
export { BostedsavklaringKildeType, BostedsvilkårIkkeOppfyltÅrsak };

export const opphørsårsakLabels: Record<BostedsvilkårIkkeOppfyltÅrsak, string> = {
  [BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM]: 'Har ikke bostedsadresse i Trondheim kommune',
  [BostedsvilkårIkkeOppfyltÅrsak.STUDIE_ELLER_ARBEIDSSTED_UTENFOR_TRONDHEIM]:
    'Har studie/arbeidssted utenfor Trondheim kommune',
  [BostedsvilkårIkkeOppfyltÅrsak.ANNET]: 'Annen årsak',
  [BostedsvilkårIkkeOppfyltÅrsak.UDEFINERT]: '-',
  [BostedsvilkårIkkeOppfyltÅrsak.AVKORTET]: 'Avkortet',
};

export const kildeLabels: Record<BostedsavklaringKildeType, string> = {
  [BostedsavklaringKildeType.BRUKER]: 'Bruker',
  [BostedsavklaringKildeType.FOLKEREGISTER]: 'Register',
  [BostedsavklaringKildeType.ANNET]: 'Annet',
};
