import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak, Behandling } from '@k9-sak-web/types';

import MedisinskVilkarFaktaIndex from '@k9-sak-web/fakta-medisinsk-vilkar/src/MedisinskVilkarFaktaIndex';

class MedisinskVilkarFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.MEDISINSKVILKAAR;

  getTekstKode = () => 'MedisinskVilkarPanel.MedisinskVilkar';

  getAksjonspunktKoder = () => [aksjonspunktCodes.MEDISINSK_VILKAAR];

  getEndepunkter = () => [];

  getKomponent = props => {
    console.log("Her er props ... ", props);
    return <MedisinskVilkarFaktaIndex {...props} />;
  }

  getData = ({ hentSaksbehandlere, fagsak }) => ({
    saksbehandlere: hentSaksbehandlere?.saksbehandlere,
    erFagytelsetypePPN: fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER_SLUTTFASE
  });

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const erPleiepengesak = fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER;
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return erPleiepengesak && søknadsfristErIkkeUnderVurdering;
  };
}

export default MedisinskVilkarFaktaPanelDef;
