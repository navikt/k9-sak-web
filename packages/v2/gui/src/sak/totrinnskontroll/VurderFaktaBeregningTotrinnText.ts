import { FaktaOmBeregningDtoFaktaOmBeregningTilfeller } from '@navikt/k9-sak-typescript-client';

const vurderFaktaOmBeregningTotrinnText = {
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD]:
    'Det er vurdert om arbeidsforhold er tidsbegrenset.',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.VURDER_NYOPPSTARTET_FL]:
    'Det er vurdert om søker er nyoppstartet frilanser.',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.VURDER_SN_NY_I_ARBEIDSLIVET]:
    'Det er vurdert om søker er selvstendig næringsdrivende som er ny i arbeidslivet.',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.VURDER_LØNNSENDRING]:
    'Det er vurdert om søker har hatt lønnsendring i løpet av de siste tre månedene',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.FASTSETT_MÅNEDSLØNN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING]:
    'Arbeidsinntekt er fastsatt',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.FASTSETT_BG_ARBEIDSTAKER_UTEN_INNTEKTSMELDING]:
    'Det er fastsatt fordeling av beregningsgrunnlaget for arbeidstaker uten inntektsmelding',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON]:
    'Inntekt er fastsatt for arbeidstaker/frilanser i samme organisajon.',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.FASTSETT_BG_KUN_YTELSE]:
    'Det er fastsatt fordeling av beregningsgrunnlaget ved direkte overgang fra ytelse.',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.VURDER_ETTERLØNN_SLUTTPAKKE]:
    'Det er vurdert om søker har inntekt fra etterlønn eller sluttpakke.',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.FASTSETT_ETTERLØNN_SLUTTPAKKE]:
    'Inntekt er fastsatt for arbeidstaker med etterlønn eller sluttpakke.',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.VURDER_MOTTAR_YTELSE]: 'Det er vurdert om søker har mottatt ytelse',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.FASTSETT_MAANEDSINNTEKT_FL]: 'Frilansinntekt er fastsatt',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.VURDER_MILITÆR_SIVILTJENESTE]:
    'Det er vurdert om søker har hatt militær -eller siviltjeneste i opptjeningsperioden',
  [FaktaOmBeregningDtoFaktaOmBeregningTilfeller.VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT]:
    'Det er vurdert om refusjonskrav om er fremsatt etter fristen skal tas med i beregning.',
};

export default vurderFaktaOmBeregningTotrinnText;
