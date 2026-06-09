import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { aksjonspunktStatus as k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { AksjonspunktDto as k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { AvregningProsessIndex as AvregningProsessIndexV2 } from '@k9-sak-web/gui/prosess/avregning/AvregningProsessIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Aksjonspunkt, Behandling, Fagsak } from '@k9-sak-web/types';
import { useSuspenseQueries } from '@tanstack/react-query';
import { use, useContext } from 'react';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import {
  aksjonspunkterQueryOptions,
  behandlingQueryOptions,
  fagsakQueryOptions,
  simuleringResultatQueryOptions,
  tilbakekrevingvalgQueryOptions,
} from './api/k9SakQueryOptions';

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
    | ((mottaker: string, brevmalkode: string, fritekst: string, saksnummer: string) => Promise<any>)
    | undefined;
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

  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    simuleringResultat: any;
    tilbakekrevingvalg: any;
  }>(
    [
      { key: PleiepengerBehandlingApiKeys.SIMULERING_RESULTAT },
      { key: PleiepengerBehandlingApiKeys.TILBAKEKREVINGVALG },
    ],
    { keepData: true, suspendRequest: false, updateTriggers: [props.behandling.versjon] },
  );

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);

  const data = restApiData.data;

  if (!erValgt || !data) {
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
      <AvregningProsessIndexV2
        fagsak={fagsakV2}
        behandling={behandlingV2}
        aksjonspunkter={relevanteAksjonspunkterV2}
        simuleringResultat={simuleringResultatV2}
        tilbakekrevingvalg={tilbakekrevingvalgV2}
        isReadOnly={props.isReadOnly}
      />
    );
  }

  return (
    <AvregningProsessIndex
      behandling={props.behandling}
      aksjonspunkter={relevanteAksjonspunkter}
      fagsak={props.fagsak}
      simuleringResultat={data.simuleringResultat}
      tilbakekrevingvalg={data.tilbakekrevingvalg}
      previewFptilbakeCallback={props.previewFptilbakeCallback}
      featureToggles={featureToggles}
      readOnlySubmitButton={readOnlySubmitButton}
      submitCallback={handleSubmit}
      isReadOnly={props.isReadOnly}
      isAksjonspunktOpen={harApentAksjonspunkt}
    />
  );
}
