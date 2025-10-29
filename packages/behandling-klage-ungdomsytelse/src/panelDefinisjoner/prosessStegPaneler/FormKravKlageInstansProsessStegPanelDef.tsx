import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { FormkravProsessIndex } from '@k9-sak-web/gui/prosess/formkrav/FormkravProsessIndex.js';
import { erTilbakekreving } from '@k9-sak-web/gui/utils/behandlingUtils.js';

import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { Behandling, Fagsak, FeatureToggles } from '@k9-sak-web/types';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    const deepCopyProps = JSON.parse(JSON.stringify(props));
    konverterKodeverkTilKode(deepCopyProps, false);
    const avsluttedeBehandlingerCopy: Behandling[] = JSON.parse(JSON.stringify(props.avsluttedeBehandlinger));
    avsluttedeBehandlingerCopy.forEach(behandling => {
      const erTilbakekrevingType = erTilbakekreving(behandling.type.kode);
      konverterKodeverkTilKode(behandling, erTilbakekrevingType);
    });
    return <FormkravProsessIndex {...props} {...deepCopyProps} avsluttedeBehandlinger={avsluttedeBehandlingerCopy} />;
  };

  getAksjonspunktKoder = () => [aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA];

  getOverstyrVisningAvKomponent = ({ fagsak, featureToggles }: { fagsak: Fagsak; featureToggles: FeatureToggles }) =>
    featureToggles.KLAGE_KABAL ? fagsak.sakstype === fagsakYtelsesType.FRISINN : true;

  getData = ({
    alleBehandlinger,
    klageVurdering,
    parterMedKlagerett,
    valgtPartMedKlagerett,
    arbeidsgiverOpplysningerPerId,
    fagsak,
  }) => ({
    avsluttedeBehandlinger: alleBehandlinger.filter(b => b.status.kode === behandlingStatus.AVSLUTTET),
    klageVurdering,
    parterMedKlagerett,
    valgtPartMedKlagerett,
    arbeidsgiverOpplysningerPerId,
    fagsak,
  });
}

class FormKravKlageInstansProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.FORMKRAV_KLAGE_NAV_KLAGEINSTANS;

  getTekstKode = () => 'Behandlingspunkt.FormkravKlageKA';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default FormKravKlageInstansProsessStegPanelDef;
