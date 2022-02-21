import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import SoknadsperioderIndex from '@k9-sak-web/fakta-soknadsperioder';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak } from '@k9-sak-web/types';

import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class SoknadsperioderFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.SOKNADSPERIODER;

  getTekstKode = () => 'MedisinskVilkarPanel.Soknadsperioder';

  getAksjonspunktKoder = () => [];

  getEndepunkter = () => [PleiepengerBehandlingApiKeys.BEHANDLING_PERIODER];

  getKomponent = props => <SoknadsperioderIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) =>
    fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER;
}

export default SoknadsperioderFaktaPanelDef;
