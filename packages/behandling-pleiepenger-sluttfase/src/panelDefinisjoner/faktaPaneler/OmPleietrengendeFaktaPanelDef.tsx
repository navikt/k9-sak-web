import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import OmPleietrengende from '../../components/OmPleietrengende';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

class OmPleietrengendeFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OM_PLEIETRENGENDE;

  getTekstKode = () => 'OmPleietrengendeInfoPanel.Title';

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.OM_PLEIETRENGENDE];

  getKomponent = props => <OmPleietrengende {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER_SLUTTFASE && søknadsfristErIkkeUnderVurdering;
  };
}

export default OmPleietrengendeFaktaPanelDef;
