import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import { FaktaPanelDef, DynamicLoader } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode } from '@fpsak-frontend/utils';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

const FaktaBeregningsgrunnlag = React.lazy(() => import('@navikt/ft-fakta-beregning'));

const FaktaBeregningsgrunnlagMF =
  process.env.NODE_ENV !== 'development'
    ? undefined
    : // eslint-disable-next-line import/no-unresolved
      () => import('ft_fakta_beregning/FaktaBeregning');

class BeregningFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BEREGNING;

  getTekstKode = () => 'BeregningInfoPanel.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
    aksjonspunktCodes.AVKLAR_AKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  ];

  getKomponent = props => {
    if (props.featureToggles?.NY_BEREGNING_FAKTA_ENABLED) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps);
      const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
      return (
        <DynamicLoader<React.ComponentProps<typeof FaktaBeregningsgrunnlag>>
          packageCompFn={() => import('@navikt/ft-fakta-beregning')}
          federatedCompFn={FaktaBeregningsgrunnlagMF}
          {...props}
          arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
          submitCallback={props.submitCallback}
          formData={props.formData}
          setFormData={props.setFormData}
          vilkar={bgVilkaret}
        />
      );
    }

    return <BeregningFaktaIndex {...props} />;
  };

  getOverstyrVisningAvKomponent = ({ beregningsgrunnlag }) => beregningsgrunnlag;

  getData = ({ rettigheter, beregningsgrunnlag, arbeidsgiverOpplysningerPerId, vilkar, beregningErBehandlet }) => ({
    erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
    vilkar,
    beregningErBehandlet,
  });
}

export default BeregningFaktaPanelDef;
