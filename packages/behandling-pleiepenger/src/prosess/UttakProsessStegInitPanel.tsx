import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/hooks/useStandardProsessPanelProps.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useContext, useMemo } from 'react';

import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';

// Relevante aksjonspunkter for uttak
const RELEVANTE_AKSJONSPUNKTER = [
  aksjonspunktCodes.VENT_ANNEN_PSB_SAK,
  aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK,
  aksjonspunktCodes.OVERSTYRING_AV_UTTAK_KODE,
  aksjonspunktCodes.VURDER_OVERLAPPENDE_SØSKENSAK_KODE,
];

/**
 * HYBRID-MODUS InitPanel for Uttak
 *
 * Denne komponenten brukes KUN i hybrid-modus (v2 meny + legacy rendering).
 *
 * HYBRID-MODUS (v2 meny + legacy rendering):
 * - Denne komponenten registrerer panelet med v2 ProsessMeny
 * - Henter data via RequestApi for å beregne paneltype
 * - Rendrer INGENTING (returnerer alltid null)
 * - Legacy ProsessStegPanel (utenfor ProsessMeny) håndterer rendering via UttakProsessStegPanelDef
 *
 * LEGACY-MODUS (toggle av):
 * - Denne komponenten brukes IKKE
 * - Alt håndteres av UttakProsessStegPanelDef (klassedefinisjon)
 *
 * FREMTID (full v2):
 * - Fjern denne wrapperen
 * - Bruk UttakProsessStegInitPanel fra v2-pakken direkte i ProsessMeny
 * - Flytt datahenting til React Query i v2-komponenten
 * - Fjern UttakProsessStegPanelDef
 */
export function UttakProsessStegInitPanel() {
  const context = useContext(ProsessPanelContext);
  // Definer panel ID og tekst som konstanter
  const panelId = 'uttak';
  const panelTekst = 'Behandlingspunkt.Uttak';

  // Hent standard props for å få tilgang til aksjonspunkter
  const standardProps = useStandardProsessPanelProps();

  // Hent uttaksdata for å beregne paneltype
  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    uttak: any;
    arbeidsforhold: any;
  }>([{ key: PleiepengerBehandlingApiKeys.UTTAK }, { key: PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD }], {
    keepData: true,
    suspendRequest: false,
    updateTriggers: [],
  });

  // Beregn paneltype basert på uttaksdata og aksjonspunkter (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Sjekk først om det finnes åpne aksjonspunkter for dette panelet
    const harApenAksjonspunkt = standardProps.aksjonspunkter?.some(
      ap => RELEVANTE_AKSJONSPUNKTER.includes(ap.definisjon?.kode) && ap.status?.kode === 'OPPR',
    );

    // Hvis det er åpent aksjonspunkt, vis warning (gul/oransje)
    if (harApenAksjonspunkt) {
      console.debug('Uttak panel: Har åpent aksjonspunkt, viser warning');
      return ProcessMenuStepType.warning;
    }

    const data = restApiData.data;

    // Hvis data ikke er lastet ennå, bruk default
    if (!data || !data.uttak) {
      console.debug('Uttak panel: Data ikke lastet, viser default');
      return ProcessMenuStepType.default;
    }

    const { uttak } = data;

    // Sjekk om uttaksplan eksisterer og har perioder
    if (
      !uttak.uttaksplan ||
      !uttak.uttaksplan.perioder ||
      (uttak.uttaksplan.perioder && Object.keys(uttak.uttaksplan.perioder).length === 0)
    ) {
      console.debug('Uttak panel: Ingen uttaksplan eller perioder, viser default');
      return ProcessMenuStepType.default;
    }

    const uttaksperiodeKeys = Object.keys(uttak.uttaksplan.perioder);
    const perioder = uttak.uttaksplan.perioder;

    console.debug('Uttak panel: Sjekker perioder', {
      antallPerioder: uttaksperiodeKeys.length,
      perioder: uttaksperiodeKeys.map(key => ({
        key,
        utfall: perioder?.[key]?.utfall,
      })),
    });

    // Hvis alle perioder er ikke oppfylt, vis danger
    if (uttaksperiodeKeys.every(key => perioder?.[key]?.utfall === vilkarUtfallType.IKKE_OPPFYLT)) {
      console.debug('Uttak panel: Alle perioder ikke oppfylt, viser danger');
      return ProcessMenuStepType.danger;
    }

    // Ellers (hvis ikke alle er IKKE_OPPFYLT), vis success
    // Dette matcher legacy-logikken: getOverstyrtStatus returnerer OPPFYLT hvis ikke alle er IKKE_OPPFYLT
    console.debug('Uttak panel: Ikke alle perioder ikke oppfylt, viser success');
    return ProcessMenuStepType.success;
  }, [restApiData.data, standardProps.aksjonspunkter]);

  // Registrer panel med v2 menyen
  // Registreres først med 'default', oppdateres automatisk når panelType endres
  const erValgt = context?.erValgt(panelId);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, panelId, panelTekst, panelType);

  // HYBRID-MODUS: Render ALLTID null
  // Legacy ProsessStegPanel håndterer innholdsrendering via UttakProsessStegPanelDef
  // Dette unngår Redux-form integrasjonsproblemer og dobbel rendering
  return null;
}
