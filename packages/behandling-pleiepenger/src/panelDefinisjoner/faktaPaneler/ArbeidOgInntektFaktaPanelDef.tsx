import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';

import ArbeidOgInntektFaktaIndex from '@k9-sak-web/gui/fakta/arbeid-og-inntekt/ArbeidOgInntektFaktaIndex.js';

class ArbeidOgInntektFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.ARBEID_OG_INNTEKT;

  getTekstKode = () => 'ArbeidOgInntektInfoPanel.Title';

  getKomponent = props => {
    return <ArbeidOgInntektFaktaIndex behandlingUuid={props.behandling.uuid} />;
  };

  skalVisePanel = (_apCodes, _data, featureToggles) => !!featureToggles?.BRUK_V2_ARBEID_OG_INNTEKT;
}

export default ArbeidOgInntektFaktaPanelDef;
