import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { use, useContext, useMemo } from 'react';

import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { Aksjonspunkt, Behandling, Fagsak } from '@k9-sak-web/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';
import { K9SakProsessApi } from './api/K9SakProsessApi';

const RELEVANTE_AKSJONSPUNKTER = [
  AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
  AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
];

// Definer panel-identitet som konstanter
const PANEL_ID = prosessStegCodes.AVREGNING;
const PANEL_TEKST = 'Simulering';

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

/**
 * InitPanel for simulering/avregning prosesssteg
 *
 * Wrapper for AvregningProsessIndex som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Datahenting via RequestApi
 * - Rendering av legacy panelkomponent
 */
export function SimuleringProsessStegInitPanel(props: Props) {
  const { data: aksjonspunkter = [] } = useSuspenseQuery({
    queryKey: ['aksjonspunkter', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getAksjonspunkter(props.behandling.uuid),
  });
  const featureToggles = use(FeatureTogglesContext);
  const context = useContext(ProsessPanelContext);

  // Hent data ved bruk av eksisterende RequestApi-mønster
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

  // Beregn paneltype basert på aksjonspunkter (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Hvis det finnes åpne aksjonspunkter relatert til simulering, vis warning
    const harApentAksjonspunkt = props.aksjonspunkterMedKodeverk?.some(
      ap =>
        ap.status.kode === 'OPPR' &&
        (ap.definisjon.kode === AksjonspunktDefinisjon.VURDER_FEILUTBETALING ||
          ap.definisjon.kode === AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING),
    );

    if (harApentAksjonspunkt) {
      return ProcessMenuStepType.warning;
    }

    // Hvis simulering er utført, vis success
    if (restApiData.data?.simuleringResultat) {
      return ProcessMenuStepType.success;
    }

    // Ellers vis default (ingen status)
    return ProcessMenuStepType.default;
  }, [props.aksjonspunkterMedKodeverk, restApiData.data?.simuleringResultat]);

  const erValgt = context?.erValgt(PANEL_ID);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelType);

  const relevanteAksjonspunkter = props.aksjonspunkterMedKodeverk?.filter(ap =>
    RELEVANTE_AKSJONSPUNKTER.some(relevantAksjonspunkt => relevantAksjonspunkt === ap.definisjon.kode),
  );

  const erStegVurdert = panelType !== ProcessMenuStepType.default;

  const data = restApiData.data;

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!erValgt || !data) {
    return null;
  }

  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  // Beregn readOnlySubmitButton basert på aksjonspunkter
  // Hvis det finnes åpne aksjonspunkter, skal submit-knappen ikke være read-only
  const harApentAksjonspunkt = relevanteAksjonspunkter?.some(ap => ap.status.kode === 'OPPR');
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
