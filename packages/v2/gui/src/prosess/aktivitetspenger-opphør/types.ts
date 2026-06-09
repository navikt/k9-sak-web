export const OpphørTab = {
  ÅRSAK_OG_VARSEL: 'årsak_og_varsel',
  VILKÅRSVURDERING: 'vilkårsvurdering',
  BESLUTTER: 'beslutter',
} as const;

export type OpphørTab = (typeof OpphørTab)[keyof typeof OpphørTab];

export const Opphørsårsak = {
  IKKE_LENGER_BEHOV_FOR_BISTAND: 'IKKE_LENGER_BEHOV_FOR_BISTAND',
  IKKE_LENGER_BOSATT: 'IKKE_LENGER_BOSATT',
  MOTTAR_ANDRE_LIVSOPPHOLDYTELSER: 'MOTTAR_ANDRE_LIVSOPPHOLDYTELSER',
  ANNET: 'ANNET',
} as const;

export type Opphørsårsak = (typeof Opphørsårsak)[keyof typeof Opphørsårsak];

export const opphørsårsakLabels: Record<Opphørsårsak, string> = {
  [Opphørsårsak.IKKE_LENGER_BEHOV_FOR_BISTAND]: 'Ikke lenger behov for bistand',
  [Opphørsårsak.IKKE_LENGER_BOSATT]: 'Ikke lenger bosatt i Trondheim',
  [Opphørsårsak.MOTTAR_ANDRE_LIVSOPPHOLDYTELSER]: 'Mottar andre livsoppholdytelser',
  [Opphørsårsak.ANNET]: 'Annet',
};
