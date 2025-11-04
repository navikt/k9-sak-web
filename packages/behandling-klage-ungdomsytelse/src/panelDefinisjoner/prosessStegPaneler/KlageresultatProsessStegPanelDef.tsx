import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { VedtakKlageProsessIndex } from '@k9-sak-web/gui/prosess/vedtak-klage/VedtakKlageProsessIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    return <VedtakKlageProsessIndex {...props} {...deepCopyProps} />;
  };

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ behandling }) => (behandling.avsluttet ? vilkarUtfallType.OPPFYLT : null);

  getAksjonspunktKoder = () => [
    aksjonspunktCodes.FORESLA_VEDTAK,
    aksjonspunktCodes.FATTER_VEDTAK,
    aksjonspunktCodes.FORESLA_VEDTAK_MANUELT,
    aksjonspunktCodes.VEDTAK_UTEN_TOTRINNSKONTROLL,
    aksjonspunktCodes.VURDERE_DOKUMENT,
  ];

  getData = ({ previewCallback, klageVurdering }) => ({
    previewVedtakCallback: previewCallback,
    klageVurdering,
  });
}

class KlageresultatProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.KLAGE_RESULTAT;

  getTekstKode = () => 'Behandlingspunkt.ResultatKlage';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default KlageresultatProsessStegPanelDef;
