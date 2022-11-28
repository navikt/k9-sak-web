export enum Arbeidstype {
  ARBEIDSTAKER = 'AT',
  FRILANSER = 'FL',
  DAGPENGER = 'DP',
  SELVSTENDIG_NÆRINGSDRIVENDE = 'SN',
  IKKE_YRKESAKTIV = 'IKKE_YRKESAKTIV',
  KUN_YTELSE = 'BA',
  INAKTIV = 'MIDL_INAKTIV',
  SYKEPENGER_AV_DAGPENGER = 'SP_AV_DP',
  PLEIEPENGER_AV_DAGPENGER = 'PSB_AV_DP',
}

export const arbeidstypeTilVisning = {
  AT: 'Arbeidstaker',
  FL: 'Frilanser',
  DP: 'Dagpenger',
  SN: 'Selvstendig næringsdrivende',
  IKKE_YRKESAKTIV: 'Ikke yrkesaktiv',
  BA: 'Kun ytelse',
  MIDL_INAKTIV: 'Inaktiv',
  SP_AV_DP: 'Sykepenger av dagpenger',
  PSB_AV_DP: 'Pleiepgner av dagpenger',
};
