import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';

import { FrisinnBehandlingApiKeys } from '../../data/frisinnBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <AvregningProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
    AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
  ];

  getEndepunkter = () => [FrisinnBehandlingApiKeys.TILBAKEKREVINGVALG];

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
