import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { konverterKodeverkTilKode, transformBeregningValues } from '@fpsak-frontend/utils';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import NyInntektFaktaIndex from '@k9-sak-web/gui/fakta/ny-inntekt/NyInntektFaktaIndex.js';
import type { FeatureToggles } from '@k9-sak-web/gui/featuretoggles/FeatureToggles.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

class NyInntektPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.NY_INNTEKT;

  getTekstKode = () => 'NyInntekt.Title';

  getAksjonspunktKoder = (featureToggles?: FeatureToggles) => {
    if (featureToggles?.NY_INNTEKT_EGET_PANEL) {
      return [aksjonspunktCodes.VURDER_NYTT_INNTKTSFORHOLD];
    }
    return [];
  };

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps);
    const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
    return (
      <NyInntektFaktaIndex
        {...props}
        beregningsgrunnlagVilkår={bgVilkaret}
        beregningsgrunnlagListe={deepCopyProps.beregningsgrunnlag}
        arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
        submitCallback={data => props.submitCallback(transformBeregningValues([data]))} // Returnerer alltid kun eitt aksjonspunkt om gangen
        formData={props.formData}
        setFormData={props.setFormData}
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

export default NyInntektPanelDef;
