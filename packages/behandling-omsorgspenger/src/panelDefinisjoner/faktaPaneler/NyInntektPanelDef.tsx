import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { konverterKodeverkTilKode, transformBeregningValues } from '@fpsak-frontend/utils';
import { BeregningsgrunnlagDto } from '@k9-sak-web/backend/k9sak/kontrakt/beregningsgrunnlag/BeregningsgrunnlagDto.js';
import { AvklaringsbehovDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/AvklaringsbehovDefinisjon.js';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import NyInntektFaktaIndex from '@k9-sak-web/gui/fakta/ny-inntekt/NyInntektFaktaIndex.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';

class NyInntektPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.NY_INNTEKT;

  getTekstKode = () => 'NyInntekt.Title';

  getAksjonspunktKoder = () => {
    return [AksjonspunktDefinisjon.VURDER_NYTT_INNTEKTSFORHOLD];
  };

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps);
    const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
    return (
      <NyInntektFaktaIndex
        {...deepCopyProps}
        beregningsgrunnlagVilkår={bgVilkaret}
        beregningsgrunnlagListe={deepCopyProps.beregningsgrunnlag}
        arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
        submitCallback={data => props.submitCallback(transformBeregningValues([data]))} // Returnerer alltid kun eitt aksjonspunkt om gangen
        formData={props.formData}
        setFormData={props.setFormData}
      />
    );
  };

  getOverstyrVisningAvKomponent = ({ beregningsgrunnlag: bg }: { beregningsgrunnlag: any }) => {
    if (!bg) {
      return false;
    }
    const beregningsgrunnlag: BeregningsgrunnlagDto[] = JSON.parse(JSON.stringify(bg));
    konverterKodeverkTilKode(beregningsgrunnlag);

    const harNyInntekt =
      beregningsgrunnlag.some(bg => bg.avklaringsbehov) &&
      beregningsgrunnlag.some(
        bg =>
          bg.avklaringsbehov.filter(v => v.definisjon === AvklaringsbehovDefinisjon.VURDER_NYTT_INNTKTSFRHLD).length >
          0,
      );
    return harNyInntekt;
  };

  getData = ({ beregningsgrunnlag, arbeidsgiverOpplysningerPerId, vilkar }) => ({
    vilkar,
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
  });
}

export default NyInntektPanelDef;
