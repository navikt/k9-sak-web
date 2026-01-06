import { useMemo } from 'react';
import VarselOmRevurderingProsessIndex from '@fpsak-frontend/prosess-varsel-om-revurdering';
import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import type { ProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/types/panelTypes.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';

/**
 * InitPanel for varsel om revurdering prosesssteg
 * 
 * Wrapper for VarselOmRevurderingProsessIndex som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Datahenting via RequestApi
 * - Rendering av legacy panelkomponent
 */
export function VarselProsessStegInitPanel(props: ProsessPanelProps) {
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.VARSEL;
  const PANEL_TEKST = 'Behandlingspunkt.CheckVarselRevurdering';
  // Hent data ved bruk av eksisterende RequestApi-mønster
  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    familiehendelse: any;
    familiehendelseOriginalBehandling: any;
    soknadOriginalBehandling: any;
  }>(
    [
      { key: PleiepengerBehandlingApiKeys.FAMILIEHENDELSE },
      { key: PleiepengerBehandlingApiKeys.FAMILIEHENDELSE_ORIGINAL_BEHANDLING },
      { key: PleiepengerBehandlingApiKeys.SOKNAD_ORIGINAL_BEHANDLING },
    ],
    { keepData: true, suspendRequest: false, updateTriggers: [] },
  );

  // Beregn paneltype basert på data (for menystatusindikator)
  // Bruker default inntil data er lastet
  const panelType = useMemo((): ProcessMenuStepType => {
    return ProcessMenuStepType.default;
  }, []);

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
    <ProsessDefaultInitPanel urlKode={prosessStegCodes.VARSEL} tekstKode="Behandlingspunkt.CheckVarselRevurdering">
      {standardProps => {
        // Sørg for at previewCallback alltid er definert (legacy komponent krever det)
        const previewCallback = standardProps.previewCallback || (() => Promise.resolve());

        return (
          <VarselOmRevurderingProsessIndex
            {...standardProps}
            previewCallback={previewCallback}
            familiehendelse={data.familiehendelse}
            soknad={data.soknadOriginalBehandling}
            soknadOriginalBehandling={data.soknadOriginalBehandling}
            familiehendelseOriginalBehandling={data.familiehendelseOriginalBehandling}
          />
        );
      }}
    </ProsessDefaultInitPanel>
  );
}
