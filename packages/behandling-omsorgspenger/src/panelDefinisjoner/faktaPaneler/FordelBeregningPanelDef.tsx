import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { DynamicLoader, FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode, transformBeregningValues } from '@fpsak-frontend/utils';
import '@navikt/ft-fakta-fordel-beregningsgrunnlag/dist/style.css';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

const FaktaFordelBeregningsgrunnlag = React.lazy(() => import('@navikt/ft-fakta-fordel-beregningsgrunnlag'));

const FaktaFordelBeregningsgrunnlagMF =
  process.env.NODE_ENV !== 'development'
    ? undefined
    : // eslint-disable-next-line import/no-unresolved
      () => import('ft_fakta_fordel_beregningsgrunnlag/FaktaFordelBeregningsgrunnlag');

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
      <DynamicLoader<React.ComponentProps<typeof FaktaFordelBeregningsgrunnlag>>
        packageCompFn={() => import('@navikt/ft-fakta-fordel-beregningsgrunnlag')}
        federatedCompFn={FaktaFordelBeregningsgrunnlagMF}
        {...props}
        beregningsgrunnlagVilkår={bgVilkaret}
        beregningsgrunnlagListe={deepCopyProps.beregningsgrunnlag}
        arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
        submitCallback={apData => props.submitCallback(transformBeregningValues([apData]))} // Returnerer alltid kun eitt aksjonspunkt om gangen
        formData={props.formData}
        setFormData={props.setFormData}
      />
    );
  };

  getOverstyrVisningAvKomponent = () => false;

  getData = ({ beregningsgrunnlag, arbeidsgiverOpplysningerPerId, vilkar }) => ({
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
    vilkar,
  });
}

export default FordelBeregningPanelDef;
