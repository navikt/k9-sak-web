import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef, VersjonsvelgerV1V2 } from '@k9-sak-web/behandling-felles';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import OmPleietrengendeFaktaIndex from '@k9-sak-web/gui/fakta/om-pleietrengende/OmPleietrengendeFaktaIndex.js';
import OmPleietrengende from '../../components/OmPleietrengende';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

class OmPleietrengendeFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OM_PLEIETRENGENDE;

  getTekstKode = () => 'OmPleietrengendeInfoPanel.Title';

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.OM_PLEIETRENGENDE];

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_OM_PLEIETRENGENDE) {
      return (
        <VersjonsvelgerV1V2
          v1={<OmPleietrengende {...props} />}
          v2={<OmPleietrengendeFaktaIndex behandlingUuid={props.behandling.uuid} />}
        />
      );
    }
    return <OmPleietrengende {...props} />;
  };

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return fagsak.sakstype === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE && søknadsfristErIkkeUnderVurdering;
  };
}

export default OmPleietrengendeFaktaPanelDef;
