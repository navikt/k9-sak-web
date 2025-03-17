import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegDef, ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import SykdomProsessIndex from '@k9-sak-web/prosess-vilkar-sykdom';
import React from 'react';
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

    const perioder = vilkar.filter(v => v.vilkarType.kode === vilkarType.LANGVARIG_SYKDOM).flatMap(v => v.perioder);
    return <SykdomProsessIndex {...props} perioder={perioder} />;
  };

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.MEDISINSK_VILKAAR,
    aksjonspunktCodes.VURDER_INSTITUSJON,
    aksjonspunktCodes.VURDER_GJENNOMGÅTT_OPPLÆRING,
    aksjonspunktCodes.VURDER_NØDVENDIGHET,
    aksjonspunktCodes.VURDER_REISETID,
  ];

  getVilkarKoder = () => [vilkarType.LANGVARIG_SYKDOM, vilkarType.GODKJENT_OPPLÆRINGSINSTITUSJON];

  getOverstyrVisningAvKomponent = data => this.overstyringDef.getOverstyrVisningAvKomponent(data);

  getData = data => this.overstyringDef.getData(data);
}

class MedisinskVilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.MEDISINSK_VILKAR;

  getTekstKode = () => 'Behandlingspunkt.SykdomOgOpplaering';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default MedisinskVilkarProsessStegPanelDef;
