import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import OmsorgenFor from '../../components/OmsorgenFor';

class OmsorgenForFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OMSORGEN_FOR;

  getTekstKode = () => 'OmsorgenForInfoPanel.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.AVKLAR_OMSORGEN_FOR];

  getEndepunkter = () => [];

  getKomponent = props => <OmsorgenFor {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const erPleiepengesak = fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER;
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return erPleiepengesak && søknadsfristErIkkeUnderVurdering;
  };
}

export default OmsorgenForFaktaPanelDef;
