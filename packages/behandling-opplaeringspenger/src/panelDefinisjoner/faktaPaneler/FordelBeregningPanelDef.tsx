import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { transformBeregningValues } from '@fpsak-frontend/utils';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FordelBeregningsgrunnlagFaktaIndex } from '@navikt/ft-fakta-fordel-beregningsgrunnlag';
import '@navikt/ft-fakta-fordel-beregningsgrunnlag/dist/style.css';

class FordelBeregningPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.FORDELING;

  getTekstKode = () => 'FordelBeregningsgrunnlag.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG,
    aksjonspunktCodes.VURDER_REFUSJON_BERGRUNN,
    aksjonspunktCodes.VURDER_NYTT_INNTKTSFORHOLD,
  ];

  getKomponent = props => {
    const {
      vilkar,
      beregningsgrunnlag,
      arbeidsgiverOpplysningerPerId,
      alleKodeverk,
      formData,
      setFormData,
      submitCallback,
    } = props;
    const bgVilkaret = vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
    return (
      <FordelBeregningsgrunnlagFaktaIndex
        {...props}
        beregningsgrunnlagVilkår={bgVilkaret}
        beregningsgrunnlagListe={beregningsgrunnlag}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        kodeverkSamling={alleKodeverk}
        submitCallback={data => submitCallback(transformBeregningValues([data]))} // Returnerer alltid kun eitt aksjonspunkt om gangen
        formData={formData}
        setFormData={setFormData}
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
