import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePanelRegistrering } from '../hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '../hooks/useStandardProsessPanelProps.js';
import { useErValgtPanel } from '../context/ValgtPanelContext.js';
import type { ProsessPanelProps } from '../types/panelTypes.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { k9_kodeverk_vilkår_Utfall as VilkarUtfall } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { UttakProsessStegPanel } from './UttakProsessStegPanel.js';
import BehandlingUttakBackendClient from '@k9-sak-web/gui/prosess/uttak/BehandlingUttakBackendClient.js';
import { arbeidsgiver_getArbeidsgiverOpplysninger } from '@k9-sak-web/backend/k9sak/generated/sdk.js';

/**
 * V2 InitPanel for Uttak - Fullt migrert
 * 
 * Denne komponenten:
 * - Registrerer panelet med v2 ProsessMeny
 * - Henter uttaksdata via React Query + OpenAPI-generert client
 * - Beregner paneltype basert på data og aksjonspunkter
 * - Rendrer v2 UttakProsessStegPanel direkte
 * - Bruker Context API for å sjekke om panelet er valgt
 * - Bruker kun OpenAPI-genererte typer (ingen legacy kodeverk)
 */

// Panel-identitet som konstanter
const PANEL_ID = 'uttak';
const PANEL_TEKST = 'Behandlingspunkt.Uttak';

// Relevante aksjonspunkter for uttak
const RELEVANTE_AKSJONSPUNKTER = [
  AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
  AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
  AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK,
  AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
];

const uttakClient = new BehandlingUttakBackendClient();

export function UttakProsessStegInitPanel(props: ProsessPanelProps) {
  // Bruk props.erValgt for hybrid-modus kompatibilitet
  // (Context API brukes kun i full v2-modus)
  const erValgt = props.erValgt ?? useErValgtPanel(PANEL_ID);

  // Hent standard props for å få tilgang til aksjonspunkter og behandling
  const standardProps = useStandardProsessPanelProps();

  // Hent uttaksdata via React Query
  const { data: uttak } = useQuery({
    queryKey: ['uttak', standardProps.behandling.uuid],
    queryFn: () => uttakClient.hentUttak(standardProps.behandling.uuid),
    enabled: !!standardProps.behandling.uuid,
  });

  // Hent arbeidsforhold via React Query
  const { data: arbeidsforhold } = useQuery({
    queryKey: ['arbeidsforhold', standardProps.behandling.uuid],
    queryFn: async () => {
      const result = await arbeidsgiver_getArbeidsgiverOpplysninger({
        query: { behandlingUuid: standardProps.behandling.uuid },
      });
      return result.data ?? [];
    },
    enabled: !!standardProps.behandling.uuid,
  });

  // Beregn paneltype basert på uttaksdata og aksjonspunkter (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Sjekk først om det finnes åpne aksjonspunkter for dette panelet
    const harApenAksjonspunkt = standardProps.aksjonspunkter?.some(
      ap => RELEVANTE_AKSJONSPUNKTER.includes(ap.definisjon?.kode) && ap.status?.kode === 'OPPR',
    );

    // Hvis det er åpent aksjonspunkt, vis warning (gul/oransje)
    if (harApenAksjonspunkt) {
      return ProcessMenuStepType.warning;
    }

    // Hvis data ikke er lastet ennå, bruk default
    if (!uttak) {
      return ProcessMenuStepType.default;
    }

    // Sjekk om uttaksplan eksisterer og har perioder
    if (
      !uttak.uttaksplan ||
      !uttak.uttaksplan.perioder ||
      (uttak.uttaksplan.perioder && Object.keys(uttak.uttaksplan.perioder).length === 0)
    ) {
      return ProcessMenuStepType.default;
    }

    const uttaksperiodeKeys = Object.keys(uttak.uttaksplan.perioder);
    const perioder = uttak.uttaksplan.perioder;

    // Hvis alle perioder er ikke oppfylt, vis danger
    if (uttaksperiodeKeys.every(key => perioder?.[key]?.utfall === VilkarUtfall.IKKE_OPPFYLT)) {
      return ProcessMenuStepType.danger;
    }

    // Hvis noen perioder er oppfylt, vis success
    if (uttaksperiodeKeys.some(key => perioder?.[key]?.utfall === VilkarUtfall.OPPFYLT)) {
      return ProcessMenuStepType.success;
    }

    return ProcessMenuStepType.default;
  }, [uttak, standardProps.aksjonspunkter]);

  // Registrer panel med v2 menyen
  usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);

  // Render kun hvis panelet er valgt (via Context API)
  if (!erValgt) {
    return null;
  }

  // Render v2 UttakProsessStegPanel med data
  return <UttakProsessStegPanel {...props} uttak={uttak} arbeidsforhold={arbeidsforhold} />;
}
