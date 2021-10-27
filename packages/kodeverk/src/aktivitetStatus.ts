import beregningsgrunnlagAndeltyper from './beregningsgrunnlagAndeltyper';

const aktivitetStatus = {
  MIDLERTIDIG_INAKTIV: 'MIDL_INAKTIV',
  KUN_YTELSE: 'KUN_YTELSE',
  ARBEIDSTAKER: 'AT',
  FRILANSER: 'FL',
  SELVSTENDIG_NAERINGSDRIVENDE: 'SN',
  KOMBINERT_AT_FL: 'AT_FL',
  KOMBINERT_AT_SN: 'AT_SN',
  KOMBINERT_FL_SN: 'FL_SN',
  KOMBINERT_AT_FL_SN: 'AT_FL_SN',
  DAGPENGER: 'DP',
  ARBEIDSAVKLARINGSPENGER: 'AAP',
  SYKEPENGER_AV_DAGPENGER: 'SP_AV_DP',
  MILITAER_ELLER_SIVIL: 'MS',
  BRUKERS_ANDEL: 'BA',
  UDEFINERT: '-',
};

export default aktivitetStatus;

export const aktivitetstatusTilAndeltypeMap = {};
aktivitetstatusTilAndeltypeMap[aktivitetStatus.BRUKERS_ANDEL] = beregningsgrunnlagAndeltyper.BRUKERS_ANDEL;
aktivitetstatusTilAndeltypeMap[aktivitetStatus.FRILANSER] = beregningsgrunnlagAndeltyper.FRILANS;
aktivitetstatusTilAndeltypeMap[aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE] = beregningsgrunnlagAndeltyper.EGEN_NÆRING;

const statuserSomStotterFrilanser = [
  aktivitetStatus.FRILANSER,
  aktivitetStatus.KOMBINERT_AT_FL,
  aktivitetStatus.KOMBINERT_AT_FL_SN,
  aktivitetStatus.KOMBINERT_FL_SN,
];
const statuserSomStotterArbeidstaker = [
  aktivitetStatus.ARBEIDSTAKER,
  aktivitetStatus.KOMBINERT_AT_FL,
  aktivitetStatus.KOMBINERT_AT_FL_SN,
  aktivitetStatus.KOMBINERT_AT_SN,
];
const statuserSomStotterSelvstendigNaeringsdrivende = [
  aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  aktivitetStatus.KOMBINERT_FL_SN,
  aktivitetStatus.KOMBINERT_AT_FL_SN,
  aktivitetStatus.KOMBINERT_AT_SN,
];
const kombinasjonsstatuser = [
  aktivitetStatus.KOMBINERT_AT_FL,
  aktivitetStatus.KOMBINERT_AT_FL_SN,
  aktivitetStatus.KOMBINERT_FL_SN,
  aktivitetStatus.KOMBINERT_AT_SN,
];
const statuserSomStotterDagpenger = [aktivitetStatus.DAGPENGER, aktivitetStatus.SYKEPENGER_AV_DAGPENGER];

const statuserSomStotterDagpengerEllerAAP = [aktivitetStatus.DAGPENGER, aktivitetStatus.SYKEPENGER_AV_DAGPENGER, aktivitetStatus.ARBEIDSAVKLARINGSPENGER];
const statuserSomStotterTilstottendeYtelser = [aktivitetStatus.KUN_YTELSE];
const statuserSomStotterMilitaer = [aktivitetStatus.MILITAER_ELLER_SIVIL];

export const isStatusDagpengerOrAAP = (status: string): boolean => statuserSomStotterDagpengerEllerAAP.includes(status);

export const isStatusDagpenger = (status: string): boolean => statuserSomStotterDagpenger.includes(status);

export const isStatusTilstotendeYtelse = (status: string): boolean =>
  statuserSomStotterTilstottendeYtelser.includes(status);

export const isStatusFrilanserOrKombinasjon = (status: string): boolean => statuserSomStotterFrilanser.includes(status);

export const isStatusArbeidstakerOrKombinasjon = (status: string): boolean =>
  statuserSomStotterArbeidstaker.includes(status);

export const isStatusSNOrKombinasjon = (status: string): boolean =>
  statuserSomStotterSelvstendigNaeringsdrivende.includes(status);

export const isStatusKombinasjon = (status: string): boolean => kombinasjonsstatuser.includes(status);

export const isStatusMilitaer = (status: string): boolean => statuserSomStotterMilitaer.includes(status);
