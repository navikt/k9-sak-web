import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';

import { UngdomsytelseBehandlingApiKeys } from '../../data/ungdomsytelseBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <CheckPersonStatusIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_PERSONSTATUS];

  getEndepunkter = () => [UngdomsytelseBehandlingApiKeys.MEDLEMSKAP];

  getData = ({ personopplysninger }) => ({
    personopplysninger,
  });
}

class SaksopplysningerProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.SAKSOPPLYSNINGER;

  getTekstKode = () => 'Behandlingspunkt.Saksopplysninger';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default SaksopplysningerProsessStegPanelDef;
