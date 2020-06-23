import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OmsorgenForFaktaIndex from '@fpsak-frontend/fakta-omsorgen-for/src/OmsorgenForFaktaIndex';
import { FaktaPanelDef } from '@fpsak-frontend/behandling-felles';

import pleiepengerBehandlingApi from '../../data/pleiepengerBehandlingApi';

class OmsorgenForFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OMSORGEN_FOR;

  getTekstKode = () => 'FaktaOmAlderOgOmsorg.header';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OMSORGEN_FOR];

  getEndepunkter = () => [pleiepengerBehandlingApi.OMSORGEN_FOR];

  getKomponent = props => <OmsorgenForFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({ fagsak, personopplysninger }) =>
    personopplysninger && fagsak.fagsakYtelseType.kode === fagsakYtelseType.PLEIEPENGER;

  getData: ({ personopplysninger }) => { personopplysninger };
}

export default OmsorgenForFaktaPanelDef;
