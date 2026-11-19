import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import { findAksjonspunkt } from '@fpsak-frontend/utils';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import BekreftVergeFakta from '@k9-sak-web/gui/fakta/verge/BekreftVergeFakta.js';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import { UnntakBehandlingApiKeys } from '../../data/unntakBehandlingApi';

class VergeFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.VERGE;

  getTekstKode = () => 'RegistrereVergeInfoPanel.Info';

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_VERGE];

  getEndepunkter = () => [UnntakBehandlingApiKeys.VERGE];

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_VERGE) {
      const aksjonspunkt = findAksjonspunkt(props.aksjonspunkter, aksjonspunktCodes.AVKLAR_VERGE);
      const status = Object.values(aksjonspunktStatus).find(kode => kode === aksjonspunkt?.status?.kode);
      return (
        <BekreftVergeFakta
          aksjonspunktStatus={status}
          lagretBegrunnelse={aksjonspunkt?.begrunnelse}
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
