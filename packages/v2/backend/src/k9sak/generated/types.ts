export * from '@navikt/k9-sak-typescript-client/types';

export type k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagDto = {
  andeler: Array<k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto>;
};

export type k9_sak_kontrakt_beregningsresultat_FeriepengegrunnlagAndelDto = {
  aktivitetStatus: k9_kodeverk_arbeidsforhold_AktivitetStatus;
  arbeidsforholdId?: string;
  arbeidsgiverId?: string;
  erBrukerMottaker: boolean;
  opptjeningsår: number;
  årsbeløp: number;
};

export type k9_kodeverk_arbeidsforhold_AktivitetStatus =
  | 'MIDL_INAKTIV'
  | 'AAP'
  | 'AT'
  | 'DP'
  | 'SP_AV_DP'
  | 'PSB_AV_DP'
  | 'FL'
  | 'MS'
  | 'SN'
  | 'AT_FL'
  | 'AT_SN'
  | 'FL_SN'
  | 'AT_FL_SN'
  | 'BA'
  | 'IKKE_YRKESAKTIV'
  | 'KUN_YTELSE'
  | 'TY'
  | 'VENTELØNN_VARTPENGER'
  | '-';
