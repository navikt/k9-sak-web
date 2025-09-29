import React from 'react';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import TilbakekrevingProsessIndex from '@fpsak-frontend/prosess-tilbakekreving';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { getAlleMerknaderFraBeslutter, ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';

import { TilbakekrevingBehandlingApiKeys } from '../../data/tilbakekrevingBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <TilbakekrevingProsessIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getAksjonspunktKoder = () => [aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING];

  getEndepunkter = () => [
    TilbakekrevingBehandlingApiKeys.VILKARVURDERINGSPERIODER,
    TilbakekrevingBehandlingApiKeys.VILKARVURDERING,
  ];

  getData = ({ behandling, aksjonspunkterForSteg, perioderForeldelse, fagsakPerson, beregnBelop }) => ({
    perioderForeldelse,
    beregnBelop,
    navBrukerKjonn: fagsakPerson.erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
    alleMerknaderFraBeslutter: getAlleMerknaderFraBeslutter(behandling, aksjonspunkterForSteg),
  });
}

class TilbakekrevingProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.TILBAKEKREVING;

  getTekstKode = () => 'Behandlingspunkt.Tilbakekreving';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default TilbakekrevingProsessStegPanelDef;
