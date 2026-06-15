export const OpphørTab = {
  ÅRSAK_OG_VARSEL: 'årsak_og_varsel',
  VILKÅRSVURDERING: 'vilkårsvurdering',
  BESLUTTER: 'beslutter',
} as const;

export type OpphørTab = (typeof OpphørTab)[keyof typeof OpphørTab];

export const Opphørsårsak = {
  IKKE_BOSATTADRESSE_I_TRONDHEIM: 'IKKE_BOSATTADRESSE_I_TRONDHEIM',
  IKKE_BOSTEDSADRESSE_I_TRONDHEIM_OG_IKKE_FOLKETREGISTRERT_I_TRONDHEIM:
    'IKKE_BOSTEDSADRESSE_I_TRONDHEIM_OG_IKKE_FOLKETREGISTRERT_I_TRONDHEIM',
  HAR_STUDIE_ARBEIDSSTED_UTENFOR_TRONDHEIM: 'HAR_STUDIE_ARBEIDSSTED_UTENFOR_TRONDHEIM',
  ANNEN_ÅRSAK: 'ANNEN_ÅRSAK',
} as const;

export type Opphørsårsak = (typeof Opphørsårsak)[keyof typeof Opphørsårsak];

export const opphørsårsakLabels: Record<Opphørsårsak, string> = {
  [Opphørsårsak.IKKE_BOSATTADRESSE_I_TRONDHEIM]: 'Ikke bosatt adresse i Trondheim',
  [Opphørsårsak.IKKE_BOSTEDSADRESSE_I_TRONDHEIM_OG_IKKE_FOLKETREGISTRERT_I_TRONDHEIM]:
    'Ikke bostedsadresse i Trondheim, og heller ikke folkeregistrert i Trondheim',
  [Opphørsårsak.HAR_STUDIE_ARBEIDSSTED_UTENFOR_TRONDHEIM]: 'Har studie/arbeidssted utenfor Trondheim',
  [Opphørsårsak.ANNEN_ÅRSAK]: 'Annet',
};
