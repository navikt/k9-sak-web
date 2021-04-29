import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegDef, ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import SykdomProsessIndex from '@k9-sak-web/prosess-vilkar-sykdom';
import * as React from 'react';
import { Vilkar } from '@k9-sak-web/types';

interface Props {
  vilkar: Vilkar[];
  lovReferanse?: string;
  panelTittelKode: string;
}

class PanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getKomponent = (props: Props) => {
    const { vilkar } = props;
    const vilkårPleietrengendeUnder18år = vilkar.find(
      v => v.vilkarType.kode === vilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR,
    );
    const vilkårPleietrengendeOver18år = vilkar.find(v => v.vilkarType.kode === vilkarType.MEDISINSKEVILKÅR_18_ÅR);
    return (
      <>
        {vilkårPleietrengendeUnder18år?.perioder?.length > 0 && (
          <SykdomProsessIndex {...props} vilkar={vilkårPleietrengendeUnder18år} />
        )}
        {vilkårPleietrengendeOver18år?.perioder?.length > 0 && (
          <SykdomProsessIndex
            {...props}
            panelTittelKode="Behandlingspunkt.MedisinskVilkarOver18" // TODO: Finne fornuftig tekst i tittel
            vilkar={vilkårPleietrengendeOver18år}
          />
        )}
      </>
    );
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
