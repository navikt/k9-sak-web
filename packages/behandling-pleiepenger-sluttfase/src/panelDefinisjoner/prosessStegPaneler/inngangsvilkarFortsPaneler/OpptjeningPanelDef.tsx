import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import OpptjeningVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-opptjening-oms';
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

import OpptjeningVilkarProsessIndexV2 from '@k9-sak-web/gui/prosess/vilkar-opptjening/OpptjeningVilkarProsessIndexV2.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../../data/pleiepengerSluttfaseBehandlingApi';

class OpptjeningPanelDef extends ProsessStegPanelDef {
  getId = () => 'OPPTJENING';

  getTekstKode = () => 'Opptjening';

  getKomponent = props => {
    if (props.featureToggles.BRUK_V2_VILKAR_OPPTJENING) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps, false);
      return <OpptjeningVilkarProsessIndexV2 {...props} {...deepCopyProps} />;
    }
    return <OpptjeningVilkarProsessIndex {...props} />;
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET];

  getVilkarKoder = () => [vilkarType.OPPTJENINGSVILKARET];

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.OPPTJENING];

  getData = ({ fagsak, vilkarForSteg }) => ({
    fagsak,
    lovReferanse: vilkarForSteg[0].lovReferanse,
  });

  getOverstyringspanelDef = () =>
    new ProsessStegOverstyringPanelDef(this, aksjonspunktCodes.OVERSTYRING_AV_OPPTJENINGSVILKARET);
}

export default OpptjeningPanelDef;
