import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { TiDagerProsessIndex } from '@k9-sak-web/gui/prosess/ti-dager/TiDagerProsess.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <TiDagerProsessIndex {...props} behandlingUUID={props.behandling.uuid} />;

  getAksjonspunktKoder = () => [AksjonspunktDefinisjon.VURDER_RETT_FRA_DAG_EN];

  getOverstyrVisningAvKomponent = props => {
    if (props.aksjonspunkterForSteg?.length > 0) {
      return true;
    }
    return false;
  };

  getEndepunkter = () => [];

  getData = ({ arbeidsgiverOpplysningerPerId }) => ({ arbeidsgiverOpplysningerPerId });
}

class TiDagerProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.TI_DAGER;

  getTekstKode = () => 'Ti dager';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default TiDagerProsessStegPanelDef;
