import { folketrygdloven_kalkulus_kodeverk_FaktaOmBeregningTilfelle as FaktaOmBeregningTilfelle } from '@k9-sak-web/backend/k9sak/generated/types.js';

const vurderFaktaOmBeregningTotrinnText: Record<string, string> = {
  [FaktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD]: 'Det er vurdert om arbeidsforhold er tidsbegrenset.',
  [FaktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL]: 'Det er vurdert om søker er nyoppstartet frilanser.',
  [FaktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET]:
    'Det er vurdert om søker er selvstendig næringsdrivende som er ny i arbeidslivet.',
  [FaktaOmBeregningTilfelle.VURDER_LØNNSENDRING]:
    'Det er vurdert om søker har hatt lønnsendring i løpet av de siste tre månedene',
  [FaktaOmBeregningTilfelle.FASTSETT_MÅNEDSLØNN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING]: 'Arbeidsinntekt er fastsatt',
  [FaktaOmBeregningTilfelle.FASTSETT_BG_ARBEIDSTAKER_UTEN_INNTEKTSMELDING]:
    'Det er fastsatt fordeling av beregningsgrunnlaget for arbeidstaker uten inntektsmelding',
  [FaktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON]:
    'Inntekt er fastsatt for arbeidstaker/frilanser i samme organisajon.',
  [FaktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE]:
    'Det er fastsatt fordeling av beregningsgrunnlaget ved direkte overgang fra ytelse.',
  [FaktaOmBeregningTilfelle.VURDER_ETTERLØNN_SLUTTPAKKE]:
    'Det er vurdert om søker har inntekt fra etterlønn eller sluttpakke.',
  [FaktaOmBeregningTilfelle.FASTSETT_ETTERLØNN_SLUTTPAKKE]:
    'Inntekt er fastsatt for arbeidstaker med etterlønn eller sluttpakke.',
  [FaktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE]: 'Det er vurdert om søker har mottatt ytelse',
  [FaktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL]: 'Frilansinntekt er fastsatt',
  [FaktaOmBeregningTilfelle.VURDER_MILITÆR_SIVILTJENESTE]:
    'Det er vurdert om søker har hatt militær -eller siviltjeneste i opptjeningsperioden',
  [FaktaOmBeregningTilfelle.VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT]:
    'Det er vurdert om refusjonskrav om er fremsatt etter fristen skal tas med i beregning.',
};

export default vurderFaktaOmBeregningTotrinnText;
