import React from 'react';

import { ProsessStegDef, ProsessStegPanelDef } from '@k9-sak-web/behandling-felles';
import aksjonspunktCodesTilbakekreving from '@k9-sak-web/kodeverk/src/aksjonspunktCodesTilbakekreving';
import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import VedtakTilbakekrevingProsessIndex from '@k9-sak-web/prosess-vedtak-tilbakekreving';

import { TilbakekrevingBehandlingApiKeys } from '../../data/tilbakekrevingBehandlingApi';
import VedtakResultatType from '../../kodeverk/vedtakResultatType';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => <VedtakTilbakekrevingProsessIndex {...props} />;

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ beregningsresultat }) => {
    if (!beregningsresultat) {
      return vilkarUtfallType.IKKE_VURDERT;
    }
    const { vedtakResultatType } = beregningsresultat;
    return vedtakResultatType.kode === VedtakResultatType.INGEN_TILBAKEBETALING
      ? vilkarUtfallType.IKKE_OPPFYLT
      : vilkarUtfallType.OPPFYLT;
  };

  getAksjonspunktKoder = () => [aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK];

  getEndepunkter = () => [TilbakekrevingBehandlingApiKeys.VEDTAKSBREV];

  getData = ({ behandling, beregningsresultat, fetchPreviewVedtaksbrev, hentFritekstbrevHtmlCallback }) => ({
    beregningsresultat,
    fetchPreviewVedtaksbrev,
    aksjonspunktKodeForeslaVedtak: aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK,
    isBehandlingHenlagt: behandling.behandlingHenlagt,
    hentFritekstbrevHtmlCallback,
  });
}

class VedtakTilbakekrevingProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK;

  getTekstKode = () => 'Behandlingspunkt.Vedtak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VedtakTilbakekrevingProsessStegPanelDef;
