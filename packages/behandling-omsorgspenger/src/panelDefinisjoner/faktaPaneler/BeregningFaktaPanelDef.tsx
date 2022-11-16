import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef, DynamicLoader } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode, mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
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
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps);
    const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
    return (
      <DynamicLoader<React.ComponentProps<typeof FaktaBeregningsgrunnlag>>
        packageCompFn={() => import('@navikt/ft-fakta-beregning')}
        federatedCompFn={FaktaBeregningsgrunnlagMF}
        {...deepCopyProps}
        beregningsgrunnlag={deepCopyProps.beregningsgrunnlag}
        arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
        submitCallback={aksjonspunktData => props.submitCallback(transformBeregningValues(aksjonspunktData))}
        formData={props.formData}
        setFormData={props.setFormData}
        vilkar={mapVilkar(bgVilkaret, props.beregningreferanserTilVurdering)}
        skalKunneOverstyreAktiviteter={false}
        skalKunneAvbryteOverstyring
      />
    );
  };

  getOverstyrVisningAvKomponent = ({ beregningsgrunnlag }) => beregningsgrunnlag && beregningsgrunnlag.length > 0;

  getData = ({
    rettigheter,
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
    vilkar,
    beregningreferanserTilVurdering,
  }) => ({
    erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
    vilkar,
    beregningreferanserTilVurdering,
  });
}

export default BeregningFaktaPanelDef;
