import { ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@k9-sak-web/behandling-felles';
import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class InstitusjonPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'INSTITUSJON';

  getTekstKode = () => 'Institusjon';

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return this.overstyringDef.getKomponent({ ...props, ...deepCopyProps, usev2Panel: true });
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_INSTITUSJON];

  getVilkarKoder = () => [vilkarType.GODKJENT_OPPLÆRINGSINSTITUSJON];

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
