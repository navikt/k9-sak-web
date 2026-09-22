export const OpphørTab = {
  ÅRSAK_OG_VARSEL: 'årsak_og_varsel',
  VILKÅRSVURDERING: 'vilkårsvurdering',
  BESLUTTER: 'beslutter',
} as const;

export type OpphørTab = (typeof OpphørTab)[keyof typeof OpphørTab];
