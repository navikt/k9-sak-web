import { useProsessMenyRegistrerer } from './hooks/useProsessMenyRegistrerer.js';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useStandardProsessPanelProps } from './hooks/useStandardProsessPanelProps.js';

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
 * VIKTIG: Denne komponenten er kun ment som en midlertidig bro under migrering.
 * Når alle paneler er migrert til nye InitPanel-wrappers, skal denne komponenten fjernes.
 */
export function LegacyPanelAdapter({ panelDef, menyType, usePartialStatus }: LegacyPanelAdapterProps) {
    // Hent behandlingsdata fra context
    const contextData = useStandardProsessPanelProps();
    
    // Sjekk om panelet skal vises basert på legacy-logikk
    const skalVises = panelDef.skalViseProsessSteg?.(
        contextData.fagsak,
        contextData.behandling,
        contextData.aksjonspunkter,
        contextData.vilkar || [],
        contextData.featureToggles,
    ) ?? true; // Default til true hvis metoden ikke finnes

    // Ekstraher registreringsdata fra legacy panelDef
    const urlKode = panelDef.getUrlKode();
    const tekstKode = panelDef.getTekstKode();

    // Bruk menyType fra legacy system hvis tilgjengelig, ellers default
    const type = menyType ?? ProcessMenuStepType.default;

    // Registrer panel med v2 menyen kun hvis det skal vises
    useProsessMenyRegistrerer(skalVises ? {
        id: urlKode,
        urlKode,
        tekstKode,
        type,
        usePartialStatus: usePartialStatus ?? false,
    } : null);

    // Hybrid-tilnærming: Render ingenting her
    // Legacy ProsessStegPanel håndterer innholdsrendering
    // Dette unngår Redux-form integrasjonsproblemer
    return null;
}
