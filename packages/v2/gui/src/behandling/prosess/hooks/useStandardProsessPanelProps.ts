/**
 * Hook som gir standard props til alle prosesspaneler.
 * 
 * Denne hooken henter data fra context-providere som leveres av legacy behandlingscontainer.
 * Bruker 'any' type for legacy-data for å unngå import av legacy-typer.
 * 
 * @returns StandardProsessPanelProps - Felles props for alle prosesspaneler
 */

/**
 * Standard props interface for prosesspaneler.
 * Alle prosesspaneler mottar disse via useStandardProsessPanelProps hook.
 */
export interface StandardProsessPanelProps {
  /** Behandling-objekt (legacy ) */
  behandling: any;
  
  /** Fagsak-objekt (legacy ) */
  fagsak: any;
  
  /** Liste av aksjonspunkter (legacy ) */
  aksjonspunkter: any[];
  
  /** Kodeverk med navn (legacy type ) */
  kodeverk: any;
  
  /** Callback for å submitte aksjonspunkt */
  submitCallback: (aksjonspunktModels: any[]) => Promise<void>;
  
  isReadOnly: boolean;
  
  /** Om det finnes åpne aksjonspunkter for dette panelet */
  isAksjonspunktOpen: boolean;
  
  /** Status for panelet (f.eks. vilkårstatus) */
  status: string;
}

/**
 * Hook som gir tilgang til standard props for prosesspaneler.
 * 
 * Henter data fra context-providere som settes opp av legacy behandlingscontainer.
 * Dette lar v2-komponenter jobbe med legacy-data uten å importere legacy-kode.
 * 
 * MERK: Denne hooken forventer at følgende context-providere er satt opp av legacy-kode:
 * - BehandlingContext (behandling, submitCallback, isReadOnly)
 * - FagsakContext (fagsak)
 * - AksjonspunkterContext (aksjonspunkter, isAksjonspunktOpen)
 * - KodeverkContext (kodeverk)
 * - StatusContext (status)
 * 
 * @returns StandardProsessPanelProps med all nødvendig data for prosesspaneler
 * 
 * @example
 * ```typescript
 * function MyProsessStegInitPanel() {
 *   const standardProps = useStandardProsessPanelProps();
 *   
 *   return (
 *     <ProsessDefaultInitPanel
 *       urlKode="my-step"
 *       tekstKode="MyStep.Title"
 *     >
 *       {(props) => <MyStepPanel {...props} />}
 *     </ProsessDefaultInitPanel>
 *   );
 * }
 * ```
 */
export function useStandardProsessPanelProps(): StandardProsessPanelProps {
  // TODO: Implementer faktisk context-henting når legacy context-providere er satt opp
  // Inntill videre returnerer vi en placeholder-implementering som vil bli erstattet
  // når legacy behandlingscontainer er oppdatert til å tilby disse context-providerne.
  
  // Disse context-hookene må implementeres når legacy-kode er klar:
  // const behandling = useBehandlingContext();
  // const fagsak = useFagsakContext();
  // const aksjonspunkter = useAksjonspunkterContext();
  // const kodeverk = useKodeverkContext();
  // const submitCallback = useSubmitCallback();
  // const isReadOnly = useIsReadOnly();
  // const isAksjonspunktOpen = useIsAksjonspunktOpen();
  // const status = useStatusContext();
  
  // Placeholder-implementering som feiler hvis brukt før context er satt opp
  const notImplementedError = () => {
    throw new Error(
      'useStandardProsessPanelProps: Context providers er ikke satt opp ennå. ' +
      'Legacy behandlingscontainer må oppdateres til å tilby nødvendige context-providere ' +
      'før denne hooken kan brukes.'
    );
  };
  
  return {
    behandling: notImplementedError as any,
    fagsak: notImplementedError as any,
    aksjonspunkter: [],
    kodeverk: notImplementedError as any,
    submitCallback: async () => {
      notImplementedError();
    },
    isReadOnly: false,
    isAksjonspunktOpen: false,
    status: 'default',
  };
}
