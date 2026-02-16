import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import type { Behandling, Fagsak } from '@k9-sak-web/types';
import React from 'react';
import OmPleietrengende from '../../components/OmPleietrengende';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

class OmPleietrengendeFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OM_PLEIETRENGENDE;

  getTekstKode = () => 'OmPleietrengendeInfoPanel.Title';

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.OM_PLEIETRENGENDE];

  getKomponent = props => <OmPleietrengende {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return fagsak.sakstype === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE && søknadsfristErIkkeUnderVurdering;
  };
}

export default OmPleietrengendeFaktaPanelDef;
