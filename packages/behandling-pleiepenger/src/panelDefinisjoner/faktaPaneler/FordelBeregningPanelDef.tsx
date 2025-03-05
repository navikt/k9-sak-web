import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { konverterKodeverkTilKode, transformBeregningValues } from '@fpsak-frontend/utils';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FeatureToggles } from '@k9-sak-web/lib/types/FeatureTogglesType.js';
import { FordelBeregningsgrunnlagFaktaIndex } from '@navikt/ft-fakta-fordel-beregningsgrunnlag';
import '@navikt/ft-fakta-fordel-beregningsgrunnlag/dist/style.css';

class FordelBeregningPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.FORDELING;

  getTekstKode = () => 'FordelBeregningsgrunnlag.Title';

  getAksjonspunktKoder = (featureToggles?: FeatureToggles) => {
    if (featureToggles?.NY_INNTEKT_EGET_PANEL) {
      return [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG, aksjonspunktCodes.VURDER_REFUSJON_BERGRUNN];
    }
    return [
      aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG,
      aksjonspunktCodes.VURDER_REFUSJON_BERGRUNN,
      aksjonspunktCodes.VURDER_NYTT_INNTKTSFORHOLD,
    ];
  };

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps);
    const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
    return (
      <FordelBeregningsgrunnlagFaktaIndex
        {...props}
        beregningsgrunnlagVilkår={bgVilkaret}
        beregningsgrunnlagListe={deepCopyProps.beregningsgrunnlag}
        arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
        kodeverkSamling={deepCopyProps.alleKodeverk}
        submitCallback={data => props.submitCallback(transformBeregningValues([data]))} // Returnerer alltid kun eitt aksjonspunkt om gangen
        formData={props.formData}
        setFormData={props.setFormData}
        skalHåndtereNyInntekt={!props.featureToggles?.NY_INNTEKT_EGET_PANEL}
      />
    );
  };

  getOverstyrVisningAvKomponent = () => false;

  getData = ({ beregningsgrunnlag, arbeidsgiverOpplysningerPerId, vilkar }) => ({
    vilkar,
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
  });
}

export default FordelBeregningPanelDef;
