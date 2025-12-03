import { useMemo } from 'react';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/hooks/useStandardProsessPanelProps.js';
import type { ProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/types/panelTypes.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';

import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';

/**
 * Sjekker om beregningsresultatet kun inneholder avslåtte uttak
 */
const harKunAvslåtteUttak = (beregningsresultatUtbetaling: any): boolean => {
  if (!beregningsresultatUtbetaling?.perioder) {
    return false;
  }
  const { perioder } = beregningsresultatUtbetaling;
  const alleUtfall = perioder.flatMap(({ andeler }) => [
    ...andeler.flatMap(({ uttak }) => [...uttak.flatMap(({ utfall }) => utfall)]),
  ]);
  return !alleUtfall.some(utfall => utfall === 'INNVILGET');
};

/**
 * InitPanel for tilkjent ytelse prosesssteg
 * 
 * Wrapper for TilkjentYtelseProsessIndex som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Datahenting via RequestApi
 * - Rendering av legacy panelkomponent
 */
export function TilkjentYtelseProsessStegInitPanel(props: ProsessPanelProps) {
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.TILKJENT_YTELSE;
  const PANEL_TEKST = 'Behandlingspunkt.TilkjentYtelse';

  // Hent arbeidsgiverOpplysningerPerId fra context (kommer fra parent props)
  const { arbeidsgiverOpplysningerPerId } = useStandardProsessPanelProps();

  // Hent data ved bruk av eksisterende RequestApi-mønster
  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    beregningsresultatUtbetaling: any;
    personopplysninger: any;
  }>(
    [
      { key: PleiepengerBehandlingApiKeys.BEREGNINGSRESULTAT_UTBETALING },
      { key: PleiepengerBehandlingApiKeys.PERSONOPPLYSNINGER },
    ],
    { keepData: true, suspendRequest: false, updateTriggers: [] },
  );

  // Beregn paneltype basert på beregningsresultat (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    const beregningsresultatUtbetaling = restApiData.data?.beregningsresultatUtbetaling;
    
    // Hvis ingen data, vis default (ingen status)
    if (!beregningsresultatUtbetaling) {
      return ProcessMenuStepType.default;
    }
    
    // Hvis kun avslåtte uttak, vis danger (rød)
    if (harKunAvslåtteUttak(beregningsresultatUtbetaling)) {
      return ProcessMenuStepType.danger;
    }
    
    // Ellers vis success (grønn hake)
    return ProcessMenuStepType.success;
  }, [restApiData.data?.beregningsresultatUtbetaling]);

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
    <ProsessDefaultInitPanel urlKode={prosessStegCodes.TILKJENT_YTELSE} tekstKode="Behandlingspunkt.TilkjentYtelse">
      {standardProps => {
        // Legacy komponent krever deep copy og kodeverkkonvertering
        const deepCopyProps = JSON.parse(JSON.stringify(standardProps));
        konverterKodeverkTilKode(deepCopyProps, false);

        return (
          <TilkjentYtelseProsessIndex
            {...standardProps}
            {...deepCopyProps}
            fagsak={standardProps.fagsak}
            beregningsresultat={data.beregningsresultatUtbetaling}
            personopplysninger={data.personopplysninger}
            arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          />
        );
      }}
    </ProsessDefaultInitPanel>
  );
}
