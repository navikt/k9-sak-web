import { BeregningAvklaringsbehov } from '@k9-sak-web/types';

const avklaringsbehovCodes = {
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS: 'FASTSETT_BG_AT_FL',
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE: 'VURDER_VARIG_ENDRT_NYOPPSTR_NAERNG_SN',
  VURDER_VARIG_ENDRET_ARBEIDSSITUASJON: 'VURDER_VARIG_ENDRT_ARB_SITSJN_MDL_INAKTV',
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE: 'FASTSETT_BG_SN',
  FORDEL_BEREGNINGSGRUNNLAG: 'FORDEL_BG',
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD: 'FASTSETT_BG_TB_ARB',
  VURDER_NYTT_INNTKTSFRHLD: 'VURDER_NYTT_INNTKTSFRHLD',
  VURDER_REPRSNTR_STORTNGT: 'VURDER_REPRSNTR_STORTNGT',
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET: 'FASTSETT_BG_SN_NY_I_ARB_LIVT',
  AVKLAR_AKTIVITETER: 'AVKLAR_AKTIVITETER',
  VURDER_FAKTA_FOR_ATFL_SN: 'VURDER_FAKTA_ATFL_SN',
  VURDER_REFUSJON_BERGRUNN: 'VURDER_REFUSJONSKRAV',
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER: 'OVST_BEREGNINGSAKTIVITETER',
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG: 'OVST_INNTEKT',
};

const beregningsgrunnlagFritekstfeltIVedtakAksjonspunkt = [
  avklaringsbehovCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
];

const løsesIBeregningspunkt = [
  avklaringsbehovCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  avklaringsbehovCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
];

const avklaringsbehovIsOfType =
  (validAksjonspunktCodes: string[]) =>
  (aksjonspunktCode: string): boolean =>
    validAksjonspunktCodes.includes(aksjonspunktCode);

export const harAvklaringsbehov = (avklaringsbehovCode: string, avklaringsbehov: BeregningAvklaringsbehov[]): boolean =>
  avklaringsbehov.some(ap => ap.definisjon === avklaringsbehovCode);

export const harAvklaringsbehovSomKanLøses = (
  avklaringsbehovCode: string,
  avklaringsbehov: BeregningAvklaringsbehov[],
): boolean => avklaringsbehov.some(ap => ap.definisjon === avklaringsbehovCode && ap.kanLoses);

export const isBGAksjonspunktSomGirFritekstfelt = avklaringsbehovIsOfType(
  beregningsgrunnlagFritekstfeltIVedtakAksjonspunkt,
);

export const isBeregningAvklaringsbehov = avklaringsbehovIsOfType(løsesIBeregningspunkt);

export default avklaringsbehovCodes;
