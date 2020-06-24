import React from 'react';

import UttakProsessIndex from '@fpsak-frontend/prosess-uttak';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';
import { uttaksplaner, behandlingPersonMap } from '@fpsak-frontend/prosess-uttak/src/components/dto/testdata';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <UttakProsessIndex {...props} />;

  getAksjonspunktKoder = () => [];

  getOverstyrVisningAvKomponent = () => true;

  getData = () => ({
    uttaksplaner,
    behandlingPersonMap,
  });
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
