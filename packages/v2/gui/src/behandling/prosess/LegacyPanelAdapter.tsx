import { useProsessMenyRegistrerer } from './hooks/useProsessMenyRegistrerer.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

/**
 * Props for LegacyPanelAdapter
 */
interface LegacyPanelAdapterProps {
  /**
   * Legacy paneldefinisjon (ProsessStegDef).
   * Bruker 'any' type for å unngå import av legacy-typer fra v2-kode.
   * 
   * Forventer at panelDef har følgende metoder:
   * - getUrlKode(): string
   * - getTekstKode(): string
   * - getPanelDefinisjoner(): Array<ProsessStegPanelDef>
   * 
   * ProsessStegPanelDef forventes å ha:
   * - getKomponent(props: any): React.ComponentType
   * - getEndepunkter?(): Array<string>
   * - getData?(data: any): any
   */
  panelDef: any;
  
  /**
   * Alle props som trengs for å rendre legacy paneler.
   * Sendes fra legacy behandlingskomponent.
   */
  [key: string]: any;
}

/**
 * Adapter-komponent som lar legacy klassebaserte paneldefinisjoner fungere med v2 menysystem.
 * 
 * Denne komponenten:
 * - Henter standard panelprops via useStandardProsessPanelProps
 * - Ekstraherer registreringsdata fra legacy panelDef-metoder
 * - Registrerer panelet med prosessmenyen via useProsessMenyRegistrerer
 * - Rendrer legacy panelkomponent fra panelDef.getKomponent()
 * 
 * Dette tillater gradvis migrering hvor legacy klassebaserte paneler og nye
 * komponentbaserte paneler kan eksistere side om side i samme behandling.
 * 
 * VIKTIG: Denne komponenten er kun ment som en midlertidig bro under migrering.
 * Når alle paneler er migrert til nye InitPanel-wrappers, skal denne komponenten fjernes.
 * 
 * @example
 * ```tsx
 * // I behandlingskomponent under migrering (legacy-pakke)
 * import { ProsessMeny } from '@k9-sak-web/gui/behandling/prosess/ProsessMeny.js';
 * import { LegacyPanelAdapter } from '@k9-sak-web/gui/behandling/prosess/LegacyPanelAdapter.js';
 * import { VarselProsessStegInitPanel } from '../prosess/VarselProsessStegInitPanel';
 * 
 * function PleiepengerBehandling() {
 *   return (
 *     <ProsessMeny>
 *       <VarselProsessStegInitPanel />
 *       <LegacyPanelAdapter panelDef={new VilkarProsessStegPanelDef()} />
 *     </ProsessMeny>
 *   );
 * }
 * ```
 */
export function LegacyPanelAdapter({ panelDef }: LegacyPanelAdapterProps) {
  // Ekstraher registreringsdata fra legacy panelDef
  const urlKode = panelDef.getUrlKode();
  const tekstKode = panelDef.getTekstKode();
  
  // For legacy paneler bruker vi alltid 'default' type
  // Statusberegning kan implementeres senere ved å kalle panelDef.getMenuType() hvis den finnes
  const menyType = ProcessMenuStepType.default;

  // Registrer panel med menyen
  useProsessMenyRegistrerer({
    id: urlKode,
    urlKode,
    tekstKode,
    type: menyType,
    usePartialStatus: false,
  });

  // TODO: Implementer rendering av legacy panel
  // For nå returnerer vi null siden vi trenger å integrere med ProsessStegPanel
  // Dette krever mer arbeid for å få legacy-systemet til å fungere med v2-menyen
  return null;
}
