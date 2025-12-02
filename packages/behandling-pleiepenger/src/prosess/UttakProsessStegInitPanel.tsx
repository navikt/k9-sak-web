import { useMemo } from 'react';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/hooks/useStandardProsessPanelProps.js';
import type { ProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/types/panelTypes.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';

import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';

/**
 * InitPanel for Uttak i hybrid-modus
 * 
 * HYBRID-MODUS (v2 meny + legacy rendering):
 * - Denne komponenten registrerer panelet med v2 ProsessMeny
 * - Henter data via RequestApi for å beregne paneltype
 * - Rendrer INGENTING (returnerer null)
 * - Legacy ProsessStegPanel (utenfor ProsessMeny) håndterer rendering via UttakProsessStegPanelDef
 * 
 * LEGACY-MODUS (toggle av):
 * - Denne komponenten brukes IKKE
 * - Alt håndteres av UttakProsessStegPanelDef (klassedefinisjon)
 * 
 * FREMTID (full v2):
 * - Fjern denne wrapperen
 * - Bruk UttakProsessStegPanel direkte i ProsessMeny
 * - Flytt datahenting til React Query i UttakProsessStegPanel
 * - Fjern UttakProsessStegPanelDef
 */
export function UttakProsessStegInitPanel(props: ProsessPanelProps) {
  // Definer panel ID og tekst som konstanter
  const panelId = 'uttak';
  const panelTekst = 'Behandlingspunkt.Uttak';

  // Hent standard props for å få tilgang til aksjonspunkter
  const standardProps = useStandardProsessPanelProps();

  // Hent uttaksdata for å beregne paneltype
  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    uttak: any;
    arbeidsforhold: any;
  }>(
    [
      { key: PleiepengerBehandlingApiKeys.UTTAK },
      { key: PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD },
    ],
    { keepData: true, suspendRequest: false, updateTriggers: [] },
  );

  // Relevante aksjonspunkter for uttak (samme som i UttakProsessStegPanelDef)
  const RELEVANTE_AKSJONSPUNKTER = [
    AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
    AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
    AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK,
    AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
  ];

  // Beregn paneltype basert på uttaksdata og aksjonspunkter (for menystatusindikator)
  // VIKTIG: Starter alltid med 'default' for å sikre rask registrering
  const panelType = useMemo((): ProcessMenuStepType => {
    // Sjekk først om det finnes åpne aksjonspunkter for dette panelet
    const harApenAksjonspunkt = standardProps.aksjonspunkter?.some(
      ap => RELEVANTE_AKSJONSPUNKTER.includes(ap.definisjon?.kode) && ap.status?.kode === 'OPPR'
    );

    // Hvis det er åpent aksjonspunkt, vis warning (gul/oransje)
    if (harApenAksjonspunkt) {
      return ProcessMenuStepType.warning;
    }

    const data = restApiData.data;
    
    // Hvis data ikke er lastet ennå, bruk default
    if (!data || !data.uttak) {
      return ProcessMenuStepType.default;
    }

    const { uttak } = data;

    // Sjekk om uttaksplan eksisterer og har perioder
    if (
      !uttak.uttaksplan ||
      !uttak.uttaksplan.perioder ||
      (uttak.uttaksplan.perioder && Object.keys(uttak.uttaksplan.perioder).length === 0)
    ) {
      return ProcessMenuStepType.default;
    }

    const uttaksperiodeKeys = Object.keys(uttak.uttaksplan.perioder);

    // Hvis alle perioder er ikke oppfylt, vis danger
    if (uttaksperiodeKeys.every(key => uttak.uttaksplan.perioder[key].utfall === vilkarUtfallType.IKKE_OPPFYLT)) {
      return ProcessMenuStepType.danger;
    }

    // Hvis noen perioder er oppfylt, vis success
    if (uttaksperiodeKeys.some(key => uttak.uttaksplan.perioder[key].utfall === vilkarUtfallType.OPPFYLT)) {
      return ProcessMenuStepType.success;
    }

    return ProcessMenuStepType.default;
  }, [restApiData.data, standardProps.aksjonspunkter]);

  // Registrer panel med v2 menyen
  // Registreres først med 'default', oppdateres automatisk når panelType endres
  usePanelRegistrering(props, panelId, panelTekst, panelType);

  // Hybrid-tilnærming: Render ingenting her
  // Legacy ProsessStegPanel håndterer innholdsrendering via UttakProsessStegPanelDef
  // Dette unngår Redux-form integrasjonsproblemer
  return null;
}
