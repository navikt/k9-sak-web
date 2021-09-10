import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak, Behandling } from '@k9-sak-web/types';
import OmBarnet from '../../components/OmBarnet';

class OmBarnetFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OM_BARNET;

  getTekstKode = () => 'OmBarnetInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_RETT_ETTER_PLEIETRENGENDES_DØD];

  getEndepunkter = () => [];

  getKomponent = props => <OmBarnet {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const erPleiepengesak = fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER;
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return erPleiepengesak && søknadsfristErIkkeUnderVurdering;
  };
}

export default OmBarnetFaktaPanelDef;
