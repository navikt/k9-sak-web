import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { BeregningFaktaIndex } from '@navikt/ft-fakta-beregning-redesign';
import { OmsorgspengerBehandlingApiKeys } from '../../data/omsorgspengerBehandlingApi';

class BeregningFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BEREGNING;

  getEndepunkterUtenCaching = () => [OmsorgspengerBehandlingApiKeys.BEREGNINGSGRUNNLAG];

  getTekstKode = () => 'BeregningInfoPanel.Title';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
    aksjonspunktCodes.AVKLAR_AKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
    aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
  ];

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
