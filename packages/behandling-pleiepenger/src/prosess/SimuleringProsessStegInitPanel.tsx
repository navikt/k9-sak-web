import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Aksjonspunkt, Behandling, Fagsak } from '@k9-sak-web/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { use, useContext } from 'react';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import { aksjonspunkterQueryOptions } from './api/k9SakQueryOptions';

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
  const { data: aksjonspunkter = [] } = useSuspenseQuery(aksjonspunkterQueryOptions(props.api, props.behandling));
  const featureToggles = use(FeatureTogglesContext);
  const prosessPanelContext = useContext(ProsessPanelContext);

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

  const erStegVurdert = prosessPanelContext?.erVurdert(PANEL_ID);

  const data = restApiData.data;

  if (!erValgt || !data) {
    return null;
  }

  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  const relevanteAksjonspunkter = props.aksjonspunkterMedKodeverk?.filter(ap =>
    RELEVANTE_AKSJONSPUNKTER.some(relevantAksjonspunkt => relevantAksjonspunkt === ap.definisjon.kode),
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
