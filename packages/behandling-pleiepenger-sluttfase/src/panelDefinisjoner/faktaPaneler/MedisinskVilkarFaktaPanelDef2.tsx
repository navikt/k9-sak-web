import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak, Behandling } from '@k9-sak-web/types';

import MedisinskVilkår from '../../components/MedisinskVilkår';

class MedisinskVilkarFaktaPanelDef2 extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.MEDISINSKVILKAAR_V2;

  getTekstKode = () => 'LivetsSluttfasePanel.LivetsSluttfase';

  getAksjonspunktKoder = () => [aksjonspunktCodes.MEDISINSK_VILKAAR];

  getEndepunkter = () => [];

  getKomponent = props => <MedisinskVilkår {...props} />;

  getData = ({
    hentSaksbehandlere,
    fagsak,
    behandling,
  }: {
    hentSaksbehandlere: any;
    fagsak: Fagsak;
    behandling: Behandling;
  }) => ({
    saksbehandlere: hentSaksbehandlere?.saksbehandlere,
    fagsakYtelseType: fagsak.sakstype,
    behandlingType: behandling.type,
  });

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const erPleiepengesak = fagsak.sakstype === fagsakYtelseType.PLEIEPENGER_SLUTTFASE;
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return erPleiepengesak && søknadsfristErIkkeUnderVurdering;
  };
}

export default MedisinskVilkarFaktaPanelDef2;
