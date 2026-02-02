import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { KlagevurderingProsessIndex } from '@k9-sak-web/gui/prosess/klagevurdering/KlagevurderingProsessIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { Fagsak } from '@k9-sak-web/types';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return <KlagevurderingProsessIndex {...props} {...deepCopyProps} />;
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.BEHANDLE_KLAGE_NK];

  getOverstyrVisningAvKomponent = ({ fagsak }: { fagsak: Fagsak }) => fagsak.sakstype === fagsakYtelsesType.FRISINN;

  getData = ({ fagsak, saveKlageText, klageVurdering, previewCallback, hentFritekstbrevHtmlCallback }) => ({
    fagsak,
    saveKlage: saveKlageText,
    klageVurdering,
    previewCallback,
    hentFritekstbrevHtmlCallback,
  });
}

class VurderingKlageInstansProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.KLAGE_NAV_KLAGEINSTANS;

  getTekstKode = () => 'Behandlingspunkt.CheckKlageNK';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VurderingKlageInstansProsessStegPanelDef;
