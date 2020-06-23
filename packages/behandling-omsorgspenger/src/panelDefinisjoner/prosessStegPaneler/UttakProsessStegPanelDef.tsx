import React from 'react';

import ÅrskvantumIndex from '@k9-sak-web/prosess-aarskvantum-oms';
import ÅrskvantumForbrukteDager from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/ÅrskvantumForbrukteDager';
import { UtfallEnum } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/Utfall';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <ÅrskvantumIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ forbrukteDager }: { forbrukteDager: ÅrskvantumForbrukteDager }) => {
    if (!forbrukteDager || !forbrukteDager.sisteUttaksplan) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    const perioder = forbrukteDager.sisteUttaksplan.aktiviteter?.flatMap(aktivitet => aktivitet.uttaksperioder);
    const allePerioderAvslått = perioder?.every(periode => periode.utfall === UtfallEnum.AVSLÅTT);

    return allePerioderAvslått ? vilkarUtfallType.IKKE_OPPFYLT : vilkarUtfallType.OPPFYLT;
  };

  getData = ({ forbrukteDager, aksjonspunkterForSteg, fullUttaksplan }) => ({
    årskvantum: forbrukteDager,
    aksjonspunkterForSteg,
    aktiviteterHittilIÅr: fullUttaksplan?.aktiviteter,
  });
}

class UttakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.UTTAK;

  getTekstKode = () => 'Behandlingspunkt.Uttak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default UttakProsessStegPanelDef;
