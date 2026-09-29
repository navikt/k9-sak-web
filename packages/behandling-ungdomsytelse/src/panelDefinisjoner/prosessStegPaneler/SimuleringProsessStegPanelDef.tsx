import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import { ProsessStegDef, ProsessStegPanelDef, VersjonsvelgerV1V2 } from '@k9-sak-web/behandling-felles';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { AksjonspunktDefinisjon as AksjonspunktDtoDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';

import { UngdomsytelseBehandlingApiKeys } from '../../data/ungdomsytelseBehandlingApi';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { AvregningProsessIndex as AvregningProsessIndexV2 } from '@k9-sak-web/gui/prosess/avregning/AvregningProsessIndex.js';

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
    AksjonspunktDtoDefinisjon.VURDER_FEILUTBETALING,
    AksjonspunktDtoDefinisjon.SJEKK_HØY_ETTERBETALING,
  ];
  getEndepunkter = () => [UngdomsytelseBehandlingApiKeys.TILBAKEKREVINGVALG];

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
