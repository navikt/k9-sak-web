import React from 'react';

import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import vilkarType from '@k9-sak-web/kodeverk/src/vilkarType';
import SokersOpplysningspliktVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-sokers-opplysningsplikt';

class SokersOpplysningspliktPanelDef extends ProsessStegPanelDef {
  getId = () => 'SOKERS_OPPLYSNINGSPLIKT';

  getTekstKode = () => 'Inngangsvilkar.Opptjeningsvilkaret';

  getKomponent = props => <SokersOpplysningspliktVilkarProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_OVST,
    aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
  ];

  getAksjonspunktTekstkoder = () => [
    'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
    'SokersOpplysningspliktForm.UtfyllendeOpplysninger',
  ];

  getVilkarKoder = () => [vilkarType.SOKERSOPPLYSNINGSPLIKT];

  getOverstyrVisningAvKomponent = ({ behandling, aksjonspunkterForSteg }) => {
    const isRevurdering = behandlingType.REVURDERING === behandling.type.kode;
    const hasAp = aksjonspunkterForSteg.some(
      ap => ap.definisjon.kode === aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
    );
    return !(isRevurdering && !hasAp);
  };

  getData = ({ soknad }) => ({ soknad });
}

export default SokersOpplysningspliktPanelDef;
