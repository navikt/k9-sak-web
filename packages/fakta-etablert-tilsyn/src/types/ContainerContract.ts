interface ContainerContract {
  readOnly: boolean;
  endpoints: {
    tilsyn: string;
    sykdom: string;
    sykdomInnleggelse: string;
  };
  errorNotifier: (error: Error) => void;
  lagreBeredskapvurdering: (data: any) => void;
  lagreNattevåkvurdering: (data: any) => void;
  harAksjonspunktForBeredskap: boolean;
  harAksjonspunktForNattevåk: boolean;
}

export default ContainerContract;
