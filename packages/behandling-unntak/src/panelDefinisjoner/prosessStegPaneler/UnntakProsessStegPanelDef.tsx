import React from 'react';

import UnntakProsessIndex from '@k9-sak-web/prosess-unntak';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { UnntakProsessIndex as UnntakProsessIndexV2 } from '@k9-sak-web/gui/prosess/unntak/UnntakProsessIndex.js';
import { utledUnntakV2Props } from './utledUnntakV2Props';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_PROSESS_UNNTAK) {
      const { periode, begrunnelse, behandlingResultatType } = utledUnntakV2Props(props.vilkar, props.behandling);
      return (
        <UnntakProsessIndexV2
          periode={periode}
          begrunnelse={begrunnelse}
          behandlingResultatType={behandlingResultatType}
          isReadOnly={props.isReadOnly}
          readOnlySubmitButton={props.readOnlySubmitButton}
          submitCallback={props.submitCallback}
        />
      );
    }
    return <UnntakProsessIndex {...props} />;
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.OVERSTYRING_MANUELL_VURDERING_VILKÅR];

  getOverstyrVisningAvKomponent = () => true;

  getData = ({ vilkar }) => ({
    vilkar,
  });
}

class UnntakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UNNTAK;

  getTekstKode = () => 'Behandlingspunkt.Unntak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UnntakProsessStegPanelDef;
