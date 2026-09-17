import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

import OpptjeningVilkarProsessIndex from '@k9-sak-web/gui/prosess/vilkar-opptjening/OpptjeningVilkarProsessIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { OpplaeringspengerBehandlingApiKeys } from '../../../data/opplaeringspengerBehandlingApi';

class OpptjeningPanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return <OpptjeningVilkarProsessIndex {...props} {...deepCopyProps} />;
  };

  getTekstKode = () => 'Opptjening';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET];

  getVilkarKoder = () => [vilkarType.OPPTJENINGSVILKARET];

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.OPPTJENING];

  getData = ({ fagsak, vilkarForSteg }) => ({
    fagsak,
    lovReferanse: vilkarForSteg[0].lovReferanse,
  });

  getOverstyringspanelDef = () =>
    new ProsessStegOverstyringPanelDef(this, aksjonspunktCodes.OVERSTYRING_AV_OPPTJENINGSVILKARET);
}

export default OpptjeningPanelDef;
