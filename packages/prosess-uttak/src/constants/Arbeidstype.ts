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
  IKKE_YRKESAKTIV_UTEN_ERSTATNING = 'IKKE_YRKESAKTIV_UTEN_ERSTATNING',
}

export const arbeidstypeTilVisning = {
  AT: 'Arbeidstaker',
  FL: 'Frilanser',
  DP: 'Dagpenger',
  SN: 'Selvstendig næringsdrivende',
  IKKE_YRKESAKTIV: 'Ikke yrkesaktiv',
  SN_IKKE_AKTIV: 'Selvstendig næringsdrivende - Ikke aktiv',
  FL_IKKE_AKTIV: 'Frilanser - Ikke aktiv',
  BA: 'Kun ytelse',
  MIDL_INAKTIV: 'Inaktiv',
  SP_AV_DP: 'Sykepenger av dagpenger',
  IKKE_YRKESAKTIV_UTEN_ERSTATNING: 'Ikke yrkesaktiv',
};

export default Arbeidstype;
