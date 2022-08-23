import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import { DynamicLoader, FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode } from '@fpsak-frontend/utils';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

const FaktaBeregningsgrunnlag = React.lazy(() => import('@navikt/ft-fakta-beregning'));

const FaktaBeregningsgrunnlagMF =
  process.env.NODE_ENV !== 'development'
    ? undefined
    : // eslint-disable-next-line import/no-unresolved
      () => import('ft_fakta_beregning/FaktaBeregning');

const transformVedOverstyring = aksjonspunktData =>
  aksjonspunktData.flatMap(data => {
    if (data.kode === aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG) {
      return data.grunnlag.map(gr => ({
        kode: data.kode,
        ...gr,
      }));
    }
    return data;
  });

class BeregningFaktaPanelDef extends FaktaPanelDef {
  // eslint-disable-next-line class-methods-use-this
  getUrlKode = () => faktaPanelCodes.BEREGNING;

  // eslint-disable-next-line class-methods-use-this
  getTekstKode = () => 'BeregningInfoPanel.Title';

  // eslint-disable-next-line class-methods-use-this
  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
    aksjonspunktCodes.AVKLAR_AKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  ];

  // eslint-disable-next-line class-methods-use-this
  getKomponent = props => {
    if (props.featureToggles?.NY_BEREGNING_FAKTA_ENABLED) {
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
          submitCallback={aksjonspunktData => props.submitCallback(transformVedOverstyring(aksjonspunktData))}
          formData={props.formData}
          setFormData={props.setFormData}
          vilkar={bgVilkaret}
          skalKunneOverstyreAktiviteter={false}
          skalKunneAvbryteOverstyring
        />
      );
    }

    return <BeregningFaktaIndex {...props} />;
  };

  // eslint-disable-next-line class-methods-use-this
  getOverstyrVisningAvKomponent = ({ beregningsgrunnlag }) => beregningsgrunnlag;

  // eslint-disable-next-line class-methods-use-this
  getData = ({ rettigheter, beregningsgrunnlag, arbeidsgiverOpplysningerPerId, vilkar, beregningErBehandlet }) => ({
    erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
    vilkar,
    beregningErBehandlet,
  });
}

export default BeregningFaktaPanelDef;
