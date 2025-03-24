import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import MedlemskapFaktaIndex from '@k9-sak-web/gui/fakta/medlemskap/MedlemskapFaktaIndex.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { UnntakBehandlingApiKeys } from '../../data/unntakBehandlingApi';

class MedlemskapsvilkaretFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.MEDLEMSKAPSVILKARET;

  getTekstKode = () => 'MedlemskapInfoPanel.Medlemskap';

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
    aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
    aksjonspunktCodes.AVKLAR_OPPHOLDSRETT,
    aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD,
    aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP,
  ];

  getEndepunkter = () => [UnntakBehandlingApiKeys.MEDLEMSKAP];

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return <MedlemskapFaktaIndex {...props} {...deepCopyProps} />;
  };

  getOverstyrVisningAvKomponent = ({ personopplysninger, soknad }) => personopplysninger && soknad;

  getData = ({ fagsakPerson, soknad, personopplysninger }) => ({
    fagsakPerson,
    soknad,
    personopplysninger,
  });
}

export default MedlemskapsvilkaretFaktaPanelDef;
