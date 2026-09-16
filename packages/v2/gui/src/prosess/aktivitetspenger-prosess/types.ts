import { BostedsavklaringKildeType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsavklaringKildeType.js';
import { BostedsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsvilkårIkkeOppfyltÅrsak.js';
export { BostedsavklaringKildeType, BostedsvilkårIkkeOppfyltÅrsak };

export const opphørsårsakLabels: Record<BostedsvilkårIkkeOppfyltÅrsak, string> = {
  [BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM]: 'Har ikke bostedsadresse i Trondheim kommune',
  // denne skal ikke brukes, men vi beholder den inntil videre for å slippe å tilpasse typer frem til den er fjernet
  [BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSTEDSADRESSE_OG_IKKE_FOLKEREGISTRERT_I_TRONDHEIM]:
    'Har ikke bostedsadresse i Trondheim kommune, og er heller ikke folkeregistrert i Trondheim kommune',
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
