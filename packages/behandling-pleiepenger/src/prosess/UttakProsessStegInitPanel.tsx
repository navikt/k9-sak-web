import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import Uttak from '@k9-sak-web/gui/prosess/uttak/Uttak.js';
import { Behandling } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { K9SakProsessApi } from './api/K9SakProsessApi';
import { aksjonspunkterQueryOptions, behandlingQueryOptions } from './api/k9SakQueryOptions';

// Relevante aksjonspunkter for uttak
const RELEVANTE_AKSJONSPUNKTER = [
  aksjonspunktCodes.VENT_ANNEN_PSB_SAK,
  aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK,
  aksjonspunktCodes.OVERSTYRING_AV_UTTAK_KODE,
  aksjonspunktCodes.VURDER_OVERLAPPENDE_SØSKENSAK_KODE,
];

// Definer panel ID og tekst som konstanter
const panelId = 'uttak';
const panelTekst = 'Uttak';

interface Props {
  behandling: Behandling;
  api: K9SakProsessApi;
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<Behandling>;
  erOverstyrer: boolean;
  isReadOnly: boolean;
}

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
export function UttakProsessStegInitPanel(props: Props) {
  const context = useContext(ProsessPanelContext);

  const { data: behandlingV2, refetch: refetchBehandlingV2 } = useSuspenseQuery(
    behandlingQueryOptions(props.api, props.behandling),
  );

  const { data: aksjonspunkter = [] } = useSuspenseQuery(aksjonspunkterQueryOptions(props.api, props.behandling));

  const { data: uttak } = useSuspenseQuery({
    queryKey: ['uttak', props.behandling.uuid, props.behandling.versjon],
    queryFn: () => props.api.getUttaksplan(props.behandling.uuid),
  });

  // Beregn paneltype basert på uttaksdata og aksjonspunkter (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Sjekk først om det finnes åpne aksjonspunkter for dette panelet
    const harApenAksjonspunkt = aksjonspunkter?.some(
      ap => RELEVANTE_AKSJONSPUNKTER.some(kode => kode === ap.definisjon) && ap.status === 'OPPR',
    );

    // Hvis det er åpent aksjonspunkt, vis warning (gul/oransje)
    if (harApenAksjonspunkt) {
      console.debug('Uttak panel: Har åpent aksjonspunkt, viser warning');
      return ProcessMenuStepType.warning;
    }

    // Hvis data ikke er lastet ennå, bruk default
    if (!uttak) {
      console.debug('Uttak panel: Data ikke lastet, viser default');
      return ProcessMenuStepType.default;
    }

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

    // Hvis alle perioder er ikke oppfylt, vis danger
    if (uttaksperiodeKeys.every(key => perioder?.[key]?.utfall === vilkarUtfallType.IKKE_OPPFYLT)) {
      console.debug('Uttak panel: Alle perioder ikke oppfylt, viser danger');
      return ProcessMenuStepType.danger;
    }

    // Ellers (hvis ikke alle er IKKE_OPPFYLT), vis success
    // Dette matcher legacy-logikken: getOverstyrtStatus returnerer OPPFYLT hvis ikke alle er IKKE_OPPFYLT
    return ProcessMenuStepType.success;
  }, [uttak, aksjonspunkter]);

  // Registrer panel med v2 menyen
  // Registreres først med 'default', oppdateres automatisk når panelType endres
  const erValgt = context?.erValgt(panelId);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, panelId, panelTekst, panelType);

  const erStegVurdert = panelType !== ProcessMenuStepType.default;

  if (!erValgt) {
    return null;
  }
  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  const relevanteAksjonspunkter = aksjonspunkter?.filter(ap =>
    RELEVANTE_AKSJONSPUNKTER.some(kode => kode === ap.definisjon),
  );

  const hentBehandling = async () => {
    if (props.hentBehandling) {
      await props.hentBehandling();
    }
    await refetchBehandlingV2();
  };

  return (
    <Uttak
      uttak={uttak}
      behandling={behandlingV2}
      aksjonspunkter={aksjonspunkter}
      relevanteAksjonspunkter={relevanteAksjonspunkter}
      hentBehandling={hentBehandling}
      erOverstyrer={props.erOverstyrer}
      readOnly={props.isReadOnly}
    />
  );
}
