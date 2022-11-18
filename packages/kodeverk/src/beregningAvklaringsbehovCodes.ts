import { BeregningAvklaringsbehov } from '@k9-sak-web/types';

const avklaringsbehovCodes = {
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS: '5038',
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE: '5039',
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE: '5042',
  FORDEL_BEREGNINGSGRUNNLAG: '5046',
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD: '5047',
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET: '5049',
  AVKLAR_AKTIVITETER: '5052',
  VURDER_FAKTA_FOR_ATFL_SN: '5058',
  VURDER_REFUSJON_BERGRUNN: '5059',
  OVERSTYR_BEREGNING: '6007',
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER: '6014',
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG: '6015',
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
