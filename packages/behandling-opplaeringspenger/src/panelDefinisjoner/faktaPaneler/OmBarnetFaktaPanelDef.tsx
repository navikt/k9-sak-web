import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
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
