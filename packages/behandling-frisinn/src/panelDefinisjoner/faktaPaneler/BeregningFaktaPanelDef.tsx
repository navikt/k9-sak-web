import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode, mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { BeregningFaktaIndex } from '@navikt/ft-fakta-beregning';
import { BeregningFaktaIndex as BeregningFaktaIndexRedesign } from '@navikt/ft-fakta-beregning-redesign';

class BeregningFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BEREGNING;

  getTekstKode = () => 'BeregningInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN];

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps);
    const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);
    if (props.featureToggles?.FAKTA_BEREGNING_REDESIGN) {
      return (
        <BeregningFaktaIndexRedesign
          arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
          submitCallback={aksjonspunktData => props.submitCallback(transformBeregningValues(aksjonspunktData))}
          formData={props.formData}
          setFormData={props.setFormData}
          vilkar={mapVilkar(bgVilkaret, props.beregningreferanserTilVurdering)}
          kodeverkSamling={deepCopyProps.alleKodeverk}
          erOverstyrer={false}
          submittable={deepCopyProps.submittable}
          readOnly={deepCopyProps.isReadOnly}
          skalKunneOverstyreAktiviteter={false}
          skalKunneAvbryteOverstyring
        />
      );
    }
    return (
      <BeregningFaktaIndex
        arbeidsgiverOpplysningerPerId={deepCopyProps.arbeidsgiverOpplysningerPerId}
        submitCallback={aksjonspunktData => props.submitCallback(transformBeregningValues(aksjonspunktData))}
        formData={props.formData}
        setFormData={props.setFormData}
        vilkar={mapVilkar(bgVilkaret, props.beregningreferanserTilVurdering)}
        kodeverkSamling={deepCopyProps.alleKodeverk}
        erOverstyrer={false}
        submittable={deepCopyProps.submittable}
        readOnly={deepCopyProps.isReadOnly}
        skalKunneOverstyreAktiviteter={false}
        skalKunneAvbryteOverstyring
      />
    );
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
