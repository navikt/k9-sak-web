import type { ReactNode } from 'react';
import { useProsessMenyRegistrerer } from './hooks/useProsessMenyRegistrerer.js';
import { useStandardProsessPanelProps, type StandardProsessPanelProps } from './hooks/useStandardProsessPanelProps.js';
import { useProsessMenyContextOptional } from './context/ProsessMenyContext.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

/**
 * Props for ProsessDefaultInitPanel wrapper-komponent.
 */
interface ProsessDefaultInitPanelProps {
  /** URL-parameterverdi (kebab-case, f.eks. "beregning", "varsel-om-revurdering") */
  urlKode: string;

  /**
   * i18n tekstnøkkel for menylabel (f.eks. "Beregning.Title")
   * TODO: Usikker, skal vi ha med denne?
   * */
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
   * Hvis ikke oppgitt, brukes ProcessMenuStepType.default.
   *
   * @param data - Standard panelprops med behandling, aksjonspunkter, etc.
   * @returns Menytype (ProcessMenuStepType.warning | success | danger | default)
   */
  getMenyType?: (data: StandardProsessPanelProps) => ProcessMenuStepType;

  /** Vis delvis fullføringsindikator for paneler som er delvis fullført */
  usePartialStatus?: boolean;

  /**
   * Legacy panelkomponent sendt som render prop.
   * Mottar standard panelprops som argument.
   *
   * @param props - Standard panelprops
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
 * - Beregning av menystatus via getMenyType
 * - Registrering med prosessmenyen via useProsessMenyRegistrerer
 * - Rendering av legacy panelkomponent via children render prop
 *
 * Følger v2-prinsipper:
 * - Ingen manuell loading/error håndtering (håndteres av Suspense/ErrorBoundary)
 * - Antar at data alltid er tilgjengelig når komponenten rendres
 * - Bruker 'any' type for legacy-data for å unngå import av legacy-typer
 *
 * @example
 * ```tsx
 * // I legacy-pakke (packages/behandling-pleiepenger/src/prosess/)
 * import { ProsessDefaultInitPanel } from '@k9-sak-web/gui/behandling/prosess/ProsessDefaultInitPanel.js';
 * import VarselOmRevurderingProsessIndex from './VarselOmRevurderingProsessIndex';
 *
 * export function VarselProsessStegInitPanel() {
 *   return (
 *     <ProsessDefaultInitPanel
 *       urlKode="varsel"
 *       tekstKode="Varsel.Title"
 *       getMenyType={(data) =>
 *         data.aksjonspunkter.some(ap => ap.status === 'OPPR')
 *           ? ProcessMenuStepType.warning
 *           : ProcessMenuStepType.default
 *       }
 *     >
 *       {(standardProps) => (
 *         <VarselOmRevurderingProsessIndex {...standardProps} />
 *       )}
 *     </ProsessDefaultInitPanel>
 *   );
 * }
 * ```
 */
export function ProsessDefaultInitPanel({
  urlKode,
  tekstKode,
  skalVisePanel,
  getMenyType,
  usePartialStatus,
  children,
}: ProsessDefaultInitPanelProps) {
  // Hent standard props fra context (levert av legacy behandlingscontainer)
  const standardProps = useStandardProsessPanelProps();

  // Hent prosessmeny context hvis tilgjengelig (valgfri for standalone stories)
  const prosessMenyContext = useProsessMenyContextOptional();
  const valgtPanelId = prosessMenyContext?.valgtPanelId;

  // Evaluer synlighet hvis funksjon er oppgitt
  const erSynlig = skalVisePanel ? skalVisePanel(standardProps) : true;

  // Hvis panelet ikke skal vises (basert på skalVisePanel), returner null tidlig
  // Dette må skje før registrering for å unngå at skjulte paneler vises i menyen
  if (!erSynlig) {
    return null;
  }

  // Beregn menytype hvis funksjon er oppgitt
  const menyType = getMenyType ? getMenyType(standardProps) : ProcessMenuStepType.default;

  // Registrer panel - hooken håndterer selv om context ikke finnes
  useProsessMenyRegistrerer({
    id: urlKode,
    urlKode,
    tekstKode,
    type: menyType,
    usePartialStatus,
  });

  // Hvis vi er inne i en ProsessMeny og dette ikke er det valgte panelet, returner null
  if (prosessMenyContext && valgtPanelId !== urlKode) {
    return null;
  }

  // Render legacy panelkomponent via children render prop
  // Ingen loading/error håndtering her - håndteres av Suspense/ErrorBoundary
  // som wrapper hele behandlingskomponenten
  return <>{children(standardProps)}</>;
}
