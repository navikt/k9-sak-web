interface ContainerContract {
  readOnly: boolean;
  endpoints: {
    rettVedDod: string;
    omPleietrengende: string;
  };
  httpErrorHandler: (statusCode: number, locationHeader?: string) => void;
  onFinished: (vurdering) => void;
}

export default ContainerContract;
