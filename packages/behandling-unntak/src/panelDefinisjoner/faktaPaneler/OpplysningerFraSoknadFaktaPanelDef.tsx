import React from 'react';

import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import OpplysningerFraSoknadenIndex from '@fpsak-frontend/fakta-opplysninger-fra-soknaden';
import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';

class OpplysningerFraSoknadFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OPPLYSNINGER_FRA_SØKNADEN;

  getTekstKode = () => 'OpplysningerFraSoknaden.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYRING_FRISINN_OPPGITT_OPPTJENING];

  // FIXME Dette endepunktet er ikkje definert!
  // getEndepunkter = () => [UnntakBehandlingApiKeys.OPPGITT_OPPTJENING];

  getKomponent = props => <OpplysningerFraSoknadenIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ rettigheter, behandling }: { rettigheter: any; behandling: Behandling }) => {
    const behandlingenErAvsluttet = behandlingStatus.AVSLUTTET === behandling.status;
    const kanEndrePåSøknadsopplysninger = rettigheter.writeAccess.isEnabled && !behandlingenErAvsluttet;
    return {
      kanEndrePåSøknadsopplysninger,
    };
  };
}

export default OpplysningerFraSoknadFaktaPanelDef;
