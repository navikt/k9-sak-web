import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegDef, ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import React from 'react';
import { Vilkar } from '@k9-sak-web/types';
import LangvarigSykVilkarProsessIndex
  from "../../../../prosess-vilkar-langvarig-syk/src/LangvarigSykVilkarProsessIndex";

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
    return <LangvarigSykVilkarProsessIndex {...props} perioder={perioder} />;
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_LANGVARIG_SYK];

  getVilkarKoder = () => [vilkarType.LANGVARIG_SYKDOM];

  getOverstyrVisningAvKomponent = data => this.overstyringDef.getOverstyrVisningAvKomponent(data);

  getData = data => this.overstyringDef.getData(data);
}

class MedisinskVilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.MEDISINSK_VILKAR;

  getTekstKode = () => 'Behandlingspunkt.LangvarigSyk';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default MedisinskVilkarProsessStegPanelDef;
