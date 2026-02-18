import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { UngInngangsvilkår } from '@k9-sak-web/gui/prosess/ung-inngangsvilkår/UngInngangsvilkår.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { ung_kodeverk_vilkår_VilkårType as VilkårType } from '@k9-sak-web/backend/ungsak/generated/types.js';

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

  getVilkarKoder = () => [VilkårType.ALDERSVILKÅR, VilkårType.UNGDOMSPROGRAMVILKÅRET];
}

class InngangsvilkarProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.INNGANGSVILKAR;

  getTekstKode = () => 'Behandlingspunkt.Inngangsvilkar';
  getPanelDefinisjoner = () => [new PanelDef()];
}

export default InngangsvilkarProsessStegPanelDef;
