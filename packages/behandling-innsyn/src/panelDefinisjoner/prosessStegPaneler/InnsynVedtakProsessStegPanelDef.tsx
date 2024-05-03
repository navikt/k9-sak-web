import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import innsynResultatTypeKV from '@k9-sak-web/kodeverk/src/innsynResultatType';
import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import VedtakInnsynProsessIndex from '@k9-sak-web/prosess-vedtak-innsyn';

const getVedtakStatus = (innsynResultatType, aksjonspunkter) => {
  const harApentAksjonpunkt = aksjonspunkter.some(ap => ap.status.kode === aksjonspunktStatus.OPPRETTET);
  if (aksjonspunkter.length === 0 || harApentAksjonpunkt) {
    return vilkarUtfallType.IKKE_VURDERT;
  }
  return innsynResultatType.kode === innsynResultatTypeKV.INNVILGET
    ? vilkarUtfallType.OPPFYLT
    : vilkarUtfallType.IKKE_OPPFYLT;
};

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakInnsynProsessIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ innsyn, aksjonspunkterForSteg }) =>
    innsyn ? getVedtakStatus(innsyn.innsynResultatType, aksjonspunkterForSteg) : vilkarUtfallType.IKKE_VURDERT;

  getAksjonspunktKoder = () => [aksjonspunktCodes.FORESLA_VEDTAK];

  getData = ({ innsyn, alleDokumenter, fagsak, previewCallback, hentFritekstbrevHtmlCallback, aksjonspunkter }) => ({
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
