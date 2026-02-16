import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import type { Behandling, Fagsak } from '@k9-sak-web/types';
import React from 'react';
import OmBarnet from '../../components/OmBarnet';

class OmBarnetFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OM_BARNET;

  getTekstKode = () => 'OmBarnetInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_RETT_ETTER_PLEIETRENGENDES_DØD];

  getEndepunkter = () => [];

  getKomponent = props => <OmBarnet {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const erPleiepengesak = fagsak.sakstype === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN;
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return erPleiepengesak && søknadsfristErIkkeUnderVurdering;
  };
}

export default OmBarnetFaktaPanelDef;
