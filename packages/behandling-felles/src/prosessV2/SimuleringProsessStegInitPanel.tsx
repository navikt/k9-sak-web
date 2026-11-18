import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { aksjonspunktStatus as k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { AksjonspunktDto as k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { VersjonsvelgerV1V2 } from '@k9-sak-web/behandling-felles';
import { K9SakProsessApi } from '@k9-sak-web/gui/behandling/prosess/api/K9SakProsessApi.js';
import {
  aksjonspunkterQueryOptions,
  behandlingQueryOptions,
  fagsakQueryOptions,
  simuleringResultatQueryOptions,
  tilbakekrevingvalgQueryOptions,
} from '@k9-sak-web/gui/behandling/prosess/api/k9SakQueryOptions.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { AvregningProsessIndex as AvregningProsessIndexV2 } from '@k9-sak-web/gui/prosess/avregning/AvregningProsessIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Aksjonspunkt, Behandling, Fagsak } from '@k9-sak-web/types';
import { useSuspenseQueries } from '@tanstack/react-query';
import { use, useContext } from 'react';

const RELEVANTE_AKSJONSPUNKTER = [
  AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
  AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
];

const PANEL_ID = prosessStegCodes.AVREGNING;

interface Props {
  behandling: Behandling;
  aksjonspunkterMedKodeverk: Aksjonspunkt[];
  fagsak: Fagsak;
  previewFptilbakeCallback:
    ((mottaker: string, brevmalkode: string, fritekst: string, saksnummer: string) => Promise<any>) | undefined;
  // Data i legacy-format til v1-komponenten, hentes av ytelsens container med dens REST-hooks.
  legacyData: { simuleringResultat: any; tilbakekrevingvalg: any } | undefined;
  submitCallback: (data: any, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
  isReadOnly: boolean;
  api: K9SakProsessApi;
}

export function SimuleringProsessStegInitPanel(props: Props) {
  const featureToggles = use(FeatureTogglesContext);
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erTilBehandlingEllerBehandlet = prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);
  const [
    { data: aksjonspunkter = [] },
    { data: fagsakV2 },
    { data: behandlingV2 },
    { data: tilbakekrevingvalgV2 },
    { data: simuleringResultatV2 },
  ] = useSuspenseQueries({
    queries: [
      aksjonspunkterQueryOptions(props.api, props.behandling),
      fagsakQueryOptions(props.api, props.fagsak.saksnummer, props.behandling),
      behandlingQueryOptions(props.api, props.behandling),
      tilbakekrevingvalgQueryOptions(props.api, props.behandling, erTilBehandlingEllerBehandlet),
      simuleringResultatQueryOptions(props.api, props.behandling, erTilBehandlingEllerBehandlet),
    ],
  });

  const { legacyData } = props;

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  if (!erValgt || !legacyData) {
    return null;
  }

  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  const relevanteAksjonspunkter = props.aksjonspunkterMedKodeverk?.filter(ap =>
    RELEVANTE_AKSJONSPUNKTER.some(relevantAksjonspunkt => relevantAksjonspunkt === ap.definisjon.kode),
  );
  const relevanteAksjonspunkterV2 = aksjonspunkter.filter(ap =>
    RELEVANTE_AKSJONSPUNKTER.some(relevantAksjonspunkt => relevantAksjonspunkt === ap.definisjon),
  );

  // Beregn readOnlySubmitButton basert på aksjonspunkter
  // Hvis det finnes åpne aksjonspunkter, skal submit-knappen ikke være read-only
  const harApentAksjonspunkt = relevanteAksjonspunkter?.some(
    ap => ap.status.kode === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
  );
  const readOnlySubmitButton = !harApentAksjonspunkt;

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, aksjonspunkter);
  };

  if (featureToggles?.BRUK_V2_AVREGNING) {
    return (
      <VersjonsvelgerV1V2
        v1={
          <AvregningProsessIndex
            behandling={props.behandling}
            aksjonspunkter={relevanteAksjonspunkter}
            fagsak={props.fagsak}
            simuleringResultat={legacyData.simuleringResultat}
            tilbakekrevingvalg={legacyData.tilbakekrevingvalg}
            previewFptilbakeCallback={props.previewFptilbakeCallback}
            featureToggles={featureToggles}
            readOnlySubmitButton={readOnlySubmitButton}
            submitCallback={handleSubmit}
            isReadOnly={props.isReadOnly}
            isAksjonspunktOpen={harApentAksjonspunkt}
          />
        }
        v2={
          <AvregningProsessIndexV2
            fagsak={fagsakV2}
            behandling={behandlingV2}
            aksjonspunkter={relevanteAksjonspunkterV2}
            simuleringResultat={simuleringResultatV2}
            tilbakekrevingvalg={tilbakekrevingvalgV2}
            isReadOnly={props.isReadOnly}
          />
        }
      />
    );
  }

  return (
    <AvregningProsessIndex
      behandling={props.behandling}
      aksjonspunkter={relevanteAksjonspunkter}
      fagsak={props.fagsak}
      simuleringResultat={legacyData.simuleringResultat}
      tilbakekrevingvalg={legacyData.tilbakekrevingvalg}
      previewFptilbakeCallback={props.previewFptilbakeCallback}
      featureToggles={featureToggles}
      readOnlySubmitButton={readOnlySubmitButton}
      submitCallback={handleSubmit}
      isReadOnly={props.isReadOnly}
      isAksjonspunktOpen={harApentAksjonspunkt}
    />
  );
}
