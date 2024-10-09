import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { BeregningFaktaIndex } from '@navikt/ft-fakta-beregning-redesign';
import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class BeregningFaktaPanelDef extends FaktaPanelDef {
  // eslint-disable-next-line class-methods-use-this
  getUrlKode = () => faktaPanelCodes.BEREGNING;

  getEndepunkterUtenCaching = () => [PleiepengerBehandlingApiKeys.BEREGNINGSGRUNNLAG];

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
    const {
      vilkar,
      alleKodeverk,
      beregningsgrunnlag,
      arbeidsgiverOpplysningerPerId,
      submitCallback,
      formData,
      setFormData,
      beregningreferanserTilVurdering,
      featureToggles,
    } = props;
    const bgVilkaret = vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);

    return (
      <BeregningFaktaIndex
        {...props}
        kodeverkSamling={alleKodeverk}
        beregningsgrunnlag={beregningsgrunnlag}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        submitCallback={aksjonspunktData => submitCallback(transformBeregningValues(aksjonspunktData))}
        formData={formData}
        setFormData={setFormData}
        vilkar={mapVilkar(bgVilkaret, beregningreferanserTilVurdering)}
        skalKunneOverstyreAktiviteter={featureToggles && featureToggles.OVERSTYR_BEREGNING}
        skalKunneAvbryteOverstyring
      />
    );
  };

  // eslint-disable-next-line class-methods-use-this
  getOverstyrVisningAvKomponent = ({ beregningsgrunnlag }) => beregningsgrunnlag;

  // eslint-disable-next-line class-methods-use-this
  getData = ({
    rettigheter,
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
    vilkar,
    beregningErBehandlet,
    beregningreferanserTilVurdering,
  }) => ({
    erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
    beregningsgrunnlag,
    arbeidsgiverOpplysningerPerId,
    vilkar,
    beregningErBehandlet,
    beregningreferanserTilVurdering,
  });
}

export default BeregningFaktaPanelDef;
