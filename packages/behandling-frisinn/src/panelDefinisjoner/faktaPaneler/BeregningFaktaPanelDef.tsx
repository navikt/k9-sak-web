import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { mapVilkar, transformBeregningValues } from '@fpsak-frontend/utils';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { BeregningFaktaIndex } from '@navikt/ft-fakta-beregning';
import { FrisinnBehandlingApiKeys } from '../../data/frisinnBehandlingApi';

class BeregningFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.BEREGNING;

  getEndepunkterUtenCaching = () => [FrisinnBehandlingApiKeys.BEREGNINGSGRUNNLAG];

  getTekstKode = () => 'BeregningInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN];

  getKomponent = props => {
    const bgVilkaret = props.vilkar.find(v => v.vilkarType === vilkarType.BEREGNINGSGRUNNLAGVILKARET);

    return (
      <BeregningFaktaIndex
        arbeidsgiverOpplysningerPerId={props.arbeidsgiverOpplysningerPerId}
        submitCallback={aksjonspunktData => props.submitCallback(transformBeregningValues(aksjonspunktData))}
        formData={props.formData}
        setFormData={props.setFormData}
        vilkar={mapVilkar(bgVilkaret, props.beregningreferanserTilVurdering)}
        kodeverkSamling={props.alleKodeverk}
        erOverstyrer={false}
        submittable={props.submittable}
        readOnly={props.isReadOnly}
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
