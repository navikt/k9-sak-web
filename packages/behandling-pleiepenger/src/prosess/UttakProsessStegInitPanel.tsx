import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import Uttak from '@k9-sak-web/gui/prosess/uttak/Uttak.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling } from '@k9-sak-web/types';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import {
  k9_kodeverk_behandling_BehandlingStatus,
  k9_sak_kontrakt_behandling_BehandlingDto,
} from '@navikt/k9-sak-typescript-client/types';
import { useQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { K9SakProsessApi } from './K9SakProsessApi';

// Relevante aksjonspunkter for uttak
const RELEVANTE_AKSJONSPUNKTER = [
  aksjonspunktCodes.VENT_ANNEN_PSB_SAK,
  aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK,
  aksjonspunktCodes.OVERSTYRING_AV_UTTAK_KODE,
  aksjonspunktCodes.VURDER_OVERLAPPENDE_SØSKENSAK_KODE,
];

interface Props {
  behandling: Behandling;
  api: K9SakProsessApi;
  hentBehandling?: (params?: any, keepData?: boolean) => Promise<k9_sak_kontrakt_behandling_BehandlingDto>;
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
  // Definer panel ID og tekst som konstanter
  const panelId = 'uttak';
  const panelTekst = 'Behandlingspunkt.Uttak';

  const { data: aksjonspunkter = [] } = useQuery({
    queryKey: ['aksjonspunkter', props.behandling.uuid],
    queryFn: () => props.api.getAksjonspunkter(props.behandling.uuid),
  });

  const { data: uttak } = useQuery({
    queryKey: ['uttak', props.behandling.uuid],
    queryFn: () => props.api.getUttaksplan(props.behandling.uuid),
  });

  // Hent uttaksdata for å beregne paneltype
  // const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
  //   uttak: any;
  //   arbeidsforhold: any;
  // }>([{ key: PleiepengerBehandlingApiKeys.UTTAK }, { key: PleiepengerBehandlingApiKeys.ARBEIDSFORHOLD }], {
  //   keepData: true,
  //   suspendRequest: false,
  //   updateTriggers: [],
  // });

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
    console.debug('Uttak panel: Ikke alle perioder ikke oppfylt, viser success');
    return ProcessMenuStepType.success;
  }, [uttak, aksjonspunkter]);

  // Registrer panel med v2 menyen
  // Registreres først med 'default', oppdateres automatisk når panelType endres
  const erValgt = context?.erValgt(panelId);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, panelId, panelTekst, panelType);

  if (!erValgt || !uttak) {
    return null;
  }

  const relevanteAksjonspunkter = aksjonspunkter?.filter(ap =>
    RELEVANTE_AKSJONSPUNKTER.some(kode => kode === ap.definisjon),
  );

  return (
    // Bruker ProsessDefaultInitPanel for å hente standard props og rendre legacy panel
    <ProsessDefaultInitPanel urlKode={prosessStegCodes.UTTAK} tekstKode="Behandlingspunkt.Uttak">
      {() => {
        const behandling = {
          uuid: props.behandling.uuid,
          id: props.behandling.id,
          versjon: props.behandling.versjon,
          status: props.behandling.status.kode as k9_kodeverk_behandling_BehandlingStatus,
          sakstype: props.behandling.sakstype,
        };
        return (
          <Uttak
            uttak={uttak}
            behandling={behandling}
            aksjonspunkter={aksjonspunkter}
            relevanteAksjonspunkter={relevanteAksjonspunkter}
            hentBehandling={props.hentBehandling}
            erOverstyrer={props.erOverstyrer}
            readOnly={props.isReadOnly}
          />
        );
      }}
    </ProsessDefaultInitPanel>
  );
}
