import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegDef, ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import SykdomProsessIndex from '@k9-sak-web/prosess-vilkar-sykdom';
import * as React from 'react';

class PanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getKomponent = props => {
    if (props.vilkar && props.vilkar.length === 2) {
      const vilkårUnder18 = props.vilkar[0];
      const vilkarOver18 = props.vilkar[1];
      return (
        <>
          {vilkårUnder18?.perioder?.length > 0 && <SykdomProsessIndex {...props} vilkar={vilkårUnder18} />}
          {vilkarOver18?.perioder?.length > 0 && <SykdomProsessIndex {...props} vilkar={vilkarOver18} />}
        </>
      );
    }
    return null;
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.MEDISINSK_VILKAAR];

  getVilkarKoder = () => [vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR, vilkarType.MEDISINSKEVILKÅR_18_ÅR];

  getOverstyrVisningAvKomponent = data => this.overstyringDef.getOverstyrVisningAvKomponent(data);

  getData = data => this.overstyringDef.getData(data);
}

class MedisinskVilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.MEDISINSK_VILKAR;

  getTekstKode = () => 'Behandlingspunkt.MedisinskVilkar';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default MedisinskVilkarProsessStegPanelDef;
