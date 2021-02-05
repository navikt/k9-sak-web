import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { behandlingPersonMap, uttaksplaner } from '@fpsak-frontend/prosess-uttak/src/components/dto/testdata';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import React from 'react';
import Uttak from '../../components/Uttak';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <Uttak {...props} />;

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
