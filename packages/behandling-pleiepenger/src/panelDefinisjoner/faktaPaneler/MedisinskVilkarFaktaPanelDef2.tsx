import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak, Personopplysninger } from '@k9-sak-web/types';

import MedisinskVilkår from '../../components/MedisinskVilkår';

class MedisinskVilkarFaktaPanelDef2 extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.MEDISINSKVILKAAR_V2;

  getTekstKode = () => 'MedisinskVilkarPanel.MedisinskVilkar';

  getAksjonspunktKoder = () => [aksjonspunktCodes.MEDISINSK_VILKAAR];

  getEndepunkter = () => [];

  getKomponent = props => <MedisinskVilkår {...props} />;

  getData = ({
    fagsak,
    behandling,
    personopplysninger,
  }: {
    fagsak: Fagsak;
    behandling: Behandling;
    personopplysninger: Personopplysninger;
  }) => ({
    fagsakYtelseType: fagsak.sakstype,
    behandlingType: behandling.type.kode,
    pleietrengendePart: personopplysninger?.pleietrengendePart,
  });

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const erPleiepengesak = fagsak.sakstype === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN;
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return erPleiepengesak && søknadsfristErIkkeUnderVurdering;
  };
}

export default MedisinskVilkarFaktaPanelDef2;
