import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import SoknadsperioderIndex from '@k9-sak-web/fakta-soknadsperioder';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
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
    fagsak.sakstype.kode === fagsakYtelseType.PLEIEPENGER_SLUTTFASE;
}

export default SoknadsperioderFaktaPanelDef;
