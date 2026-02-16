import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import VarselOmRevurderingProsessIndex from '@fpsak-frontend/prosess-varsel-om-revurdering';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import React from 'react';

import { OpplaeringspengerBehandlingApiKeys } from '../../data/opplaeringspengerBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VarselOmRevurderingProsessIndex {...props} />;

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.VARSEL_REVURDERING_MANUELL,
    aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL,
  ];

  getEndepunkter = () => [
    OpplaeringspengerBehandlingApiKeys.FAMILIEHENDELSE,
    OpplaeringspengerBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING,
    OpplaeringspengerBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING,
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
