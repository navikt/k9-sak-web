import React from 'react';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { ProsessStegDef, ProsessStegPanelDef, VersjonsvelgerV1V2 } from '@k9-sak-web/behandling-felles';
import { AvregningProsessIndex as AvregningProsessIndexV2 } from '@k9-sak-web/gui/prosess/avregning/AvregningProsessIndex.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

import { PleiepengerSluttfaseBehandlingApiKeys } from '../../data/pleiepengerSluttfaseBehandlingApi';

class PanelDef extends ProsessStegPanelDef {
  getKomponent = props => {
    if (props.featureToggles?.BRUK_V2_AVREGNING) {
      const deepCopyProps = JSON.parse(JSON.stringify(props));
      konverterKodeverkTilKode(deepCopyProps, false);
      return (
        <VersjonsvelgerV1V2
          v1={<AvregningProsessIndex {...props} />}
          v2={
            <AvregningProsessIndexV2
              fagsak={deepCopyProps.fagsak}
              behandling={deepCopyProps.behandling}
              aksjonspunkter={deepCopyProps.aksjonspunkter}
              simuleringResultat={deepCopyProps.simuleringResultat}
              tilbakekrevingvalg={deepCopyProps.tilbakekrevingvalg}
              isReadOnly={props.isReadOnly}
            />
          }
        />
      );
    }
    return <AvregningProsessIndex {...props} />;
  };

  getAksjonspunktKoder = () => [
    AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
    AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
  ];

  getEndepunkter = () => [PleiepengerSluttfaseBehandlingApiKeys.TILBAKEKREVINGVALG];

  getOverstyrVisningAvKomponent = () => true;

  getOverstyrtStatus = ({ simuleringResultat }) =>
    simuleringResultat ? vilkarUtfallType.OPPFYLT : vilkarUtfallType.IKKE_VURDERT;

  getData = ({ fagsak, previewFptilbakeCallback, simuleringResultat }) => ({
    fagsak,
    previewFptilbakeCallback,
    simuleringResultat,
  });
}

class SimuleringProsessStegPanelDef extends ProsessStegDef {
  getUrlKode = () => prosessStegCodes.AVREGNING;

  getTekstKode = () => 'Behandlingspunkt.Avregning';

  getPanelDefinisjoner = () => [new PanelDef()];
}

export default SimuleringProsessStegPanelDef;
