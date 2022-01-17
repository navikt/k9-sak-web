import React from 'react';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';
import { ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

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
