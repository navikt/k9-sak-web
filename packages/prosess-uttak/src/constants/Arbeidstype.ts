export enum Arbeidstype {
  AT = 'ARBEIDSTAKER',
  FL = 'FRILANSER',
  DP = 'DAGPENGER',
  SN = 'SELVSTENDIG_NÆRINGSDRIVENDE',
  IKKE_YRKESAKTIV = 'IKKE_YRKESAKTIV',
  BA = 'KUN_YTELSE',
  MIDL_INAKTIV = 'INAKTIV',
  SP_AV_DP = 'SYKEPENGER_AV_DAGPENGER',
  IKKE_YRKESAKTIV_UTEN_ERSTATNING = 'IKKE_YRKESAKTIV_UTEN_ERSTATNING',
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
  IKKE_YRKESAKTIV_UTEN_ERSTATNING: 'Ikke yrkesaktiv',
};

export default Arbeidstype;
