import React from 'react';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OmsorgenForFaktaIndex from '@fpsak-frontend/fakta-omsorgen-for/src/OmsorgenForFaktaIndex';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Fagsak, Personopplysninger } from '@k9-sak-web/types';

import { UtvidetRettBehandlingApiKeys } from '../../data/utvidetRettBehandlingApi';

class OmsorgenForFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OMSORGEN_FOR;

  getTekstKode = () => 'FaktaOmAlderOgOmsorg.header';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OMSORGEN_FOR];

  getEndepunkter = () => [UtvidetRettBehandlingApiKeys.OMSORGEN_FOR];

  getKomponent = props => <OmsorgenForFaktaIndex {...props} />;

  getOverstyrVisningAvKomponent = ({
    fagsak,
    personopplysninger,
  }: {
    fagsak: Fagsak;
    personopplysninger: Personopplysninger;
  }) => personopplysninger && fagsak.sakstype.kode === fagsakYtelseType.UTVIDET_RETT;

  getData = ({ personopplysninger }) => ({ personopplysninger });
}

export default OmsorgenForFaktaPanelDef;
