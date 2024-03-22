import { ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@k9-sak-web/behandling-felles';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { AlleKodeverk } from '@k9-sak-web/lib/types/AlleKodeverk.js';
import { Vilkar } from '@k9-sak-web/types';

class GjennomgaaOpplaeringPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'GJENNOMGAA_OPPLAERING';

  getTekstKode = () => 'Opplaering.GjennomgaaOpplaering';

  getKomponent = props => this.overstyringDef.getKomponent(props);

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_GJENNOMGÅTT_OPPLÆRING];

  getVilkarKoder = () => [vilkarType.GJENNOMGÅ_OPPLÆRING];

  getData = ({
    vilkarForSteg,
    alleKodeverk,
    overstyrteAksjonspunktKoder,
    prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  }: {
    vilkarForSteg: Vilkar[];
    alleKodeverk: AlleKodeverk;
    overstyrteAksjonspunktKoder: string[];
    prosessStegTekstKode: string;
    overrideReadOnly: boolean;
    kanOverstyreAccess: boolean;
    toggleOverstyring: () => void;
  }): any => ({
    avslagsarsaker: alleKodeverk[kodeverkTyper.AVSLAGSARSAK][vilkarForSteg[0].vilkarType],
    erOverstyrt: overstyrteAksjonspunktKoder.some(o => this.getAksjonspunktKoder().some(a => a === o)),
    panelTittelKode: this.getTekstKode() ? this.getTekstKode() : prosessStegTekstKode,
    lovReferanse: vilkarForSteg.length > 0 ? vilkarForSteg[0].lovReferanse : undefined,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  });
}

export default GjennomgaaOpplaeringPanelDef;
