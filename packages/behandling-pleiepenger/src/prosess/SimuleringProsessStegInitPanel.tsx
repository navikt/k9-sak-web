import { useMemo } from 'react';
import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/hooks/useStandardProsessPanelProps.js';
import type { ProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/types/panelTypes.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';

import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';

/**
 * InitPanel for simulering/avregning prosesssteg
 * 
 * Wrapper for AvregningProsessIndex som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Datahenting via RequestApi
 * - Rendering av legacy panelkomponent
 */
export function SimuleringProsessStegInitPanel(props: ProsessPanelProps) {
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.AVREGNING;
  const PANEL_TEKST = 'Behandlingspunkt.Avregning';

  // Hent standard props fra context
  const { aksjonspunkter, fagsak, previewFptilbakeCallback, featureToggles } = useStandardProsessPanelProps();

  // Hent data ved bruk av eksisterende RequestApi-mønster
  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    simuleringResultat: any;
    tilbakekrevingvalg: any;
  }>(
    [
      { key: PleiepengerBehandlingApiKeys.SIMULERING_RESULTAT },
      { key: PleiepengerBehandlingApiKeys.TILBAKEKREVINGVALG },
    ],
    { keepData: true, suspendRequest: false, updateTriggers: [] },
  );

  // Beregn paneltype basert på aksjonspunkter (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Hvis det finnes åpne aksjonspunkter relatert til simulering, vis warning
    const harApentAksjonspunkt = aksjonspunkter?.some(
      ap =>
        !ap.erAvbrutt &&
        ap.status === 'OPPR' &&
        (ap.definisjon === AksjonspunktDefinisjon.VURDER_FEILUTBETALING ||
          ap.definisjon === AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING),
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
  }, [aksjonspunkter, restApiData.data?.simuleringResultat]);

  // Registrer panel med menyen
  usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!props.erValgt) {
    return null;
  }

  // Ikke vis panelet hvis data ikke er lastet ennå
  // TODO: Bruk Suspense for datahenting i fremtiden
  const data = restApiData.data;
  if (!data) {
    return null;
  }

  return (
    // Bruker ProsessDefaultInitPanel for å hente standard props og rendre legacy panel
    <ProsessDefaultInitPanel urlKode={prosessStegCodes.AVREGNING} tekstKode="Behandlingspunkt.Avregning">
      {standardProps => {
        // Beregn readOnlySubmitButton basert på aksjonspunkter
        // Hvis det finnes åpne aksjonspunkter, skal submit-knappen ikke være read-only
        const harApentAksjonspunkt = standardProps.aksjonspunkter?.some(
          ap => !ap.erAvbrutt && ap.status === 'OPPR',
        );
        const readOnlySubmitButton = !harApentAksjonspunkt;

        return (
          <AvregningProsessIndex
            {...standardProps}
            fagsak={fagsak}
            simuleringResultat={data.simuleringResultat}
            tilbakekrevingvalg={data.tilbakekrevingvalg}
            previewFptilbakeCallback={previewFptilbakeCallback}
            featureToggles={featureToggles}
            readOnlySubmitButton={readOnlySubmitButton}
          />
        );
      }}
    </ProsessDefaultInitPanel>
  );
}
