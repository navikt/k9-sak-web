import React from 'react';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import FeilutbetalingFaktaIndex from '@fpsak-frontend/fakta-feilutbetaling';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak, FeilutbetalingFakta } from '@k9-sak-web/types';

import { TilbakekrevingBehandlingApiKeys } from '../../data/tilbakekrevingBehandlingApi';

class FeilutbetalingFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.FEILUTBETALING;

  getTekstKode = () => 'TilbakekrevingFakta.FaktaFeilutbetaling';

  getAksjonspunktKoder = () => [aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING];

  getKomponent = props => <FeilutbetalingFaktaIndex {...props} />;

  getEndepunkter = () => [TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK];

  getOverstyrVisningAvKomponent = ({ feilutbetalingFakta }) => !!feilutbetalingFakta;

  getData = ({
    feilutbetalingFakta,
    fagsak,
    fpsakKodeverk,
  }: {
    feilutbetalingFakta: FeilutbetalingFakta;
    fagsak: Fagsak;
    fpsakKodeverk: any;
  }) => ({
    feilutbetalingFakta,
    fagsakYtelseTypeKode: fagsak.sakstype.kode,
    fpsakKodeverk,
  });
}

export default FeilutbetalingFaktaPanelDef;
