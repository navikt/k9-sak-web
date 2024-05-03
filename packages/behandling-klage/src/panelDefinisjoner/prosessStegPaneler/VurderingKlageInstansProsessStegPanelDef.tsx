import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import KlagevurderingProsessIndex from '@k9-sak-web/prosess-klagevurdering';
import { Fagsak, FeatureToggles } from '@k9-sak-web/types';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <KlagevurderingProsessIndex {...props} />;

  getAksjonspunktKoder = () => [aksjonspunktCodes.BEHANDLE_KLAGE_NK];

  getOverstyrVisningAvKomponent = ({ fagsak, featureToggles }: { fagsak: Fagsak; featureToggles: FeatureToggles }) =>
    featureToggles?.KLAGE_KABAL ? fagsak.sakstype.kode === fagsakYtelseType.FRISINN : true;

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
