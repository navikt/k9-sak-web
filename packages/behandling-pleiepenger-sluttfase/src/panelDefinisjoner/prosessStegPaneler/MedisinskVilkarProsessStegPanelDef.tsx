import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessStegDef, ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import MedisinskVilkarProsessIndex from '@k9-sak-web/gui/prosess/vilkar-sykdom/MedisinskVilkarProsessIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
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
    const vilkarPleiepengerLivetsSluttfase = vilkar.find(
      v => v.vilkarType.kode === vilkarType.PLEIEPENGER_LIVETS_SLUTTFASE,
    );
    const perioder = vilkarPleiepengerLivetsSluttfase?.perioder.map(periode => ({
      ...periode,
      pleietrengendeErOver18år: true,
    }));
    const deepCopyProps = JSON.parse(
      JSON.stringify({ perioder, lovReferanse: props.lovReferanse, panelTittel: 'Livets sluttfase' }),
    );
    konverterKodeverkTilKode(deepCopyProps, false);
    return <MedisinskVilkarProsessIndex {...deepCopyProps} />;
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.MEDISINSK_VILKAAR];

  getVilkarKoder = () => [vilkarType.PLEIEPENGER_LIVETS_SLUTTFASE];

  getOverstyrVisningAvKomponent = data => this.overstyringDef.getOverstyrVisningAvKomponent(data);

  getData = data => this.overstyringDef.getData(data);
}

class MedisinskVilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.MEDISINSK_VILKAR;

  getTekstKode = () => 'Behandlingspunkt.LivetsSluttfase';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default MedisinskVilkarProsessStegPanelDef;
