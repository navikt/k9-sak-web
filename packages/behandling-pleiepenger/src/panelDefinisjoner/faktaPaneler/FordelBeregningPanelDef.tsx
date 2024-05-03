import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode, transformBeregningValues } from '@k9-sak-web/utils';
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
