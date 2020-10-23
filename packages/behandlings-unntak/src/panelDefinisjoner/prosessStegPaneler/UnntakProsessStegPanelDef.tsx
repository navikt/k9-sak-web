import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import UnntakProsessIndex from '@k9-sak-web/prosess-unntak';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';

import unntakBehandlingApi from '../../data/unntakBehandlingApi';

// MANUELL_TILKJENT_YTELSE: '5057',
// MANUELL_VURDERING_VILKÅR: '5059',

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UnntakProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.MANUELL_VURDERING_VILKÅR];

  getEndepunkter = () => [unntakBehandlingApi.TILBAKEKREVINGVALG];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ simuleringResultat }) =>
    simuleringResultat ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT;

  getData = ({ fagsak, featureToggles, previewFptilbakeCallback, simuleringResultat }) => ({
    fagsak,
    featureToggles,
    previewFptilbakeCallback,
    simuleringResultat,
  });
}

class UnntakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UNNTAK;

  getTekstKode = () => 'Behandlingspunkt.Unntak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UnntakProsessStegPanelDef;
