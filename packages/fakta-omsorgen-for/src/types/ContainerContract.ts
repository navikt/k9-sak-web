export interface ContainerContract {
  endpoints: {
    omsorgsperioder: string;
  };
  readOnly: boolean;
  onFinished: (vurdering, fosterbarnForOmsorgspenger) => void;
  httpErrorHandler: (statusCode: number, locationHeader?: string) => void;
  sakstype?: string;
}
