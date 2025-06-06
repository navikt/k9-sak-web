import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { konverterKodeverkTilKode, mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { BeregningFaktaIndex } from '@navikt/ft-fakta-beregning';
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
    const deepCopyProps = JSON.parse(JSON.stringify(props));
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
        skalKunneOverstyreAktiviteter={props.featureToggles && props.featureToggles.OVERSTYR_BEREGNING}
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
