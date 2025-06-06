import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import SoknadsperioderIndex from '@k9-sak-web/fakta-soknadsperioder';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Fagsak } from '@k9-sak-web/types';
import React from 'react';
import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

class SoknadsperioderFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.SOKNADSPERIODER;

  getTekstKode = () => 'SoknadsperioderPanel.Soknadsperioder';

  getAksjonspunktKoder = () => [];

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.BEHANDLING_PERIODER_ÅRSAK_MED_VILKÅR];

  getKomponent = props => <SoknadsperioderIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) =>
    fagsak.sakstype === fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE;
}

export default SoknadsperioderFaktaPanelDef;
