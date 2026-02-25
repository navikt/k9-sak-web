import type { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

/**
 * Panelregistreringsdata.
 * Hvert panel registrerer seg med denne informasjonen.
 * 
 * Merk: Paneler definerer selv sin id og tekst som konstanter.
 * Denne interfacen inneholder kun data som sendes til menyen under registrering.
 */
export interface PanelRegistrering {
  /** Menystatusindikator type (warning | success | danger | default) */
  type?: ProcessMenuStepType;

  /** Vis delvis fullføringsindikator for paneler som er delvis fullført */
  usePartialStatus?: boolean;
}

/**
 * Props-interface for alle prosesspaneler.
 * 
 * Paneler definerer selv sin identitet via konstanter:
 * ```typescript
 * const PANEL_ID = 'beregning';
 * const PANEL_TEKST = 'Beregning.Title';
 * ```
 * 
 * ProsessMeny injiserer automatisk callbacks og erValgt-status til alle children.
 * Paneler bruker usePanelRegistrering hook for å håndtere registreringslogikk.
 * 
 * @example
 * ```typescript
 * export function BeregningProsessStegInitPanel(props: ProsessPanelProps) {
 *   const PANEL_ID = 'beregning';
 *   const PANEL_TEKST = 'Beregning.Title';
 *   
 *   const panelType = useMemo(() => {
 *     // Beregn type fra data
 *     return 'warning';
 *   }, [data]);
 *   
 *   usePanelRegistrering(props, PANEL_ID, PANEL_TEKST, panelType);
 *   
 *   if (!props.erValgt) return null;
 *   
 *   return <BeregningUI />;
 * }
 * ```
 */
export interface ProsessPanelProps {
  /** Callback for å registrere panelet med menyen (injiseres av ProsessMeny) */
  onRegister?: (id: string, tekst: string, info: PanelRegistrering) => void;

  /** Callback for å avregistrere panelet fra menyen (injiseres av ProsessMeny) */
  onUnregister?: (id: string) => void;

  /** Callback for å oppdatere paneltype når data endres (injiseres av ProsessMeny) */
  onUpdateType?: (id: string, type: ProcessMenuStepType) => void;

  /** Om dette panelet er valgt/aktivt (injiseres av ProsessMeny) */
  erValgt?: boolean;
}

/**
 * Re-eksporterer ProcessMenuStepType for bekvemmelighet.
 * Brukes til å indikere status på et panel i menyen.
 * 
 * - warning: Panel har åpent aksjonspunkt som krever oppmerksomhet
 * - success: Panel er fullført (vilkår oppfylt)
 * - danger: Panel har problemer (vilkår ikke oppfylt)
 * - default: Panel ikke evaluert ennå eller nøytral tilstand
 */
export type { ProcessMenuStepType };
