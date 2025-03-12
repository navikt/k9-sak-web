import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak, Behandling } from '@k9-sak-web/types';

import LangvarigSyk from "../../components/LangvarigSyk";

class LangvarigSykFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.LANGVARIGSYKVILKAAR;

  getTekstKode = () => 'LangvarigSykPanel.LangvarigSyk';

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_LANGVARIG_SYK];

  getEndepunkter = () => [];

  getKomponent = props => <LangvarigSyk {...props} />;

  getData = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => ({
    fagsakYtelseType: fagsak.sakstype,
    behandlingType: behandling.type.kode,
  });

  getOverstyrVisningAvKomponent = ({ behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return søknadsfristErIkkeUnderVurdering;
  };
}

export default LangvarigSykFaktaPanelDef;
