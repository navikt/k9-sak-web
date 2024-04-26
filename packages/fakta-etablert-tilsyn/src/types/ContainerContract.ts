interface ContainerContract {
  readOnly: boolean;
  endpoints: {
    tilsyn: string;
    sykdom: string;
    sykdomInnleggelse: string;
  };
  httpErrorHandler: (statusCode: number, locationHeader?: string) => void;
  lagreBeredskapvurdering: (data: any) => void;
  lagreNattevåkvurdering: (data: any) => void;
  harAksjonspunktForBeredskap: boolean;
  harAksjonspunktForNattevåk: boolean;
}

export default ContainerContract;
