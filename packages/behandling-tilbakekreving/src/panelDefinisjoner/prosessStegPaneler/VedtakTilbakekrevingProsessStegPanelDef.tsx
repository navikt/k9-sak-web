import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VedtakTilbakekrevingProsessIndex from '@fpsak-frontend/prosess-vedtak-tilbakekreving';
import redusertUtbetalingArsak from '@fpsak-frontend/prosess-vedtak/src/kodeverk/redusertUtbetalingArsak';
import { dokumentdatatype, featureToggle, prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProsessStegDef, ProsessStegPanelDef } from '@fpsak-frontend/behandling-felles';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';

import VedtakResultatType from '../../kodeverk/vedtakResultatType';
import tilbakekrevingApi from '../../data/tilbakekrevingBehandlingApi';

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

  getEndepunkter = () => [tilbakekrevingApi.VEDTAKSBREV];

  getData = ({ behandling, beregningsresultat, fetchPreviewVedtaksbrev, featureToggles }) => ({
    beregningsresultat,
    fetchPreviewVedtaksbrev,
    aksjonspunktKodeForeslaVedtak: aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK,
    isBehandlingHenlagt: behandling.behandlingHenlagt,
    lagreArsakerTilRedusertUtbetaling: (values, dispatch) => {
      if (featureToggles?.[featureToggle.AKTIVER_DOKUMENTDATA]) {
        const arsaker = Object.values(redusertUtbetalingArsak).filter(a => values[a]);
        dispatch(
          tilbakekrevingApi.DOKUMENTDATA_LAGRE.makeRestApiRequest()({
            [dokumentdatatype.REDUSERT_UTBETALING_AARSAK]: arsaker,
          }),
        );
      }
    },
  });
}

class VedtakTilbakekrevingProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.VEDTAK;

  getTekstKode = () => 'Behandlingspunkt.Vedtak';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default VedtakTilbakekrevingProsessStegPanelDef;
