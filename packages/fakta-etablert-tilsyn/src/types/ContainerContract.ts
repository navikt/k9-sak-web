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
  harUløstAksjonspunktForBeredskap: boolean;
  harUløstAksjonspunktForNattevåk: boolean;
  harLøstAksjonspunktForBeredskap: boolean;
  harLøstAksjonspunktForNattevåk: boolean;
}

export default ContainerContract;
