import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { konverterKodeverkTilKode, mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { BeregningFaktaIndex } from '@navikt/ft-fakta-beregning';
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
    const deepCopyProps = structuredClone(props);
    konverterKodeverkTilKode(deepCopyProps);
    const bgVilkaret = deepCopyProps.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);

    return (
      <BeregningFaktaIndex
        {...deepCopyProps}
        kodeverkSamling={deepCopyProps.alleKodeverk}
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
