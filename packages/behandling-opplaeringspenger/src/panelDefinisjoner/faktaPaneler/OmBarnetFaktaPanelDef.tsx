import React from 'react';

import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { findAksjonspunkt } from '@fpsak-frontend/utils';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import OmBarnetFaktaIndex from '@k9-sak-web/gui/fakta/om-barnet/OmBarnetFaktaIndex.js';
import { Fagsak, Behandling } from '@k9-sak-web/types';
import OmBarnet from '../../components/OmBarnet';

class OmBarnetFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OM_BARNET;

  getTekstKode = () => 'OmBarnetInfoPanel.Title';

  getAksjonspunktKoder = () => [AksjonspunktDefinisjon.VURDER_RETT_ETTER_PLEIETRENGENDES_DØD];

  getEndepunkter = () => [];

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_OM_BARNET) {
      const omBarnetAksjonspunkt = findAksjonspunkt(
        props.aksjonspunkter,
        AksjonspunktDefinisjon.VURDER_RETT_ETTER_PLEIETRENGENDES_DØD,
      );
      return (
        <OmBarnetFaktaIndex
          behandlingUuid={props.behandling.uuid}
          readOnly={props.readOnly}
          submittable={props.submittable}
          harAksjonspunkt={!!omBarnetAksjonspunkt?.definisjon.kode}
          submitCallback={props.submitCallback}
        />
      );
    }
    return <OmBarnet {...props} />;
  };

  getOverstyrVisningAvKomponent = ({ fagsak, behandling }: { fagsak: Fagsak; behandling: Behandling }) => {
    const erPleiepengesak = fagsak.sakstype === fagsakYtelsesType.PLEIEPENGER_SYKT_BARN;
    const søknadsfristErIkkeUnderVurdering = behandling.stegTilstand?.stegType?.kode !== 'VURDER_SØKNADSFRIST';
    return erPleiepengesak && søknadsfristErIkkeUnderVurdering;
  };
}

export default OmBarnetFaktaPanelDef;
