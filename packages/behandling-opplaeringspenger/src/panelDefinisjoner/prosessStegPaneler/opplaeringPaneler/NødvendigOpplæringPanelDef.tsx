import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { ProsessStegPanelDef, ProsessStegOverstyringPanelDef } from '@k9-sak-web/behandling-felles';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class NødvendigOpplæringPanelDef extends ProsessStegPanelDef {
  overstyringDef = new ProsessStegOverstyringPanelDef(this);

  getId = () => 'NØDVENDIG_OPPLÆRING';

  getTekstKode = () => 'Nødvendig opplæring';

  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return this.overstyringDef.getKomponent({ ...props, ...deepCopyProps, usev2Panel: true });
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDER_OPPLÆRING];

  getVilkarKoder = () => [vilkarType.NØDVENDIG_OPPLÆRING];

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

export default NødvendigOpplæringPanelDef;
