import React from 'react';

import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import FeilutbetalingFaktaIndex from '@fpsak-frontend/fakta-feilutbetaling';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import FeilutbetalingFaktaIndexV2 from '@k9-sak-web/gui/fakta/feilutbetaling/FeilutbetalingFaktaIndex.js';
import { Fagsak, FeilutbetalingFakta } from '@k9-sak-web/types';

import { TilbakekrevingBehandlingApiKeys } from '../../data/tilbakekrevingBehandlingApi';

class FeilutbetalingFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.FEILUTBETALING;

  getTekstKode = () => 'TilbakekrevingFakta.FaktaFeilutbetaling';

  getAksjonspunktKoder = () => [aksjonspunktCodesTilbakekreving.AVKLAR_FAKTA_FOR_FEILUTBETALING];

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_FEILUTBETALING) {
      return (
        <FeilutbetalingFaktaIndexV2
          behandlingUuid={props.behandling.uuid}
          behandlingVersjon={props.behandling.versjon}
          fagsakYtelseType={props.fagsakYtelseTypeKode}
          readOnly={props.readOnly}
          hasOpenAksjonspunkter={props.harApneAksjonspunkter}
          alleMerknaderFraBeslutter={props.alleMerknaderFraBeslutter}
          submitCallback={props.submitCallback}
        />
      );
    }
    return <FeilutbetalingFaktaIndex {...props} />;
  };

  getEndepunkter = featureToggles =>
    featureToggles?.BRUK_V2_FEILUTBETALING ? [] : [TilbakekrevingBehandlingApiKeys.FEILUTBETALING_AARSAK];

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
    fagsakYtelseTypeKode: fagsak.sakstype,
    fpsakKodeverk,
  });
}

export default FeilutbetalingFaktaPanelDef;
