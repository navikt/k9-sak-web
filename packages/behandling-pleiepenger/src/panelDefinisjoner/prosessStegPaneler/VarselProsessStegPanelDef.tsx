import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import VarselOmRevurderingProsessIndex from '@k9-sak-web/prosess-varsel-om-revurdering';

import { PleiepengerBehandlingApiKeys } from '../../data/pleiepengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VarselOmRevurderingProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VARSEL_REVURDERING_MANUELL,
    aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL,
  ];

  getEndepunkter = () => [
    PleiepengerBehandlingApiKeys.FAMILIEHENDELSE,
    PleiepengerBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING,
    PleiepengerBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING,
  ];

  getData = ({ previewCallback, soknad }) => ({
    previewCallback,
    soknad,
  });
}

class VarselProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VARSEL;

  getTekstKode = () => 'Behandlingspunkt.CheckVarselRevurdering';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VarselProsessStegPanelDef;
