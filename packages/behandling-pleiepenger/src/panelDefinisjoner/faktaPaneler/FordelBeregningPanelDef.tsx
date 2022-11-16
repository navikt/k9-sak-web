import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef, DynamicLoader } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode } from '@fpsak-frontend/utils';
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
        behandlingType={deepCopyProps.behandling.type}
        beregningsgrunnlagVilkår={bgVilkaret}
        beregningsgrunnlagListe={deepCopyProps.beregningsgrunnlag}
        arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
        submitCallback={apData => props.submitCallback([apData])} // Returnerer alltid kun eitt aksjonspunkt om gangen
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
