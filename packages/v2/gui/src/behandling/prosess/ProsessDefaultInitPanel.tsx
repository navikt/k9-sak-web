import type { ReactNode } from 'react';
import { useStandardProsessPanelProps, type StandardProsessPanelProps } from './hooks/useStandardProsessPanelProps.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

/**
 * Props for ProsessDefaultInitPanel wrapper-komponent.
 * 
 * Denne komponenten bruker en tilnærming hvor parent-komponenten
 * (InitPanel) håndterer registrering med menyen via usePanelRegistrering.
 * 
 * ProsessDefaultInitPanel er ansvarlig for:
 * - Henting av standard panelprops fra context
 * - Evaluering av synlighetslogikk
 * - Rendering av legacy panelkomponent
 */
interface ProsessDefaultInitPanelProps {
  /** 
   * URL-parameterverdi (kebab-case, f.eks. "beregning", "varsel-om-revurdering").
   * Brukes kun for dokumentasjon og debugging - registrering håndteres av parent.
   */
  urlKode: string;

  /**
   * i18n tekstnøkkel for menylabel (f.eks. "Beregning.Title").
   * Brukes kun for dokumentasjon og debugging - registrering håndteres av parent.
   */
  tekstKode: string;

  /**
   * Funksjon som bestemmer om panelet skal vises.
   * Hvis ikke oppgitt, vises panelet alltid.
   *
   * @param data - Standard panelprops med behandling, aksjonspunkter, etc.
   * @returns true hvis panelet skal vises, false ellers
   */
  skalVisePanel?: (data: StandardProsessPanelProps) => boolean;

  /**
   * Funksjon som beregner menytype basert på paneldata.
   * Brukes av parent-komponenten for å oppdatere menystatus.
   *
   * @param data - Standard panelprops med behandling, aksjonspunkter, etc.
   * @returns Menytype (ProcessMenuStepType.warning | success | danger | default)
   */
  getMenyType?: (data: StandardProsessPanelProps) => ProcessMenuStepType;

  /**
   * Legacy panelkomponent sendt som render prop.
   * Mottar standard panelprops som argument.
   *
   * @param props - Standard panelprops (behandling, aksjonspunkter, submitCallback, etc.)
   * @returns React element å rendre
   */
  children: (props: StandardProsessPanelProps) => ReactNode;
}

/**
 * Wrapper-komponent for prosesspaneler (v2).
 *
 * Denne komponenten håndterer:
 * - Henting av standard panelprops via useStandardProsessPanelProps
 * - Evaluering av synlighetslogikk via skalVisePanel
 * - Rendering av legacy panelkomponent via children render prop
 *
 * VIKTIG: Denne komponenten håndterer IKKE registrering med menyen.
 * Det er parent-komponentens (InitPanel) ansvar å:
 * - Registrere panelet med menyen via usePanelRegistrering
 * - Sjekke props.erValgt og returnere null hvis ikke valgt
 * - Oppdatere menystatus via onUpdateType callback
 *
 * Følger v2-prinsipper:
 * - Ingen manuell loading/error håndtering (håndteres av Suspense/ErrorBoundary)
 * - Antar at data alltid er tilgjengelig når komponenten rendres
 * - Bruker 'any' type for legacy-data for å unngå import av legacy-typer
 *
 * ## Bruksmønster (props-basert):
 * ```tsx
 * // I legacy-pakke (packages/behandling-pleiepenger/src/prosess/)
 * import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
 * import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
 * import type { ProsessPanelProps } from '@k9-sak-web/gui/behandling/prosess/types/panelTypes.js';
 * import VarselOmRevurderingProsessIndex from './VarselOmRevurderingProsessIndex';
 *
 * export function VarselProsessStegInitPanel(props: ProsessPanelProps) {
 *   // 1. Definer panel-identitet som konstanter
 *   const PANEL_ID = 'varsel';
 *   const PANEL_TEKST = 'Varsel.Title';
 *   
 *   // 2. Beregn paneltype basert på data
 *   const panelType = useMemo(() => {
 *     // Logikk for å bestemme type
 *     return ProcessMenuStepType.warning;
 *   }, [data]);
 *   
 *   // 3. Registrer panel med menyen
 *   usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);
 *   
 *   // 4. Render kun hvis valgt
 *   if (!props.erValgt) return null;
 *   
 *   // 5. Bruk ProsessDefaultInitPanel for å hente standard props og rendre legacy panel
 *   return (
 *     <ProsessDefaultInitPanel urlKode={PANEL_ID} tekstKode={PANEL_TEKST}>
 *       {(standardProps) => (
 *         <VarselOmRevurderingProsessIndex {...standardProps} />
 *       )}
 *     </ProsessDefaultInitPanel>
 *   );
 * }
 * ```
 */
export function ProsessDefaultInitPanel({
  // urlKode og tekstKode brukes kun for dokumentasjon/debugging
  // Registrering håndteres av parent-komponenten (InitPanel)
  urlKode: _urlKode,
  tekstKode: _tekstKode,
  skalVisePanel,
  // getMenyType brukes av parent for å oppdatere menystatus
  // Ikke brukt direkte her siden registrering håndteres av parent
  getMenyType: _getMenyType,
  children,
}: ProsessDefaultInitPanelProps) {
  // Hent standard props fra context (levert av StandardProsessPanelPropsProvider)
  const standardProps = useStandardProsessPanelProps();

  // Evaluer synlighet hvis funksjon er oppgitt
  const erSynlig = skalVisePanel ? skalVisePanel(standardProps) : true;

  // Hvis panelet ikke skal vises (basert på skalVisePanel), returner null tidlig
  if (!erSynlig) {
    return null;
  }

  // Render legacy panelkomponent via children render prop
  // Ingen loading/error håndtering her - håndteres av Suspense/ErrorBoundary
  // som wrapper hele behandlingskomponenten
  return <>{children(standardProps)}</>;
}
