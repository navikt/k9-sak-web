import { createContext, useContext, type ReactNode } from 'react';

/**
 * Standard props som alle prosesspaneler mottar.
 * Bruker 'any' type for legacy-data for å unngå import av legacy-typer i v2-kode.
 */
export interface StandardProsessPanelPropsContextValue {
    /** Behandling-objekt (legacy type) */
    behandling: any;

    /** Fagsak-objekt (legacy type) */
    fagsak: any;

    /** Liste av aksjonspunkter (legacy type) */
    aksjonspunkter: any[];

    /** Liste av vilkår (legacy type) */
    vilkar?: any[];

    /** Alle kodeverk med navn (legacy type) */
    alleKodeverk: any;

    /** Callback for å submitte aksjonspunkt */
    submitCallback: (aksjonspunktModels: any[]) => Promise<any>;

    /** Callback for å forhåndsvise dokument */
    previewCallback?: (data: any) => Promise<any>;

    /** Om panelet er read-only */
    isReadOnly: boolean;

    /** Rettigheter-objekt (legacy type) */
    rettigheter?: any;

    /** Feature toggles (legacy type) */
    featureToggles?: any;

    /** Form data for Redux forms (legacy type) */
    formData?: any;

    /** Callback to update form data (legacy type) */
    setFormData?: (data: any) => void;
}

/**
 * Context for standard prosesspanel props.
 * Leverer felles data til alle prosesspaneler via useStandardProsessPanelProps hook.
 */
const StandardProsessPanelPropsContext = createContext<StandardProsessPanelPropsContextValue | undefined>(undefined);

/**
 * Props for StandardProsessPanelPropsProvider
 */
interface StandardProsessPanelPropsProviderProps {
    value: StandardProsessPanelPropsContextValue;
    children: ReactNode;
}

/**
 * Provider-komponent som leverer standard prosesspanel props til alle child-komponenter.
 *
 * Denne komponenten skal wrappes rundt ProsessMeny i legacy behandlingskomponenter
 * for å gjøre behandlingsdata tilgjengelig for v2 prosesspaneler.
 *
 * @example
 * ```tsx
 * // I PleiepengerProsess.tsx
 * <StandardProsessPanelPropsProvider
 *   value={{
 *     behandling,
 *     fagsak,
 *     aksjonspunkter: data.aksjonspunkter,
 *     alleKodeverk,
 *     submitCallback: lagreAksjonspunkter,
 *     previewCallback,
 *     isReadOnly: !rettigheter.writeAccess.isEnabled,
 *     rettigheter,
 *     featureToggles,
 *   }}
 * >
 *   <ProsessMeny>
 *     <VarselProsessStegInitPanel />
 *   </ProsessMeny>
 * </StandardProsessPanelPropsProvider>
 * ```
 */
export function StandardProsessPanelPropsProvider({ value, children }: StandardProsessPanelPropsProviderProps) {
    return (
        <StandardProsessPanelPropsContext.Provider value={value}>{children}</StandardProsessPanelPropsContext.Provider>
    );
}

/**
 * Hook for å hente standard prosesspanel props fra context.
 *
 * Denne hooken må brukes innenfor en StandardProsessPanelPropsProvider.
 * Kaster feil hvis brukt utenfor provider.
 *
 * @returns StandardProsessPanelPropsContextValue med all nødvendig data
 * @throws Error hvis brukt utenfor StandardProsessPanelPropsProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { behandling, aksjonspunkter } = useStandardProsessPanelPropsContext();
 *   // ...
 * }
 * ```
 */
export function useStandardProsessPanelPropsContext(): StandardProsessPanelPropsContextValue {
    const context = useContext(StandardProsessPanelPropsContext);

    if (context === undefined) {
        throw new Error(
            'useStandardProsessPanelPropsContext må brukes innenfor en StandardProsessPanelPropsProvider. ' +
            'Sørg for at ProsessMeny er wrappet med StandardProsessPanelPropsProvider i behandlingskomponenten.',
        );
    }

    return context;
}

/**
 * Optional variant av useStandardProsessPanelPropsContext som returnerer undefined
 * hvis brukt utenfor provider (f.eks. i Storybook).
 *
 * @returns StandardProsessPanelPropsContextValue eller undefined
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const context = useStandardProsessPanelPropsContextOptional();
 *   if (!context) {
 *     // Fallback for Storybook/testing
 *     return <div>Mock data</div>;
 *   }
 *   // ...
 * }
 * ```
 */
export function useStandardProsessPanelPropsContextOptional():
    | StandardProsessPanelPropsContextValue
    | undefined {
    return useContext(StandardProsessPanelPropsContext);
}
