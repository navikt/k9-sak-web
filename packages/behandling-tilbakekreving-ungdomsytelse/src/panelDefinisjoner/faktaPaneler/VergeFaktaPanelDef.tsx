import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import { findAksjonspunkt } from '@fpsak-frontend/utils';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import RegistrerVergeFaktaIndex from '@k9-sak-web/gui/fakta/verge/RegistrerVergeFaktaIndex.js';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { TilbakekrevingBehandlingApiKeys } from '../../data/tilbakekrevingBehandlingApi';

class VergeFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.VERGE;

  getTekstKode = () => 'RegistrereVergeInfoPanel.Info';

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_VERGE];

  getEndepunkter = featureToggles => (featureToggles?.BRUK_V2_VERGE ? [] : [TilbakekrevingBehandlingApiKeys.VERGE]);

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_VERGE) {
      const aksjonspunkt = findAksjonspunkt(props.aksjonspunkter, aksjonspunktCodes.AVKLAR_VERGE);
      const status = Object.values(aksjonspunktStatus).find(kode => kode === aksjonspunkt?.status?.kode);
      return (
        <RegistrerVergeFaktaIndex
          behandlingUuid={props.behandling.uuid}
          behandlingVersjon={props.behandling.versjon}
          aksjonspunktStatus={status}
          readOnly={props.readOnly}
          submittable={props.submittable}
          submitCallback={props.submitCallback}
        />
      );
    }
    return <VergeFaktaIndex {...props} />;
  };
}

export default VergeFaktaPanelDef;
