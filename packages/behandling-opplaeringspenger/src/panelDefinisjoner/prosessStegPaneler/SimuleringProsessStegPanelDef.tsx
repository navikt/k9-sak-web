import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';

import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <AvregningProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_FEILUTBETALING];

  getEndepunkter = () => [OpplaeringspengerBehandlingApiKeys.TILBAKEKREVINGVALG];

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
