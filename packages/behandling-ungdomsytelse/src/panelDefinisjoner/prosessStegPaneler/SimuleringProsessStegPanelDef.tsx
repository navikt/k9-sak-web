import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { AksjonspunktDtoDefinisjon } from '@k9-sak-web/backend/k9sak/generated';

import { UngdomsytelseBehandlingApiKeys } from '../../data/ungdomsytelseBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <AvregningProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    AksjonspunktDtoDefinisjon.VURDER_FEILUTBETALING,
    AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
  ];
  getEndepunkter = () => [UngdomsytelseBehandlingApiKeys.TILBAKEKREVINGVALG];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ simuleringResultat }) =>
    simuleringResultat ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT;

  getData = ({ fagsak, previewFptilbakeCallback, simuleringResultat }) => ({
    fagsak,
    previewFptilbakeCallback,
    simuleringResultat,
  });
}

class SimuleringProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.AVREGNING;

  getTekstKode = () => 'Behandlingspunkt.Avregning';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default SimuleringProsessStegPanelDef;
