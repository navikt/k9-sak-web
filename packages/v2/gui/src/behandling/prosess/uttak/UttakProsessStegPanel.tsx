import { useMemo } from 'react';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import Uttak from '@k9-sak-web/gui/prosess/uttak/Uttak.js';
import { usePanelRegistrering } from '../hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from '../hooks/useStandardProsessPanelProps.js';
import type { ProsessPanelProps } from '../types/panelTypes.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
/**
 * V2 Uttak prosesssteg panel
 * 
 * Fullt migrert v2-panel som:
 * - Registrerer seg selv med menyen via usePanelRegistrering
 * - Henter data via props (datahenting håndteres av parent)
 * - Beregner paneltype basert på uttaksdata og aksjonspunkter
 * - Rendrer Uttak-komponenten direkte
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

interface UttakProsessStegPanelProps extends ProsessPanelProps {
  /** Uttaksdata fra backend */
  uttak?: any;
  /** Arbeidsforhold data (hentet men ikke brukt direkte - tilgjengelig for fremtidig bruk) */
  arbeidsforhold?: any;
}

export function UttakProsessStegPanel(props: UttakProsessStegPanelProps) {
  const { uttak } = props;
  
  // Hent standard props fra context
  const standardProps = useStandardProsessPanelProps();

  // Beregn paneltype basert på uttaksdata og aksjonspunkter (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Sjekk først om det finnes åpne aksjonspunkter for dette panelet
    const harApenAksjonspunkt = standardProps.aksjonspunkter?.some(
      ap => RELEVANTE_AKSJONSPUNKTER.includes(ap.definisjon?.kode) && ap.status?.kode === 'OPPR'
    );

    // Hvis det er åpent aksjonspunkt, vis warning (gul)
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

    // Hvis alle perioder er ikke oppfylt, vis danger
    if (uttaksperiodeKeys.every(key => uttak.uttaksplan.perioder[key].utfall === vilkarUtfallType.IKKE_OPPFYLT)) {
      return ProcessMenuStepType.danger;
    }

    // Hvis noen perioder er oppfylt, vis success
    if (uttaksperiodeKeys.some(key => uttak.uttaksplan.perioder[key].utfall === vilkarUtfallType.OPPFYLT)) {
      return ProcessMenuStepType.success;
    }

    return ProcessMenuStepType.default;
  }, [uttak, standardProps.aksjonspunkter]);

  // Registrer panel med menyen
  usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!props.erValgt) {
    return null;
  }

  // Ikke vis panelet hvis data ikke er lastet ennå
  if (!uttak) {
    return null;
  }

  // Konverter kodeverk til kode (legacy krav for Uttak-komponenten)
  const deepCopyProps = JSON.parse(JSON.stringify({ ...standardProps, uttak }));
  konverterKodeverkTilKode(deepCopyProps, false);

  return (
    <Uttak
      uttak={deepCopyProps.uttak}
      behandling={deepCopyProps.behandling}
      aksjonspunkter={deepCopyProps.aksjonspunkter}
      relevanteAksjonspunkter={RELEVANTE_AKSJONSPUNKTER}
      readOnly={standardProps.isReadOnly}
    />
  );
}
