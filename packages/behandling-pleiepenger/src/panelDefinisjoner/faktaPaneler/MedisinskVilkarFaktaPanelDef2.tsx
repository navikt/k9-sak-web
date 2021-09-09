import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak, Behandling } from '@k9-sak-web/types';

import MedisinskVilkår from '../../components/MedisinskVilkår';

class MedisinskVilkarFaktaPanelDef2 extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.MEDISINSKVILKAAR_V2;

  getTekstKode = () => 'MedisinskVilkarPanel.MedisinskVilkar';

  getAksjonspunktKoder = () => [aksjonspunktCodes.MEDISINSK_VILKAAR];

  getEndepunkter = () => [];

  getKomponent = props => <MedisinskVilkår {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const erPleiepengesak = fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER;
    const søknadsfristErIkkeUnderVurdering = (behandling as any).stegTilstand.stegType.kode !== 'VURDER_SØKNADSFRIST';
    const skalVises = erPleiepengesak && søknadsfristErIkkeUnderVurdering;
    return skalVises;
  };
}

export default MedisinskVilkarFaktaPanelDef2;
