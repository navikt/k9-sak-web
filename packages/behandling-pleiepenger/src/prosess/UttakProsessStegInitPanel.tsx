import { useMemo } from 'react';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/hooks/useStandardProsessPanelProps.js';
import { useErValgtPanel } from '@k9-sak-web/gui/behandling/prosess/context/ValgtPanelContext.js';
import type { ProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/types/panelTypes.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { UttakProsessStegPanel } from '@k9-sak-web/gui/behandling/prosess/uttak/UttakProsessStegPanel.js';

import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';

/**
 * InitPanel for Uttak - Fullt migrert til v2
 * 
 * Denne komponenten:
 * - Registrerer panelet med v2 ProsessMeny
 * - Henter uttaksdata via RequestApi
 * - Beregner paneltype basert på data og aksjonspunkter
 * - Rendrer v2 UttakProsessStegPanel direkte
 * - Bruker Context API for å sjekke om panelet er valgt
 */
export function UttakProsessStegInitPanel(props: ProsessPanelProps) {
  // Definer panel ID og tekst som konstanter
  const panelId = 'uttak';
  const panelTekst = 'Behandlingspunkt.Uttak';
  
  // Sjekk om dette panelet er valgt via Context API
  const erValgt = useErValgtPanel(panelId);

  // Hent standard props for å få tilgang til aksjonspunkter
  const standardProps = useStandardProsessPanelProps();

  // Hent uttaksdata
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

  // Relevante aksjonspunkter for uttak
  const RELEVANTE_AKSJONSPUNKTER = [
    AksjonspunktDefinisjon.VENT_ANNEN_PSB_SAK,
    AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK,
    AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK,
    AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER,
  ];

  // Beregn paneltype basert på uttaksdata og aksjonspunkter (for menystatusindikator)
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
  usePanelRegistrering(props, panelId, panelTekst, panelType);

  // Render kun hvis panelet er valgt (via Context API)
  if (!erValgt) {
    console.log('UttakProsessStegInitPanel: Ikke valgt, returnerer null');
    return null;
  }

  console.log('UttakProsessStegInitPanel: RENDERING CONTENT!', {
    hasUttak: !!restApiData.data?.uttak,
    hasArbeidsforhold: !!restApiData.data?.arbeidsforhold,
  });

  // Render v2 UttakProsessStegPanel med data
  return (
    <UttakProsessStegPanel
      {...props}
      uttak={restApiData.data?.uttak}
      arbeidsforhold={restApiData.data?.arbeidsforhold}
    />
  );
}
