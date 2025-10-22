import { useProsessMenyRegistrerer } from './hooks/useProsessMenyRegistrerer.js';
import { useStandardProsessPanelProps } from './hooks/useStandardProsessPanelProps.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';

/**
 * Props for LegacyPanelAdapter-komponent.
 */
interface LegacyPanelAdapterProps {
  /**
   * Legacy paneldefinisjon (ProsessStegPanelDef-instans).
   * Bruker 'any' type for å unngå import av legacy-typer fra v2-kode.
   * 
   * Forventer at panelDef har følgende metoder:
   * - getUrlKode(): string
   * - getTekstKode(): string
   * - getKomponent(props: any): React.ComponentType
   * - getMenuType?(props: any): ProcessMenuStepType (valgfri)
   * - usePartialStatus?: boolean (valgfri)
   */
  panelDef: any;
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
 * import { VilkarProsessStegPanelDef } from '../panelDefinisjoner/prosessStegPaneler/VilkarProsessStegPanelDef';
 * 
 * function PleiepengerBehandling() {
 *   return (
 *     <ProsessMeny>
 *       {/* Nye InitPanel-wrappers */}
 *       <VarselProsessStegInitPanel />
 *       
 *       {/* Legacy klassebaserte paneler via adapter */}
 *       <LegacyPanelAdapter panelDef={new VilkarProsessStegPanelDef()} />
 *     </ProsessMeny>
 *   );
 * }
 * ```
 */
export function LegacyPanelAdapter({ panelDef }: LegacyPanelAdapterProps) {
  // Hent standard props fra context
  const standardProps = useStandardProsessPanelProps();

  // Ekstraher registreringsdata fra legacy panelDef
  const urlKode = panelDef.getUrlKode();
  const tekstKode = panelDef.getTekstKode();
  
  // Beregn menytype hvis panelDef har getMenuType-metode
  // Hvis ikke, bruk default
  const menyType = panelDef.getMenuType 
    ? panelDef.getMenuType(standardProps) 
    : ProcessMenuStepType.default;
  
  // Hent usePartialStatus hvis definert
  const usePartialStatus = panelDef.usePartialStatus || false;

  // Registrer panel med menyen
  useProsessMenyRegistrerer({
    id: urlKode,
    urlKode,
    tekstKode,
    type: menyType,
    usePartialStatus,
  });

  // Hent legacy panelkomponent fra panelDef
  // getKomponent() returnerer en React-komponent som skal rendres
  const LegacyComponent = panelDef.getKomponent(standardProps);

  // Render legacy panelkomponent
  // Ingen loading/error håndtering her - håndteres av Suspense/ErrorBoundary
  return <LegacyComponent />;
}
