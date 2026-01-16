import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { usePanelRegistrering } from './hooks/usePanelRegistrering.js';
import { useStandardProsessPanelProps } from './hooks/useStandardProsessPanelProps.js';
import type { ProsessPanelProps } from './types/panelTypes.js';

/**
 * Props for LegacyPanelAdapter
 * Kombinerer ProsessPanelProps med legacy-spesifikke props.
 */
interface LegacyPanelAdapterProps extends ProsessPanelProps {
  /**
   * Legacy paneldefinisjon (ProsessStegDef).
   * Bruker 'any' type for å unngå import av legacy-typer fra v2-kode.
   *
   * Forventer at panelDef har følgende metoder:
   * - getUrlKode(): string
   * - getTekstKode(): string
   * - getPanelDefinisjoner(): Array<ProsessStegPanelDef>
   * - skalViseProsessSteg(fagsak, behandling, aksjonspunkter, vilkar, featureToggles): boolean
   *
   * ProsessStegPanelDef forventes å ha:
   * - getKomponent(props: any): React.ComponentType
   * - getEndepunkter?(): Array<string>
   * - getData?(data: any): any
   */
  panelDef: any;

  /**
   * Menytype fra legacy system (success, warning, danger, default)
   */
  menyType?: ProcessMenuStepType;

  /**
   * Om panelet skal vise delvis status
   */
  usePartialStatus?: boolean;

  /**
   * Alle props som trengs for å rendre legacy paneler.
   * Sendes fra legacy behandlingskomponent.
   */
  [key: string]: any;
}

/**
 * Adapter-komponent for hybrid-tilnærming: v2 meny + legacy panel-rendering.
 *
 * Denne komponenten:
 * - Registrerer legacy paneler med v2 menysystem
 * - Sjekker om panelet skal vises basert på skalViseProsessSteg
 * - Håndterer IKKE rendering (det gjøres av legacy ProsessStegPanel)
 * - Beregner menystatus basert på aksjonspunkter og vilkår
 *
 * HYBRID-TILNÆRMING:
 * - v2 ProsessMeny brukes for navigasjon og menyvisning
 * - Legacy ProsessStegPanel brukes for innholdsrendering
 * - Dette unngår Redux-form integrasjonsproblemer
 * - Tillater gradvis migrering av individuelle paneler
 *
 * - Mottar ProsessPanelProps med injiserte callbacks fra ProsessMeny
 * - Definerer panel ID og tekst fra legacy panelDef
 * - Bruker usePanelRegistrering for å håndtere registreringslogikk
 * - Følger samme mønster som moderne InitPanel-komponenter
 *
 * VIKTIG: Denne komponenten er kun ment som en midlertidig bro under migrering.
 * Når alle paneler er migrert til nye InitPanel-wrappers, skal denne komponenten fjernes.
 */
export function LegacyPanelAdapter(props: LegacyPanelAdapterProps) {
  const { panelDef, menyType, ...restProps } = props;

  // Hent behandlingsdata fra context
  const contextData = useStandardProsessPanelProps();

  // Sjekk om panelet skal vises basert på legacy-logikk
  const skalVises =
    panelDef.skalViseProsessSteg?.(
      contextData.fagsak,
      contextData.behandling,
      contextData.aksjonspunkter,
      contextData.vilkar || [],
      contextData.featureToggles,
    ) ?? true; // Default til true hvis metoden ikke finnes

  // Definer panel ID og tekst fra legacy panelDef
  const panelId = panelDef.getUrlKode();
  const panelTekst = panelDef.getTekstKode();

  // Bruk menyType fra legacy system hvis tilgjengelig, ellers default
  const panelType = menyType ?? ProcessMenuStepType.default;

  // Registrer panel med v2 menyen
  // Hooks må alltid kalles (Rules of Hooks), men vi kan sende null-verdier
  // hvis panelet ikke skal vises
  usePanelRegistrering(
    skalVises ? restProps : { ...restProps, onRegister: undefined, onUnregister: undefined, onUpdateType: undefined },
    panelId,
    panelTekst,
    panelType,
  );

  // Hybrid-tilnærming: Render ingenting her
  // Legacy ProsessStegPanel håndterer innholdsrendering
  // Dette unngår Redux-form integrasjonsproblemer

  return null;
}
