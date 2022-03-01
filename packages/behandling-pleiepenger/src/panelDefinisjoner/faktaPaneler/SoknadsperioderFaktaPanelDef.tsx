import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import SoknadsperioderIndex from '@k9-sak-web/fakta-soknadsperioder';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import React from 'react';
import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class SoknadsperioderFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.SOKNADSPERIODER;

  getTekstKode = () => 'SoknadsperioderPanel.Soknadsperioder';

  getAksjonspunktKoder = () => [];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR];

  getKomponent = props => <SoknadsperioderIndex {...props} />;

  getOverstyrVisningAvKomponent = (data, featureToggles) => featureToggles?.FAKTA_SOKNADSPERIODER;
}

export default SoknadsperioderFaktaPanelDef;
