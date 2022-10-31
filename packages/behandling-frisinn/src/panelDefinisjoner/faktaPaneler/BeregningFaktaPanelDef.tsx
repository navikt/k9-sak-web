import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
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

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN];

  getKomponent = props => {
    if (props.featureToggles?.NY_BEREGNING_FAKTA_ENABLED) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps);
      const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
      return (
        <DynamicLoader<React.ComponentProps<typeof FaktaBeregningsgrunnlag>>
          packageCompFn={() => import('@navikt/ft-fakta-beregning')}
          federatedCompFn={FaktaBeregningsgrunnlagMF}
          arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
          submitCallback={aksjonspunktData => props.submitCallback(transformBeregningValues(aksjonspunktData))}
          formData={props.formData}
          setFormData={props.setFormData}
          vilkar={mapVilkar(bgVilkaret, props.beregningreferanserTilVurdering)}
          alleKodeverk={deepCopyProps.alleKodeverk}
          erOverstyrer={false}
          submittable={deepCopyProps.submittable}
          readOnly={deepCopyProps.isReadOnly}
          skalKunneOverstyreAktiviteter={false}
          skalKunneAvbryteOverstyring
        />
      );
    }

    return <BeregningFaktaIndex {...props} />;
  };

  getOverstyrVisningAvKomponent = ({ beregningsgrunnlag }) => !!beregningsgrunnlag;

  getData = ({ beregningsgrunnlag, arbeidsgiverOpplysningerPerId, vilkar, beregningreferanserTilVurdering }) => ({
    erOverstyrer: false,
    beregningsgrunnlag: beregningsgrunnlag ? [beregningsgrunnlag[0]] : [], // FRISINN skal kun vise ett beregningsgrunnlag
    arbeidsgiverOpplysningerPerId,
    vilkar,
    beregningreferanserTilVurdering,
  });
}

export default BeregningFaktaPanelDef;
