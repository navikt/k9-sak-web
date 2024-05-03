import React from 'react';

import { FaktaPanelDef } from '@k9-sak-web/behandling-felles';
import OpplysningerFraSoknadenIndex from '@k9-sak-web/fakta-opplysninger-fra-soknaden';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';

class OpplysningerFraSoknadFaktaPanelDef extends FaktaPanelDef {
  getUrlKode = () => faktaPanelCodes.OPPLYSNINGER_FRA_SØKNADEN;

  getTekstKode = () => 'OpplysningerFraSoknaden.Title';

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYRING_FRISINN_OPPGITT_OPPTJENING];

  // FIXME Dette endepunktet er ikkje definert!
  // getEndepunkter = () => [UnntakBehandlingApiKeys.OPPGITT_OPPTJENING];

  getKomponent = props => <OpplysningerFraSoknadenIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ rettigheter, behandling }) => {
    const behandlingenErAvsluttet = behandlingStatus.AVSLUTTET === behandling.status.kode;
    const kanEndrePåSøknadsopplysninger = rettigheter.writeAccess.isEnabled && !behandlingenErAvsluttet;
    return {
      kanEndrePåSøknadsopplysninger,
    };
  };
}

export default OpplysningerFraSoknadFaktaPanelDef;
