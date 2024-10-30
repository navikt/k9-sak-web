export enum Arbeidstype {
  AT = 'AT',
  FL = 'FL',
  DP = 'DP',
  SN = 'SN',
  IKKE_YRKESAKTIV = 'IKKE_YRKESAKTIV',
  BA = 'BA',
  MIDL_INAKTIV = 'MIDL_INAKTIV',
  SP_AV_DP = 'SP_AV_DP',
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
