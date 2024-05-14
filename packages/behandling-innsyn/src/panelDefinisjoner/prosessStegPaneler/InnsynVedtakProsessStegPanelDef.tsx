import React from 'react';

import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import innsynResultatTypeKV from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VedtakInnsynProsessIndex from '@fpsak-frontend/prosess-vedtak-innsyn';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import { Aksjonspunkt, Fagsak, Innsyn } from '@k9-sak-web/types';

const getVedtakStatus = (innsynResultatType, aksjonspunkter: Aksjonspunkt[]) => {
  const harApentAksjonpunkt = aksjonspunkter.some(ap => ap.status === aksjonspunktStatus.OPPRETTET);
  if (aksjonspunkter.length === 0 || harApentAksjonpunkt) {
    return vilkarUtfallType.IKKE_VURDERT;
  }
  return innsynResultatType === innsynResultatTypeKV.INNVILGET
    ? vilkarUtfallType.OPPFYLT
    : vilkarUtfallType.IKKE_OPPFYLT;
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakInnsynProsessIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({
    innsyn,
    aksjonspunkterForSteg,
  }: {
    innsyn: Innsyn;
    aksjonspunkterForSteg: Aksjonspunkt[];
  }) => (innsyn ? getVedtakStatus(innsyn.innsynResultatType, aksjonspunkterForSteg) : vilkarUtfallType.IKKE_VURDERT);

  getAksjonspunktKoder = () => [aksjonspunktCodes.FORESLA_VEDTAK];

  getData = ({
    innsyn,
    alleDokumenter,
    fagsak,
    previewCallback,
    hentFritekstbrevHtmlCallback,
    aksjonspunkter,
  }: {
    innsyn: Innsyn;
    alleDokumenter: any;
    fagsak: Fagsak;
    previewCallback: (data: any) => Promise<any>;
    hentFritekstbrevHtmlCallback: (data: any) => Promise<any>;
    aksjonspunkter: Aksjonspunkt[];
  }) => ({
    innsyn,
    alleDokumenter,
    previewCallback,
    hentFritekstbrevHtmlCallback,
    aksjonspunkter,
    saksnummer: fagsak.saksnummer,
  });
}

class InnsynVedtakProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK;

  getTekstKode = () => 'Behandlingspunkt.Vedtak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default InnsynVedtakProsessStegPanelDef;
