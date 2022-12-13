import beregningAvklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const mapTilAksjonspunktkode = (avklaringsbehovkode: string): string => {
  switch (avklaringsbehovkode) {
    case beregningAvklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS:
      return aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS;
    case beregningAvklaringsbehovCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE:
      return aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE;
    case beregningAvklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET:
      return aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET;
    case beregningAvklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD:
      return aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD;
    case beregningAvklaringsbehovCodes.VURDER_FAKTA_FOR_ATFL_SN:
      return aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN;
    case beregningAvklaringsbehovCodes.VURDER_REFUSJON_BERGRUNN:
      return aksjonspunktCodes.VURDER_REFUSJON_BERGRUNN;
    case beregningAvklaringsbehovCodes.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON:
      return aksjonspunktCodes.VURDER_VARIG_ENDRET_ARBEIDSSITUASJON;
    case beregningAvklaringsbehovCodes.VURDER_NYTT_INNTKTSFRHLD:
      return aksjonspunktCodes.VURDER_NYTT_INNTKTSFORHOLD;
    case beregningAvklaringsbehovCodes.VURDER_REPRSNTR_STORTNGT:
      return aksjonspunktCodes.VURDER_REPRESENTERER_STORTINGET;
    case beregningAvklaringsbehovCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE:
      return aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE;
    case beregningAvklaringsbehovCodes.AVKLAR_AKTIVITETER:
      return aksjonspunktCodes.AVKLAR_AKTIVITETER;
    case beregningAvklaringsbehovCodes.FORDEL_BEREGNINGSGRUNNLAG:
      return aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG;
    case beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG:
      return aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG;
    case beregningAvklaringsbehovCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER:
      return aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER;
    default:
      return null;
  }
};

export default mapTilAksjonspunktkode;
