import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { UngInngangsvilkår } from '@k9-sak-web/gui/prosess/ung-inngangsvilkår/UngInngangsvilkår.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

import { VilkårMedPerioderDtoVilkarType } from '@navikt/ung-sak-typescript-client';

class PanelDef extends ProsessStegPanelDef {
  getAksjonspunktKoder = () => [];
  getOverstyrVisningAvKomponent = () => true;
  getData = ({ vilkar }) => ({
    vilkar,
  });

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return <UngInngangsvilkår {...props} {...deepCopyProps} />;
  };

  getVilkarKoder = () => [
    VilkårMedPerioderDtoVilkarType.ALDERSVILKÅR,
    VilkårMedPerioderDtoVilkarType.UNGDOMSPROGRAMVILKÅRET,
  ];
}

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';
  getPanelDefinisjoner = () => [new PanelDef()];
}

export default InngangsvilkarProsessStegPanelDef;
