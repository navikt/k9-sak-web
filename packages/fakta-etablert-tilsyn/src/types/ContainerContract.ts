interface ContainerContract {
  readOnly: boolean;
  endpoints: {
    tilsyn: string;
    sykdom: string;
    sykdomInnleggelse: string;
  };
  lagreBeredskapvurdering: (data: any) => void;
  lagreNattevåkvurdering: (data: any) => void;
  harUløstAksjonspunktForBeredskap: boolean;
  harUløstAksjonspunktForNattevåk: boolean;
  harLøstAksjonspunktForBeredskap: boolean;
  harLøstAksjonspunktForNattevåk: boolean;
  /** Om saksbehandler kan redigere vurderinger, med ordinært aksjonspunkt eller overstyringsaksjonspunkt. */
  kanRedigereBeredskap: boolean;
  kanRedigereNattevåk: boolean;
}

export default ContainerContract;
