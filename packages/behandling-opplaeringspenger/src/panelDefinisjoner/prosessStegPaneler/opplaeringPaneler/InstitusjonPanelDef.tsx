import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import OpplaeringProsessIndex from '@k9-sak-web/gui/prosess/opplaering/OpplaeringProsessIndex.js';
import { ProsessStegOverstyringPanelDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { utledOpplaeringV2Props } from './utledOpplaeringV2Props';

class InstitusjonPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'INSTITUSJON';

  getTekstKode = () => 'Institusjon';

  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_PROSESS_OPPLAERING) {
      const v2Props = utledOpplaeringV2Props(props, 'INSTITUSJON');
      return (
        <OpplaeringProsessIndex
          aksjonspunkter={v2Props.aksjonspunkter}
          vilkar={v2Props.vilkar}
          vilkarPanel={v2Props.vilkarPanel}
          visAllePerioder={v2Props.visAllePerioder}
        />
      );
    }
    return this.overstyringDef.getKomponent({ ...props, skjulOverstyring: true });
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_INSTITUSJON];

  getVilkarKoder = () => [VilkårType.GODKJENT_OPPLÆRINGSINSTITUSJON];

  getData = ({
    overstyrteAksjonspunktKoder,
    prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  }): any => ({
    erOverstyrt: overstyrteAksjonspunktKoder.some(o => this.getAksjonspunktKoder().some(a => a === o)),
    panelTittelKode: this.getTekstKode() ? this.getTekstKode() : prosessStegTekstKode,
    overrideReadOnly,
    kanOverstyreAccess,
    toggleOverstyring,
  });
}

export default InstitusjonPanelDef;
